package com.careerguidance.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "student_profile_vector")
public class StudentProfileVector {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false, unique = true)
    private User student;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "academic_vector", columnDefinition = "jsonb")
    private Map<String, Object> academicVector;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "resume_vector", columnDefinition = "jsonb")
    private Map<String, Object> resumeVector;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "assessment_vector", columnDefinition = "jsonb")
    private Map<String, Object> assessmentVector;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "interest_vector", columnDefinition = "jsonb")
    private Map<String, Object> interestVector;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "certification_vector", columnDefinition = "jsonb")
    private Map<String, Object> certificationVector;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "overall_vector", columnDefinition = "jsonb")
    private Map<String, Object> overallVector;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist @PreUpdate void onSave() { updatedAt = LocalDateTime.now(); }

    public Long getId() { return id; }
    public User getStudent() { return student; }
    public void setStudent(User student) { this.student = student; }
    public Map<String, Object> getAcademicVector() { return academicVector; }
    public void setAcademicVector(Map<String, Object> v) { this.academicVector = v; }
    public Map<String, Object> getResumeVector() { return resumeVector; }
    public void setResumeVector(Map<String, Object> v) { this.resumeVector = v; }
    public Map<String, Object> getAssessmentVector() { return assessmentVector; }
    public void setAssessmentVector(Map<String, Object> v) { this.assessmentVector = v; }
    public Map<String, Object> getInterestVector() { return interestVector; }
    public void setInterestVector(Map<String, Object> v) { this.interestVector = v; }
    public Map<String, Object> getCertificationVector() { return certificationVector; }
    public void setCertificationVector(Map<String, Object> v) { this.certificationVector = v; }
    public Map<String, Object> getOverallVector() { return overallVector; }
    public void setOverallVector(Map<String, Object> v) { this.overallVector = v; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
