package com.careerguidance.dto;

import com.careerguidance.constant.AnalysisStatus;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class AiAnalysisSummaryDto {

    private Long analysisId;
    private String originalFileName;
    private String fileType;
    private Long fileSize;
    private AnalysisStatus status;
    private String hfRequestId;
    private String topJobRole;
    private Double topMatchScore;
    private Integer skillCount;
    private Double executionTime;
    private String errorMessage;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Long getAnalysisId() {
        return analysisId;
    }

    public void setAnalysisId(Long analysisId) {
        this.analysisId = analysisId;
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

    public String getTopJobRole() {
        return topJobRole;
    }

    public void setTopJobRole(String topJobRole) {
        this.topJobRole = topJobRole;
    }

    public Double getTopMatchScore() {
        return topMatchScore;
    }

    public void setTopMatchScore(Double topMatchScore) {
        this.topMatchScore = topMatchScore;
    }

    public Integer getSkillCount() {
        return skillCount;
    }

    public void setSkillCount(Integer skillCount) {
        this.skillCount = skillCount;
    }

    public Double getExecutionTime() {
        return executionTime;
    }

    public void setExecutionTime(Double executionTime) {
        this.executionTime = executionTime;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
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
