package com.careerguidance.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CourseRecommendationResponse {
    @JsonProperty("target_skill")
    private String targetSkill;
    @JsonProperty("recommendation_type")
    private String recommendationType;
    @JsonProperty("course_name")
    private String courseName;
    private String provider;
    private String domain;
    private String difficulty;
    private String duration;
    @JsonProperty("recommendation_score")
    private double recommendationScore;
    @JsonProperty("semantic_similarity")
    private double semanticSimilarity;
    private String reason;

    public String getTargetSkill() { return targetSkill; }
    public void setTargetSkill(String targetSkill) { this.targetSkill = targetSkill; }

    public String getRecommendationType() { return recommendationType; }
    public void setRecommendationType(String recommendationType) { this.recommendationType = recommendationType; }

    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }

    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }

    public String getDomain() { return domain; }
    public void setDomain(String domain) { this.domain = domain; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public double getRecommendationScore() { return recommendationScore; }
    public void setRecommendationScore(double recommendationScore) { this.recommendationScore = recommendationScore; }

    public double getSemanticSimilarity() { return semanticSimilarity; }
    public void setSemanticSimilarity(double semanticSimilarity) { this.semanticSimilarity = semanticSimilarity; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
