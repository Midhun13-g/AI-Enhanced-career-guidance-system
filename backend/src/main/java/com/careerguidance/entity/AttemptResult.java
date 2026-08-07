package com.careerguidance.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "attempt_results")
public class AttemptResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "attempt_id", nullable = false, unique = true)
    private AssessmentAttempt attempt;

    @Column(nullable = false)
    private Double totalScore = 0.0;

    @Column(nullable = false)
    private Double percentage = 0.0;

    @Column(nullable = false, length = 30)
    private String performanceLevel = "AVERAGE";

    @Column(nullable = false)
    private Double technicalScore = 0.0;

    @Column(nullable = false)
    private Double aptitudeScore = 0.0;

    @Column(nullable = false)
    private Double logicalScore = 0.0;

    @Column(nullable = false)
    private Double communicationScore = 0.0;

    @Column(nullable = false)
    private Double personalityScore = 0.0;

    @Column(columnDefinition = "TEXT")
    private String aiFeedback;

    @Column(nullable = false)
    private Boolean careerVectorUpdated = false;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); }

    public Long getId() { return id; }
    public AssessmentAttempt getAttempt() { return attempt; }
    public void setAttempt(AssessmentAttempt attempt) { this.attempt = attempt; }
    public Double getTotalScore() { return totalScore; }
    public void setTotalScore(Double totalScore) { this.totalScore = totalScore; }
    public Double getPercentage() { return percentage; }
    public void setPercentage(Double percentage) { this.percentage = percentage; }
    public String getPerformanceLevel() { return performanceLevel; }
    public void setPerformanceLevel(String performanceLevel) { this.performanceLevel = performanceLevel; }
    public Double getTechnicalScore() { return technicalScore; }
    public void setTechnicalScore(Double technicalScore) { this.technicalScore = technicalScore; }
    public Double getAptitudeScore() { return aptitudeScore; }
    public void setAptitudeScore(Double aptitudeScore) { this.aptitudeScore = aptitudeScore; }
    public Double getLogicalScore() { return logicalScore; }
    public void setLogicalScore(Double logicalScore) { this.logicalScore = logicalScore; }
    public Double getCommunicationScore() { return communicationScore; }
    public void setCommunicationScore(Double communicationScore) { this.communicationScore = communicationScore; }
    public Double getPersonalityScore() { return personalityScore; }
    public void setPersonalityScore(Double personalityScore) { this.personalityScore = personalityScore; }
    public String getAiFeedback() { return aiFeedback; }
    public void setAiFeedback(String aiFeedback) { this.aiFeedback = aiFeedback; }
    public Boolean getCareerVectorUpdated() { return careerVectorUpdated; }
    public void setCareerVectorUpdated(Boolean careerVectorUpdated) { this.careerVectorUpdated = careerVectorUpdated; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
