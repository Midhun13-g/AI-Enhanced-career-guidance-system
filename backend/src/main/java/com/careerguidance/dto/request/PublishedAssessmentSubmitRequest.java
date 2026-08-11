package com.careerguidance.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record PublishedAssessmentSubmitRequest(@NotNull List<@Valid Answer> answers, Integer timeTakenSecs) {
    public record Answer(@NotNull Long questionId, @NotNull Long optionId) {}
}
