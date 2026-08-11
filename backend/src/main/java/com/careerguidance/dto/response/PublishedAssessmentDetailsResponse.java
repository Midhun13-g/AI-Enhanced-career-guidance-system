package com.careerguidance.dto.response;

import com.careerguidance.entity.Assessment;
import com.careerguidance.entity.AssessmentItem;
import java.util.List;

/** A student-safe assessment view: correct-answer flags are deliberately omitted. */
public record PublishedAssessmentDetailsResponse(
        Long id, String title, String description, String category, String difficulty,
        Integer durationMinutes, Integer totalQuestions, Integer maximumAttempts,
        Double passingPercentage, String instructions, List<Question> questions
) {
    public record Option(Long id, String text) {}
    public record Question(Long id, String questionText, List<Option> options) {}

    public static PublishedAssessmentDetailsResponse from(Assessment assessment) {
        List<Question> questions = assessment.getItems().stream()
                .filter(item -> Boolean.TRUE.equals(item.getIsActive()))
                .sorted(java.util.Comparator.comparing(AssessmentItem::getDisplayOrder))
                .map(item -> new Question(item.getId(), item.getQuestionText(), item.getOptions().stream()
                        .map(option -> new Option(option.getId(), option.getOptionText())).toList()))
                .toList();
        return new PublishedAssessmentDetailsResponse(assessment.getId(), assessment.getTitle(), assessment.getDescription(),
                assessment.getCategory(), assessment.getDifficulty(), assessment.getDurationMinutes(), questions.size(),
                assessment.getMaximumAttempts(), assessment.getPassingPercentage(), assessment.getInstructions(), questions);
    }
}
