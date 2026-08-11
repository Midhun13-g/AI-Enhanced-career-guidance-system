package com.careerguidance.dto.response;

import com.careerguidance.entity.Assessment;

public record AdminAssessmentResponse(
        Long id, String title, String description, String category, String difficulty,
        Integer durationMinutes, Integer totalQuestions, Integer maximumAttempts,
        Double passingPercentage, String status
) {
    public static AdminAssessmentResponse from(Assessment assessment) {
        return new AdminAssessmentResponse(assessment.getId(), assessment.getTitle(), assessment.getDescription(),
                assessment.getCategory(), assessment.getDifficulty(), assessment.getDurationMinutes(),
                assessment.getTotalQuestions(), assessment.getMaximumAttempts(), assessment.getPassingPercentage(),
                assessment.getStatus().name());
    }
}
