package com.careerguidance.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Map;

public class ExplanationResponse {
    private String recommendation;
    @JsonProperty("explanation_type")
    private String explanationType;
    @JsonProperty("feature_contributions")
    private Map<String, Double> featureContributions;
    @JsonProperty("human_readable_explanation")
    private String humanReadableExplanation;

    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }

    public String getExplanationType() { return explanationType; }
    public void setExplanationType(String explanationType) { this.explanationType = explanationType; }

    public Map<String, Double> getFeatureContributions() { return featureContributions; }
    public void setFeatureContributions(Map<String, Double> featureContributions) { this.featureContributions = featureContributions; }

    public String getHumanReadableExplanation() { return humanReadableExplanation; }
    public void setHumanReadableExplanation(String humanReadableExplanation) { this.humanReadableExplanation = humanReadableExplanation; }
}
