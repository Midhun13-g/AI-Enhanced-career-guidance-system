package com.careerguidance.service.impl;

import com.careerguidance.constant.ResumeStatus;
import com.careerguidance.dto.request.ResumeUpdateRequest;
import com.careerguidance.dto.response.ResumeAnalysisResponse;
import com.careerguidance.dto.response.ResumeResponse;
import com.careerguidance.entity.Resume;
import com.careerguidance.entity.ResumeAnalysis;
import com.careerguidance.entity.ResumeSkill;
import com.careerguidance.exception.BadRequestException;
import com.careerguidance.exception.DuplicateResumeException;
import com.careerguidance.exception.FileTooLargeException;
import com.careerguidance.exception.InvalidFileFormatException;
import com.careerguidance.exception.ResourceNotFoundException;
import com.careerguidance.exception.ResumeNotFoundException;
import com.careerguidance.exception.UnauthorizedException;
import com.careerguidance.repository.ResumeAnalysisRepository;
import com.careerguidance.repository.ResumeRepository;
import com.careerguidance.repository.ResumeSkillRepository;
import com.careerguidance.repository.UserRepository;
import com.careerguidance.service.ResumeParserService;
import com.careerguidance.service.ResumeService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
public class ResumeServiceImpl implements ResumeService {

    private static final long MAX_FILE_SIZE_BYTES = 5L * 1024 * 1024;

    private final ResumeRepository resumeRepository;
    private final ResumeSkillRepository resumeSkillRepository;
    private final ResumeAnalysisRepository resumeAnalysisRepository;
    private final UserRepository userRepository;
    private final ResumeParserService resumeParserService;
    private final Path storageDirectory;

    public ResumeServiceImpl(
            ResumeRepository resumeRepository,
            ResumeSkillRepository resumeSkillRepository,
            ResumeAnalysisRepository resumeAnalysisRepository,
            UserRepository userRepository,
            ResumeParserService resumeParserService,
            @Value("${resume.storage-dir:uploads/resumes}") String storageDirectory) {
        this.resumeRepository = resumeRepository;
        this.resumeSkillRepository = resumeSkillRepository;
        this.resumeAnalysisRepository = resumeAnalysisRepository;
        this.userRepository = userRepository;
        this.resumeParserService = resumeParserService;
        this.storageDirectory = Paths.get(storageDirectory).toAbsolutePath().normalize();
    }

