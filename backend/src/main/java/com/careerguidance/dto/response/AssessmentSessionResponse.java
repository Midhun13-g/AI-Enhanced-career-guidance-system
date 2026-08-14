package com.careerguidance.dto.response;

import java.time.LocalDateTime;

public class AssessmentSessionResponse {
    private Long sessionId;
    private String status;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;

    public AssessmentSessionResponse() {
    }

    public AssessmentSessionResponse(Long sessionId, String status, LocalDateTime startedAt, LocalDateTime completedAt) {
        this.sessionId = sessionId;
        this.status = status;
        this.startedAt = startedAt;
        this.completedAt = completedAt;
    }

    public Long getSessionId() {
        return sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}
