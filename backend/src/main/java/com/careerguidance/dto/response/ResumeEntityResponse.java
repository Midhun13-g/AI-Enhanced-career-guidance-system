package com.careerguidance.dto.response;

import java.time.LocalDateTime;

public class ResumeEntityResponse {
    private Long id;
    private String entityType;
    private String entityValue;
    private Double confidenceScore;
    private LocalDateTime createdAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEntityType() { return entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }
    public String getEntityValue() { return entityValue; }
    public void setEntityValue(String entityValue) { this.entityValue = entityValue; }
    public Double getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(Double confidenceScore) { this.confidenceScore = confidenceScore; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
