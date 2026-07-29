package com.careerguidance.dto.response;

import java.util.ArrayList;
import java.util.List;

public class AssessmentQuestionResponse {
    private Long id;
    private String question;
    private String questionType;
    private String difficulty;
    private Integer displayOrder;
    private List<AssessmentOptionResponse> options = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getQuestionType() {
        return questionType;
    }

    public void setQuestionType(String questionType) {
        this.questionType = questionType;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

    public List<AssessmentOptionResponse> getOptions() {
        return options;
    }

    public void setOptions(List<AssessmentOptionResponse> options) {
        this.options = options;
    }
}