    @Override
    @Transactional
    public ResumeResponse uploadResume(Long userId, MultipartFile file) {
        validateFile(file);

        if (resumeRepository.existsByUserIdAndOriginalFileNameAndFileSize(
                userId, file.getOriginalFilename(), file.getSize())) {
            throw new DuplicateResumeException("An identical resume has already been uploaded");
        }

        String originalFileName = Paths.get(Objects.requireNonNull(file.getOriginalFilename()))
                .getFileName()
                .toString();
        String extension = originalFileName.substring(originalFileName.lastIndexOf('.')).toLowerCase();
        String storedFileName = UUID.randomUUID() + extension;
        Path storedFilePath = storageDirectory.resolve(storedFileName);

        try {
            Files.createDirectories(storageDirectory);
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, storedFilePath, StandardCopyOption.REPLACE_EXISTING);
            }
        } catch (IOException ex) {
            throw new BadRequestException("Unable to store resume");
        }

        Resume resume = new Resume();
        resume.setUser(userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found")));
        resume.setOriginalFileName(originalFileName);
        resume.setStoredFileName(storedFileName);
        resume.setFileType(file.getContentType());
        resume.setFileSize(file.getSize());
        resume.setFilePath(storedFilePath.toString());
        resume.setStatus(ResumeStatus.UPLOADED);

        return toResponse(resumeRepository.save(resume));
    }

    @Override
    @Transactional
    public ResumeResponse parseResume(Long userId, Long resumeId) {
        Resume resume = getOwnedResume(userId, resumeId);

        try {
            replaceSkills(resume, resumeParserService.extractSkills(Path.of(resume.getFilePath())));
            resume.setStatus(ResumeStatus.PARSED);
            resumeRepository.save(resume);
            generateAnalysis(resume);
            return toResponse(resume);
        } catch (RuntimeException ex) {
            resume.setStatus(ResumeStatus.FAILED);
            resumeRepository.save(resume);
            throw ex;
        }
    }

    @Override
    @Transactional
    public ResumeResponse updateResume(Long userId, Long resumeId, ResumeUpdateRequest request) {
        Resume resume = getOwnedResume(userId, resumeId);
        if (request.getSkills() != null) {
            replaceSkills(resume, request.getSkills());
        }
        generateAnalysis(resume);
        return toResponse(resume);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ResumeResponse> getResumeHistory(Long userId) {
        return resumeRepository.findByUserIdOrderByUploadTimeDesc(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ResumeResponse getResume(Long userId, Long resumeId) {
        return toResponse(getOwnedResume(userId, resumeId));
    }

    @Override
    @Transactional(readOnly = true)
    public ResumeAnalysisResponse getAnalysis(Long userId, Long resumeId) {
        getOwnedResume(userId, resumeId);
        ResumeAnalysis analysis = resumeAnalysisRepository.findByResumeId(resumeId)
                .orElseThrow(() -> new ResumeNotFoundException(
                        "Resume analysis not found; parse the resume first"));
        return toAnalysisResponse(analysis);
    }

    @Override
    @Transactional(readOnly = true)
    public Resource downloadResume(Long userId, Long resumeId) {
        Resume resume = getOwnedResume(userId, resumeId);
        Path path = Path.of(resume.getFilePath());
        if (!Files.isRegularFile(path)) {
            throw new ResumeNotFoundException("Stored resume file not found");
        }
        return new FileSystemResource(path);
    }

    @Override
    @Transactional
    public void deleteResume(Long userId, Long resumeId) {
        Resume resume = getOwnedResume(userId, resumeId);
        try {
            Files.deleteIfExists(Path.of(resume.getFilePath()));
        } catch (IOException ex) {
            throw new BadRequestException("Unable to delete stored resume");
        }
        resumeRepository.delete(resume);
    }

    private Resume getOwnedResume(Long userId, Long resumeId) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new ResumeNotFoundException("Resume not found"));
        if (!resume.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("Resume does not belong to the authenticated user");
        }
        return resume;
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Resume is required");
        }
        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new FileTooLargeException("Resume must not exceed 5 MB");
        }

        String contentType = file.getContentType();
        boolean allowedType = "application/pdf".equals(contentType)
                || "application/vnd.openxmlformats-officedocument.wordprocessingml.document".equals(contentType);
        if (!allowedType) {
            throw new InvalidFileFormatException("Only PDF and DOCX resumes are allowed");
        }

        try (InputStream inputStream = file.getInputStream()) {
            byte[] header = inputStream.readNBytes(4);
            boolean pdf = header.length == 4 && header[0] == '%' && header[1] == 'P'
                    && header[2] == 'D' && header[3] == 'F';
            boolean docxZip = header.length == 4 && header[0] == 'P' && header[1] == 'K';
            if (!pdf && !docxZip) {
                throw new InvalidFileFormatException(
                        "Resume file is corrupted or its content does not match its type");
            }
        } catch (IOException ex) {
            throw new InvalidFileFormatException("Unable to validate resume file");
        }
    }

    private void replaceSkills(Resume resume, List<String> skillNames) {
        resumeSkillRepository.deleteByResumeId(resume.getId());
        skillNames.stream()
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(skillName -> !skillName.isBlank())
                .distinct()
                .forEach(skillName -> {
                    ResumeSkill skill = new ResumeSkill();
                    skill.setResume(resume);
                    skill.setSkillName(skillName);
                    skill.setSkillCategory("GENERAL");
                    skill.setConfidenceScore(0.8);
                    resumeSkillRepository.save(skill);
                });
    }

    private void generateAnalysis(Resume resume) {
        int skillCount = resumeSkillRepository.findByResumeId(resume.getId()).size();
        ResumeAnalysis analysis = resumeAnalysisRepository.findByResumeId(resume.getId())
                .orElseGet(ResumeAnalysis::new);
        analysis.setResume(resume);
        analysis.setSkillsDetected(skillCount);
        analysis.setProjectsDetected(0);
        analysis.setExperienceDetected(0);
        analysis.setEducationDetected(0);
        analysis.setCertificationCount(0);

        double atsScore = Math.min(100, 5 + skillCount * 10);
        analysis.setAtsScore(atsScore);
        analysis.setResumeScore(Math.min(100, atsScore + 5));
        analysis.setStrengths(skillCount > 0 ? "Skills section detected" : "Resume uploaded");
        analysis.setWeaknesses(skillCount < 3 ? "Add more relevant skills" : "No major weaknesses detected");
        analysis.setMissingInformation(skillCount < 3
                ? "Projects, experience, education, and certifications can improve the score"
                : "Add quantified project outcomes");
        analysis.setRecommendations("Tailor skills and keywords to the target job description.");
        resumeAnalysisRepository.save(analysis);
    }

    private ResumeResponse toResponse(Resume resume) {
        ResumeResponse response = new ResumeResponse();
        response.setResumeId(resume.getId());
        response.setFileName(resume.getOriginalFileName());
        response.setUploadTime(resume.getUploadTime());
        response.setStatus(resume.getStatus().name());
        response.setSkills(resumeSkillRepository.findByResumeId(resume.getId()).stream()
                .map(ResumeSkill::getSkillName)
                .toList());
        return response;
    }

    private ResumeAnalysisResponse toAnalysisResponse(ResumeAnalysis analysis) {
        ResumeAnalysisResponse response = new ResumeAnalysisResponse();
        response.setResumeScore(analysis.getResumeScore());
        response.setAtsScore(analysis.getAtsScore());
        response.setSkillsDetected(analysis.getSkillsDetected());
        response.setProjectsDetected(analysis.getProjectsDetected());
        response.setExperienceDetected(analysis.getExperienceDetected());
        response.setEducationDetected(analysis.getEducationDetected());
        response.setCertificationsDetected(analysis.getCertificationCount());
        response.setStrengths(analysis.getStrengths());
        response.setWeaknesses(analysis.getWeaknesses());
        response.setMissingInformation(analysis.getMissingInformation());
        response.setRecommendations(analysis.getRecommendations());
        return response;
    }
}
