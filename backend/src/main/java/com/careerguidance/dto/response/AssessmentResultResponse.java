package com.careerguidance.dto.response;

import java.util.ArrayList;
import java.util.List;

public class AssessmentResultResponse {
    private Long sessionId;
    private Double technicalScore;
    private Double aptitudeScore;
    private Double personalityScore;
    private Double interestScore;
    private Double overallScore;
    private String personalityType;
    private String recommendedCategory;
    private List<String> strengths = new ArrayList<>();
    private List<String> weaknesses = new ArrayList<>();

    public Long getSessionId() {
        return sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    public Double getTechnicalScore() {
        return technicalScore;
    }

    public void setTechnicalScore(Double technicalScore) {
        this.technicalScore = technicalScore;
    }

    public Double getAptitudeScore() {
        return aptitudeScore;
    }

    public void setAptitudeScore(Double aptitudeScore) {
        this.aptitudeScore = aptitudeScore;
    }

    public Double getPersonalityScore() {
        return personalityScore;
    }

    public void setPersonalityScore(Double personalityScore) {
        this.personalityScore = personalityScore;
    }

    public Double getInterestScore() {
        return interestScore;
    }

    public void setInterestScore(Double interestScore) {
        this.interestScore = interestScore;
    }

    public Double getOverallScore() {
        return overallScore;
    }

    public void setOverallScore(Double overallScore) {
        this.overallScore = overallScore;
    }

    public String getPersonalityType() {
        return personalityType;
    }

    public void setPersonalityType(String personalityType) {
        this.personalityType = personalityType;
    }

    public String getRecommendedCategory() {
        return recommendedCategory;
    }

    public void setRecommendedCategory(String recommendedCategory) {
        this.recommendedCategory = recommendedCategory;
    }

    public List<String> getStrengths() {
        return strengths;
    }

    public void setStrengths(List<String> strengths) {
        this.strengths = strengths;
    }

    public List<String> getWeaknesses() {
        return weaknesses;
    }

    public void setWeaknesses(List<String> weaknesses) {
        this.weaknesses = weaknesses;
    }
}
