package com.careerguidance.service;

import com.careerguidance.dto.request.AssessmentAnswerRequest;
import com.careerguidance.dto.response.AssessmentAnswerResponse;
import com.careerguidance.dto.response.AssessmentCategoryResponse;
import com.careerguidance.dto.response.AssessmentQuestionsByCategoryResponse;
import com.careerguidance.dto.response.AssessmentResultResponse;
import com.careerguidance.dto.response.AssessmentSessionResponse;

import java.util.List;

public interface AssessmentService {
    AssessmentSessionResponse startAssessment(Long userId);

    List<AssessmentCategoryResponse> getCategories();

    List<AssessmentQuestionsByCategoryResponse> getQuestions();

    AssessmentAnswerResponse saveAnswer(Long userId, AssessmentAnswerRequest request);

    AssessmentAnswerResponse updateAnswer(Long userId, Long answerId, AssessmentAnswerRequest request);

    AssessmentResultResponse submitAssessment(Long userId, Long sessionId);

    double calculateTechnicalScore(List<com.careerguidance.entity.AssessmentAnswer> answers);

    double calculateAptitudeScore(List<com.careerguidance.entity.AssessmentAnswer> answers);

    double calculateInterestScore(List<com.careerguidance.entity.AssessmentAnswer> answers);

    String calculatePersonality(List<com.careerguidance.entity.AssessmentAnswer> answers);

    AssessmentResultResponse generateResult(com.careerguidance.entity.AssessmentSession session,
                                            List<com.careerguidance.entity.AssessmentAnswer> answers);

    AssessmentResultResponse getResult(Long userId, Long sessionId);

    List<AssessmentResultResponse> getHistory(Long userId);
}
