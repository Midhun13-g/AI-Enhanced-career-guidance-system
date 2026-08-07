package com.careerguidance.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_skill_vectors")
public class StudentSkillVector {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false, unique = true)
    private User student;

    @Column(nullable = false)
    private Double technicalSkill = 0.0;

    @Column(nullable = false)
    private Double aptitudeSkill = 0.0;

    @Column(nullable = false)
    private Double logicalReasoning = 0.0;

    @Column(nullable = false)
    private Double problemSolving = 0.0;

    @Column(nullable = false)
    private Double communicationSkill = 0.0;

    @Column(nullable = false)
    private Double analyticalSkill = 0.0;

    @Column(nullable = false)
    private Double adaptability = 0.0;

    @Column(nullable = false)
    private Double overallScore = 0.0;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onUpdate() { updatedAt = LocalDateTime.now(); }

    public Long getId() { return id; }
    public User getStudent() { return student; }
    public void setStudent(User student) { this.student = student; }
    public Double getTechnicalSkill() { return technicalSkill; }
    public void setTechnicalSkill(Double technicalSkill) { this.technicalSkill = technicalSkill; }
    public Double getAptitudeSkill() { return aptitudeSkill; }
    public void setAptitudeSkill(Double aptitudeSkill) { this.aptitudeSkill = aptitudeSkill; }
    public Double getLogicalReasoning() { return logicalReasoning; }
    public void setLogicalReasoning(Double logicalReasoning) { this.logicalReasoning = logicalReasoning; }
    public Double getProblemSolving() { return problemSolving; }
    public void setProblemSolving(Double problemSolving) { this.problemSolving = problemSolving; }
    public Double getCommunicationSkill() { return communicationSkill; }
    public void setCommunicationSkill(Double communicationSkill) { this.communicationSkill = communicationSkill; }
    public Double getAnalyticalSkill() { return analyticalSkill; }
    public void setAnalyticalSkill(Double analyticalSkill) { this.analyticalSkill = analyticalSkill; }
    public Double getAdaptability() { return adaptability; }
    public void setAdaptability(Double adaptability) { this.adaptability = adaptability; }
    public Double getOverallScore() { return overallScore; }
    public void setOverallScore(Double overallScore) { this.overallScore = overallScore; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
