package com.careerguidance.dto.response;

import java.util.List;

public record GroqAssessmentPlanResponse(
        String name, String description, List<String> skills, String instructions,
        Integer duration, Integer questionCount, Integer passingMarks, List<String> suggestedTopics,
        List<GroqQuestionResponse> questions
) {
    public record GroqQuestionResponse(String questionText, List<String> options,
                                       Integer correctOptionIndex, String explanation) {}
}
