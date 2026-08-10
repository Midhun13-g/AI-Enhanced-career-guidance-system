package com.careerguidance.service;

import com.careerguidance.dto.request.GroqAssessmentRequest;
import com.careerguidance.dto.response.GroqAssessmentPlanResponse;

public interface GroqAssessmentService {
    GroqAssessmentPlanResponse createPlan(GroqAssessmentRequest request);
}
