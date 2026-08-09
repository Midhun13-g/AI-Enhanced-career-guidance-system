package com.careerguidance.service;

import com.careerguidance.dto.nlp.NlpParseResponse;
import com.careerguidance.dto.response.ResumeAnalysisReportResponse;
import com.careerguidance.entity.Resume;
import com.careerguidance.entity.ResumeAnalysisReport;
import com.careerguidance.exception.ResumeNotFoundException;
import com.careerguidance.repository.ResumeAnalysisReportRepository;
import com.careerguidance.repository.ResumeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ResumeAnalysisService {

    private final ResumeAnalysisReportRepository reportRepo;
    private final ResumeRepository resumeRepo;

    public ResumeAnalysisService(ResumeAnalysisReportRepository reportRepo, ResumeRepository resumeRepo) {
        this.reportRepo = reportRepo;
        this.resumeRepo = resumeRepo;
    }

    @Transactional
    public ResumeAnalysisReport generateReport(Long resumeId, NlpParseResponse nlp) {
        Resume resume = resumeRepo.findById(resumeId)
                .orElseThrow(() -> new ResumeNotFoundException("Resume not found: " + resumeId));

        int skillCount = nlp.getSkills() != null ? nlp.getSkills().size() : 0;
        int projectCount = nlp.getProjects() != null ? nlp.getProjects().size() : 0;
        int eduCount = nlp.getEducation() != null ? nlp.getEducation().size() : 0;
        int certCount = nlp.getCertifications() != null ? nlp.getCertifications().size() : 0;
        int expCount = nlp.getExperience() != null ? nlp.getExperience().size() : 0;

        double skillScore = calculateSkillScore(skillCount, nlp.getSkills());
        // A single substantial project or recognised qualification should materially
        // improve the report instead of being drowned out by missing work history.
        double projectScore = Math.min(100, projectCount * 35.0);
        double educationScore = Math.min(100, eduCount * 60.0);
        double atsScore = calculateAtsScore(skillCount, projectCount, eduCount, expCount);
        double overallScore = nlp.getResumeScore() != null
                ? nlp.getResumeScore()
                : (skillScore * 0.4 + projectScore * 0.2 + educationScore * 0.2 + atsScore * 0.2);

        ResumeAnalysisReport report = reportRepo.findByResumeId(resumeId).orElseGet(ResumeAnalysisReport::new);
        report.setResume(resume);
        report.setSkillScore(skillScore);
        report.setProjectScore(projectScore);
        report.setEducationScore(educationScore);
        report.setAtsScore(atsScore);
        report.setOverallScore(Math.min(100, overallScore));
        report.setAiFeedback(buildFeedback(skillCount, projectCount, eduCount, certCount, expCount));
        return reportRepo.save(report);
    }

    public ResumeAnalysisReportResponse getReport(Long resumeId) {
        ResumeAnalysisReport report = reportRepo.findByResumeId(resumeId)
                .orElseThrow(() -> new ResumeNotFoundException("Analysis report not found; process the resume first"));
        return toResponse(report);
    }

    private double calculateSkillScore(int count, List<NlpParseResponse.NlpSkill> skills) {
        if (skills == null || skills.isEmpty()) return 0.0;
        double avgConf = skills.stream()
                .mapToDouble(s -> s.getConfidence() != null ? s.getConfidence() : 0.5)
                .average().orElse(0.5);
        return Math.min(100, count * 20.0 * avgConf);
    }

    private double calculateAtsScore(int skills, int projects, int edu, int exp) {
        double score = 0;
        score += Math.min(40, skills * 8.0);
        score += Math.min(20, projects * 10.0);
        score += Math.min(20, edu * 20.0);
        score += Math.min(20, exp * 5.0);
        return score;
    }

    private String buildFeedback(int skills, int projects, int edu, int certs, int exp) {
        StringBuilder fb = new StringBuilder();
        if (skills < 5) fb.append("Add more technical skills. ");
        if (projects == 0) fb.append("Include at least 2 projects with tech stack details. ");
        if (edu == 0) fb.append("Add your education details. ");
        if (certs == 0) fb.append("Certifications can boost your profile. ");
        if (exp == 0) fb.append("Add internship or work experience. ");
        if (fb.isEmpty()) fb.append("Strong resume! Tailor keywords to each job description for best ATS results.");
        return fb.toString().trim();
    }

    private ResumeAnalysisReportResponse toResponse(ResumeAnalysisReport r) {
        ResumeAnalysisReportResponse res = new ResumeAnalysisReportResponse();
        res.setResumeId(r.getResume().getId());
        res.setOverallScore(r.getOverallScore());
        res.setAtsScore(r.getAtsScore());
        res.setSkillScore(r.getSkillScore());
        res.setProjectScore(r.getProjectScore());
        res.setEducationScore(r.getEducationScore());
        res.setAiFeedback(r.getAiFeedback());
        res.setGeneratedAt(r.getGeneratedAt());
        return res;
    }
}
