package com.careerguidance.dto.response;

import com.careerguidance.entity.Assessment;

public record PublishedAssessmentResponse(
        Long id, String title, String description, String category, String difficulty,
        Integer durationMinutes, Integer totalQuestions, Integer maximumAttempts, Double passingPercentage, String instructions
) {
    public static PublishedAssessmentResponse from(Assessment assessment) {
        return new PublishedAssessmentResponse(assessment.getId(), assessment.getTitle(), assessment.getDescription(),
                assessment.getCategory(), assessment.getDifficulty(), assessment.getDurationMinutes(), assessment.getTotalQuestions(),
                assessment.getMaximumAttempts(), assessment.getPassingPercentage(), assessment.getInstructions());
    }
}
