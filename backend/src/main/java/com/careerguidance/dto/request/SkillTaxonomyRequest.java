package com.careerguidance.dto.request;

import jakarta.validation.constraints.NotBlank;

public class SkillTaxonomyRequest {
    @NotBlank private String skillName;
    @NotBlank private String normalizedName;
    private String category;
    private String description;

    public String getSkillName() { return skillName; }
    public void setSkillName(String skillName) { this.skillName = skillName; }
    public String getNormalizedName() { return normalizedName; }
    public void setNormalizedName(String normalizedName) { this.normalizedName = normalizedName; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
