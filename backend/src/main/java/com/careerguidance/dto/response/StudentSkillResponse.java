package com.careerguidance.dto.response;

import java.time.LocalDateTime;

public class StudentSkillResponse {
    private Long id;
    private String skillName;
    private String normalizedName;
    private String category;
    private String source;
    private Double confidence;
    private LocalDateTime createdAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSkillName() { return skillName; }
    public void setSkillName(String skillName) { this.skillName = skillName; }
    public String getNormalizedName() { return normalizedName; }
    public void setNormalizedName(String normalizedName) { this.normalizedName = normalizedName; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
