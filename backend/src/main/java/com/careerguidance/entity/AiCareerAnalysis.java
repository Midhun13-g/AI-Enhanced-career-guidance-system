package com.careerguidance.entity;

import com.careerguidance.constant.AnalysisStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ai_career_analysis")
public class AiCareerAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "original_file_name", nullable = false)
    private String originalFileName;

    @Column(name = "file_type")
    private String fileType;

    @Column(name = "file_size")
    private Long fileSize;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AnalysisStatus status = AnalysisStatus.PROCESSING;

    @Column(name = "hf_request_id")
    private String hfRequestId;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @Column(name = "execution_time")
    private Double executionTime = 0.0;

    @Column(name = "resume_data", columnDefinition = "TEXT")
    private String resumeData;

    @Column(name = "job_matches", columnDefinition = "TEXT")
    private String jobMatches;

    @Column(name = "career_analysis", columnDefinition = "TEXT")
    private String careerAnalysis;

    @Column(name = "skill_gaps", columnDefinition = "TEXT")
    private String skillGaps;

    @Column(name = "learning_priorities", columnDefinition = "TEXT")
    private String learningPriorities;

    @Column(name = "course_recommendations", columnDefinition = "TEXT")
    private String courseRecommendations;

    @Column(name = "explanations", columnDefinition = "TEXT")
    private String explanations;

    @Column(name = "career_guidance", columnDefinition = "TEXT")
    private String careerGuidance;

    @Column(name = "roadmap", columnDefinition = "TEXT")
    private String roadmap;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getOriginalFileName() {
        return originalFileName;
    }

    public void setOriginalFileName(String originalFileName) {
        this.originalFileName = originalFileName;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public AnalysisStatus getStatus() {
        return status;
    }

    public void setStatus(AnalysisStatus status) {
        this.status = status;
    }

    public String getHfRequestId() {
        return hfRequestId;
    }

    public void setHfRequestId(String hfRequestId) {
        this.hfRequestId = hfRequestId;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public Double getExecutionTime() {
        return executionTime;
    }

    public void setExecutionTime(Double executionTime) {
        this.executionTime = executionTime;
    }

    public String getResumeData() {
        return resumeData;
    }

    public void setResumeData(String resumeData) {
        this.resumeData = resumeData;
    }

    public String getJobMatches() {
        return jobMatches;
    }

    public void setJobMatches(String jobMatches) {
        this.jobMatches = jobMatches;
    }

    public String getCareerAnalysis() {
        return careerAnalysis;
    }

    public void setCareerAnalysis(String careerAnalysis) {
        this.careerAnalysis = careerAnalysis;
    }

    public String getSkillGaps() {
        return skillGaps;
    }

    public void setSkillGaps(String skillGaps) {
        this.skillGaps = skillGaps;
    }

    public String getLearningPriorities() {
        return learningPriorities;
    }

    public void setLearningPriorities(String learningPriorities) {
        this.learningPriorities = learningPriorities;
    }

    public String getCourseRecommendations() {
        return courseRecommendations;
    }

    public void setCourseRecommendations(String courseRecommendations) {
        this.courseRecommendations = courseRecommendations;
    }

    public String getExplanations() {
        return explanations;
    }

    public void setExplanations(String explanations) {
        this.explanations = explanations;
    }

    public String getCareerGuidance() {
        return careerGuidance;
    }

    public void setCareerGuidance(String careerGuidance) {
        this.careerGuidance = careerGuidance;
    }

    public String getRoadmap() {
        return roadmap;
    }

    public void setRoadmap(String roadmap) {
        this.roadmap = roadmap;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
