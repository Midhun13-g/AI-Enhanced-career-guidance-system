package com.careerguidance.dto.response;

public class AssessmentAnswerResponse {
    private Long answerId;
    private Long sessionId;
    private Long questionId;
    private Long optionId;
    private Integer score;

    public AssessmentAnswerResponse() {
    }

    public AssessmentAnswerResponse(Long answerId, Long sessionId, Long questionId, Long optionId, Integer score) {
        this.answerId = answerId;
        this.sessionId = sessionId;
        this.questionId = questionId;
        this.optionId = optionId;
        this.score = score;
    }

    public Long getAnswerId() {
        return answerId;
    }

    public void setAnswerId(Long answerId) {
        this.answerId = answerId;
    }

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

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }
}
