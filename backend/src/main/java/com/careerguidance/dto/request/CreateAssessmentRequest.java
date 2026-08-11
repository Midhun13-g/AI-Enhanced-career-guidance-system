package com.careerguidance.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public record CreateAssessmentRequest(
        @NotBlank String name, @NotBlank String description, @NotBlank String category, @NotBlank String difficulty,
        @NotNull @Min(5) @Max(180) Integer duration, @NotNull @Min(1) @Max(200) Integer questionCount,
        @NotNull @Min(1) @Max(100) Integer passingMarks, @NotNull @Min(1) @Max(10) Integer maxAttempts,
        boolean negativeMarking, @Min(0) @Max(1) Double negativeValue, boolean shuffleQuestions,
        String status, String instructions, @Size(max = 200) List<AssessmentQuestionInput> questions
) {
    public record AssessmentQuestionInput(
            @NotBlank String questionText, @Size(min = 2, max = 6) List<@NotBlank String> options,
            @Min(0) Integer correctOptionIndex, String explanation) {}
}
