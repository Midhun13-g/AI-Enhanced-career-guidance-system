package com.careerguidance.dto.response;

public class AssessmentOptionResponse {
    private Long id;
    private String optionText;
    private Integer displayOrder;

    public AssessmentOptionResponse() {
    }

    public AssessmentOptionResponse(Long id, String optionText, Integer displayOrder) {
        this.id = id;
        this.optionText = optionText;
        this.displayOrder = displayOrder;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOptionText() {
        return optionText;
    }

    public void setOptionText(String optionText) {
        this.optionText = optionText;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }
}
