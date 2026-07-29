package com.careerguidance.dto.request;

import jakarta.validation.constraints.NotNull;

public class AssessmentSubmitRequest {
    @NotNull(message = "Session id is required")
    private Long sessionId;

    public Long getSessionId() {
        return sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }
}
