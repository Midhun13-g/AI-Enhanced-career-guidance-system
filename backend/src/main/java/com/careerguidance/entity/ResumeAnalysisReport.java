package com.careerguidance.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "resume_analysis_report")
public class ResumeAnalysisReport {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false, unique = true)
    private Resume resume;

    @Column(name = "overall_score")
    private Double overallScore;

    @Column(name = "ats_score")
    private Double atsScore;

    @Column(name = "skill_score")
    private Double skillScore;

    @Column(name = "project_score")
    private Double projectScore;

    @Column(name = "education_score")
    private Double educationScore;

    @Column(name = "ai_feedback", columnDefinition = "TEXT")
    private String aiFeedback;

    @Column(name = "generated_at", nullable = false)
    private LocalDateTime generatedAt;

    @PrePersist @PreUpdate void onSave() { generatedAt = LocalDateTime.now(); }

    public Long getId() { return id; }
    public Resume getResume() { return resume; }
    public void setResume(Resume resume) { this.resume = resume; }
    public Double getOverallScore() { return overallScore; }
    public void setOverallScore(Double overallScore) { this.overallScore = overallScore; }
    public Double getAtsScore() { return atsScore; }
    public void setAtsScore(Double atsScore) { this.atsScore = atsScore; }
    public Double getSkillScore() { return skillScore; }
    public void setSkillScore(Double skillScore) { this.skillScore = skillScore; }
    public Double getProjectScore() { return projectScore; }
    public void setProjectScore(Double projectScore) { this.projectScore = projectScore; }
    public Double getEducationScore() { return educationScore; }
    public void setEducationScore(Double educationScore) { this.educationScore = educationScore; }
    public String getAiFeedback() { return aiFeedback; }
    public void setAiFeedback(String aiFeedback) { this.aiFeedback = aiFeedback; }
    public LocalDateTime getGeneratedAt() { return generatedAt; }
}
