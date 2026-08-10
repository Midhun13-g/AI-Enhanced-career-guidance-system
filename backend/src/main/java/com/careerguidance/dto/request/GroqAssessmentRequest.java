package com.careerguidance.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record GroqAssessmentRequest(
        String topic,
        @NotBlank String category,
        @NotBlank String difficulty,
        @NotNull Integer questionCount
) {}
