package com.careerguidance.dto.response;

import java.time.LocalDateTime;

public class ResumeAnalysisReportResponse {
    private Long resumeId;
    private Double overallScore;
    private Double atsScore;
    private Double skillScore;
    private Double projectScore;
    private Double educationScore;
    private String aiFeedback;
    private LocalDateTime generatedAt;

    public Long getResumeId() { return resumeId; }
    public void setResumeId(Long resumeId) { this.resumeId = resumeId; }
    public Double getOverallScore() { return overallScore; }
    public void setOverallScore(Double overallScore) { this.overallScore = overallScore; }
    public Double getAtsScore() { return atsScore; }
    public void setAtsScore(Double atsScore) { this.atsScore = atsScore; }
    public Double getSkillScore() { return skillScore; }
    public void setSkillScore(Double skillScore) { this.skillScore = skillScore; }
    public Double getProjectScore() { return projectScore; }
    public void setProjectScore(Double projectScore) { this.projectScore = projectScore; }
    public Double getEducationScore() { return educationScore; }
    public void setEducationScore(Double educationScore) { this.educationScore = educationScore; }
    public String getAiFeedback() { return aiFeedback; }
    public void setAiFeedback(String aiFeedback) { this.aiFeedback = aiFeedback; }
    public LocalDateTime getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(LocalDateTime generatedAt) { this.generatedAt = generatedAt; }
}
