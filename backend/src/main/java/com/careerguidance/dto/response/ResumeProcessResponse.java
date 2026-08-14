package com.careerguidance.dto.response;

public class ResumeProcessResponse {
    private Long resumeId;
    private String processingStatus;
    private Double resumeScore;
    private int skillsExtracted;
    private int entitiesExtracted;
    private String message;

    public Long getResumeId() { return resumeId; }
    public void setResumeId(Long resumeId) { this.resumeId = resumeId; }
    public String getProcessingStatus() { return processingStatus; }
    public void setProcessingStatus(String processingStatus) { this.processingStatus = processingStatus; }
    public Double getResumeScore() { return resumeScore; }
    public void setResumeScore(Double resumeScore) { this.resumeScore = resumeScore; }
    public int getSkillsExtracted() { return skillsExtracted; }
    public void setSkillsExtracted(int skillsExtracted) { this.skillsExtracted = skillsExtracted; }
    public int getEntitiesExtracted() { return entitiesExtracted; }
    public void setEntitiesExtracted(int entitiesExtracted) { this.entitiesExtracted = entitiesExtracted; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
