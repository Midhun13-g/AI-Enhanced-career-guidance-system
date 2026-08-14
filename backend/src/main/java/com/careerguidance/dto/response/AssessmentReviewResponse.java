package com.careerguidance.dto.response; import java.time.LocalDateTime;
public record AssessmentReviewResponse(Long id,Double technicalScore,Double aptitudeScore,Double interestScore,Double personalityScore,Double overallScore,String personalityType,String recommendedCategory,LocalDateTime completedAt) {}
