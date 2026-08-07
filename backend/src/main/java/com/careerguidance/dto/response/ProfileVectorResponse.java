package com.careerguidance.dto.response;

import java.time.LocalDateTime;
import java.util.Map;

public class ProfileVectorResponse {
    private Long studentId;
    private Map<String, Object> resumeVector;
    private Map<String, Object> overallVector;
    private LocalDateTime updatedAt;

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
    public Map<String, Object> getResumeVector() { return resumeVector; }
    public void setResumeVector(Map<String, Object> resumeVector) { this.resumeVector = resumeVector; }
    public Map<String, Object> getOverallVector() { return overallVector; }
    public void setOverallVector(Map<String, Object> overallVector) { this.overallVector = overallVector; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
