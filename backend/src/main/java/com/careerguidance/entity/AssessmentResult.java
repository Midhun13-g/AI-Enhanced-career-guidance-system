package com.careerguidance.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "assessment_results")
public class AssessmentResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "session_id", nullable = false, unique = true)
    private AssessmentSession session;

    @Column(nullable = false)
    private Double technicalScore;

    @Column(nullable = false)
    private Double aptitudeScore;

    @Column(nullable = false)
    private Double personalityScore;

    @Column(nullable = false)
    private Double interestScore;

    @Column(nullable = false)
    private Double overallScore;

    @Column(nullable = false, length = 80)
    private String personalityType;

    @Column(nullable = false, length = 120)
    private String recommendedCategory;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public AssessmentSession getSession() {
        return session;
    }

    public void setSession(AssessmentSession session) {
        this.session = session;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
