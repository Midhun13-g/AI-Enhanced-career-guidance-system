package com.careerguidance.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public record PublishedAssessmentResultResponse(
        Long attemptId, Long assessmentId, String assessmentTitle, Double percentage, Double passingPercentage,
        boolean passed, int correctAnswers, int wrongAnswers, int skippedAnswers, LocalDateTime submittedAt,
        List<ReviewQuestion> review
) {
    public record ReviewQuestion(Long questionId, String questionText, String selectedOption, String correctOption, boolean correct) {}
}
