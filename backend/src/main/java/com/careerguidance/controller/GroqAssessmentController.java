package com.careerguidance.controller;

import com.careerguidance.dto.request.GroqAssessmentRequest;
import com.careerguidance.dto.response.GroqAssessmentPlanResponse;
import com.careerguidance.service.GroqAssessmentService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/ai/assessments")
@PreAuthorize("hasRole('ADMIN')")
public class GroqAssessmentController {
    private final GroqAssessmentService groq;
    public GroqAssessmentController(GroqAssessmentService groq) { this.groq = groq; }

    @PostMapping("/plan")
    public GroqAssessmentPlanResponse createPlan(@Valid @RequestBody GroqAssessmentRequest request) {
        return groq.createPlan(request);
    }
}
