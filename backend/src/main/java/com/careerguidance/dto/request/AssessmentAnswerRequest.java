package com.careerguidance.dto.request;

import jakarta.validation.constraints.NotNull;

public class AssessmentAnswerRequest {
    @NotNull(message = "Session id is required")
    private Long sessionId;

    @NotNull(message = "Question id is required")
    private Long questionId;

    @NotNull(message = "Option id is required")
    private Long optionId;

    public Long getSessionId() {
        return sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public Long getOptionId() {
        return optionId;
    }

    public void setOptionId(Long optionId) {
        this.optionId = optionId;
    }
}
