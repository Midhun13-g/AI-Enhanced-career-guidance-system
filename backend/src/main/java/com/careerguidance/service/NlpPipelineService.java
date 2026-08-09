package com.careerguidance.service;

import com.careerguidance.constant.ResumeStatus;
import com.careerguidance.dto.nlp.NlpParseResponse;
import com.careerguidance.dto.response.ResumeEntityResponse;
import com.careerguidance.dto.response.ResumeProcessResponse;
import com.careerguidance.dto.response.StudentSkillResponse;
import com.careerguidance.entity.Resume;
import com.careerguidance.entity.ResumeAnalysisReport;
import com.careerguidance.entity.ResumeEntity;
import com.careerguidance.exception.ResumeNotFoundException;
import com.careerguidance.exception.UnauthorizedAccessException;
import com.careerguidance.repository.ResumeEntityRepository;
import com.careerguidance.repository.ResumeRepository;
import com.careerguidance.repository.StudentSkillRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class NlpPipelineService {

    private final ResumeRepository resumeRepo;
    private final ResumeEntityRepository entityRepo;
    private final StudentSkillRepository studentSkillRepo;
    private final TextExtractionService textExtractor;
    private final NlpClientService nlpClient;
    private final SkillTaxonomyService taxonomyService;
    private final ResumeAnalysisService analysisService;
    private final ProfileVectorService vectorService;

    public NlpPipelineService(ResumeRepository resumeRepo,
                               ResumeEntityRepository entityRepo,
                               StudentSkillRepository studentSkillRepo,
                               TextExtractionService textExtractor,
                               NlpClientService nlpClient,
                               SkillTaxonomyService taxonomyService,
                               ResumeAnalysisService analysisService,
                               ProfileVectorService vectorService) {
        this.resumeRepo = resumeRepo;
        this.entityRepo = entityRepo;
        this.studentSkillRepo = studentSkillRepo;
        this.textExtractor = textExtractor;
        this.nlpClient = nlpClient;
        this.taxonomyService = taxonomyService;
        this.analysisService = analysisService;
        this.vectorService = vectorService;
    }

    @Transactional
    public ResumeProcessResponse process(Long studentId, Long resumeId) {
        Resume resume = resumeRepo.findById(resumeId)
                .orElseThrow(() -> new ResumeNotFoundException("Resume not found: " + resumeId));
        if (resume.getUser() == null || !Objects.equals(resume.getUser().getId(), studentId)) {
            throw new UnauthorizedAccessException("Resume does not belong to this student");
        }

        resume.setStatus(ResumeStatus.PROCESSING);
        resumeRepo.save(resume);

        try {
            // 1. Extract text
            String text = textExtractor.extractText(Path.of(resume.getFilePath()));

            // 2. Call NLP service
            NlpParseResponse nlp = nlpClient.parse(text, resume.getOriginalFileName());

            // 3. Persist entities
            entityRepo.deleteByResumeId(resumeId);
            List<ResumeEntity> entities = buildEntities(resume, nlp);
            entityRepo.saveAll(entities);

            // 4. Normalize & upsert student skills
            List<String> rawSkills = nlp.getSkills() != null
                    ? nlp.getSkills().stream().map(NlpParseResponse.NlpSkill::getName).toList()
                    : List.of();
            taxonomyService.upsertStudentSkills(studentId, rawSkills, "RESUME");

            // 5. Score & generate report
            ResumeAnalysisReport report = analysisService.generateReport(resumeId, nlp);

            // 6. Update profile vector
            vectorService.updateResumeVector(studentId, nlp, report.getOverallScore());

            // 7. Mark completed
            resume.setStatus(ResumeStatus.COMPLETED);
            resumeRepo.save(resume);

            ResumeProcessResponse response = new ResumeProcessResponse();
            response.setResumeId(resumeId);
            response.setProcessingStatus(ResumeStatus.COMPLETED.name());
            response.setResumeScore(report.getOverallScore());
            response.setSkillsExtracted(rawSkills.size());
            response.setEntitiesExtracted(entities.size());
            response.setMessage("Resume processed successfully");
            return response;

        } catch (Exception e) {
            resume.setStatus(ResumeStatus.FAILED);
            resumeRepo.save(resume);
            throw e;
        }
    }

    public List<ResumeEntityResponse> getEntities(Long studentId, Long resumeId) {
        Resume resume = resumeRepo.findById(resumeId)
                .orElseThrow(() -> new ResumeNotFoundException("Resume not found: " + resumeId));
        if (resume.getUser() == null || !Objects.equals(resume.getUser().getId(), studentId)) {
            throw new UnauthorizedAccessException("Resume does not belong to this student");
        }
        return entityRepo.findByResumeId(resumeId).stream().map(this::toEntityResponse).toList();
    }

    public List<StudentSkillResponse> getStudentSkills(Long studentId) {
        return studentSkillRepo.findByStudentIdAndSource(studentId, "RESUME")
                .stream().map(ss -> {
                    StudentSkillResponse r = new StudentSkillResponse();
                    r.setId(ss.getId());
                    r.setSkillName(ss.getSkill().getSkillName());
                    r.setNormalizedName(ss.getSkill().getNormalizedName());
                    r.setCategory(ss.getSkill().getCategory());
                    r.setSource(ss.getSource());
                    r.setConfidence(ss.getConfidence());
                    r.setCreatedAt(ss.getCreatedAt());
                    return r;
                }).toList();
    }

    private List<ResumeEntity> buildEntities(Resume resume, NlpParseResponse nlp) {
        List<ResumeEntity> list = new ArrayList<>();
        if (nlp.getSkills() != null) {
            nlp.getSkills().forEach(s -> list.add(entity(resume, "SKILL", s.getName(), s.getConfidence())));
        }
        if (nlp.getEducation() != null) {
            nlp.getEducation().forEach(e -> list.add(entity(resume, "EDUCATION",
                    e.getDegree() + " @ " + e.getInstitution(), 0.95)));
        }
        if (nlp.getProjects() != null) {
            nlp.getProjects().forEach(p -> list.add(entity(resume, "PROJECT", p.getName(), 0.9)));
        }
        if (nlp.getCertifications() != null) {
            nlp.getCertifications().forEach(c -> list.add(entity(resume, "CERTIFICATION",
                    c.getName() + " - " + c.getProvider(), 0.95)));
        }
        if (nlp.getExperience() != null) {
            nlp.getExperience().forEach(e -> list.add(entity(resume, "EXPERIENCE",
                    e.getDesignation() + " @ " + e.getCompany(), 0.9)));
        }
        return list;
    }

    private ResumeEntity entity(Resume resume, String type, String value, Double confidence) {
        ResumeEntity e = new ResumeEntity();
        e.setResume(resume);
        e.setEntityType(type);
        e.setEntityValue(value != null ? value : "");
        e.setConfidenceScore(confidence != null ? confidence : 0.0);
        return e;
    }

    private ResumeEntityResponse toEntityResponse(ResumeEntity e) {
        ResumeEntityResponse r = new ResumeEntityResponse();
        r.setId(e.getId());
        r.setEntityType(e.getEntityType());
        r.setEntityValue(e.getEntityValue());
        r.setConfidenceScore(e.getConfidenceScore());
        r.setCreatedAt(e.getCreatedAt());
        return r;
    }
}
