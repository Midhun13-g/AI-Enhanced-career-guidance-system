package com.careerguidance.dto.request; import jakarta.validation.constraints.NotBlank; import jakarta.validation.constraints.Size;
public record AssessmentFeedbackRequest(@NotBlank @Size(max=3000) String feedback) {}
