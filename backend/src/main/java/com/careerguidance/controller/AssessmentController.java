package com.careerguidance.controller;

import com.careerguidance.dto.request.AssessmentAnswerRequest;
import com.careerguidance.dto.request.AssessmentSubmitRequest;
import com.careerguidance.dto.response.AssessmentAnswerResponse;
import com.careerguidance.dto.response.AssessmentCategoryResponse;
import com.careerguidance.dto.response.AssessmentQuestionsByCategoryResponse;
import com.careerguidance.dto.response.AssessmentResultResponse;
import com.careerguidance.dto.response.AssessmentSessionResponse;
import com.careerguidance.security.UserDetailsImpl;
import com.careerguidance.service.AssessmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/assessment")
@Tag(name = "Skills & Interest Assessment", description = "Assessment sessions, answers, scoring, and reports")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('STUDENT')")
public class AssessmentController {
    private final AssessmentService assessmentService;

    public AssessmentController(AssessmentService assessmentService) {
        this.assessmentService = assessmentService;
    }

    @GetMapping("/categories")
    @Operation(summary = "Get assessment categories")
    public ResponseEntity<List<AssessmentCategoryResponse>> getCategories() {
        return ResponseEntity.ok(assessmentService.getCategories());
    }

    @GetMapping("/questions")
    @Operation(summary = "Get active assessment questions grouped by category")
    public ResponseEntity<List<AssessmentQuestionsByCategoryResponse>> getQuestions() {
        return ResponseEntity.ok(assessmentService.getQuestions());
    }

    @PostMapping("/start")
    @Operation(summary = "Start a new assessment session")
    public ResponseEntity<AssessmentSessionResponse> startAssessment(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(assessmentService.startAssessment(userDetails.getId()));
    }

    @PostMapping("/save-answer")
    @Operation(summary = "Save one assessment answer")
    public ResponseEntity<AssessmentAnswerResponse> saveAnswer(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                                               @Valid @RequestBody AssessmentAnswerRequest request) {
        return ResponseEntity.ok(assessmentService.saveAnswer(userDetails.getId(), request));
    }

    @PutMapping("/update-answer/{answerId}")
    @Operation(summary = "Update a previously saved assessment answer")
    public ResponseEntity<AssessmentAnswerResponse> updateAnswer(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                                                 @PathVariable Long answerId,
                                                                 @Valid @RequestBody AssessmentAnswerRequest request) {
        return ResponseEntity.ok(assessmentService.updateAnswer(userDetails.getId(), answerId, request));
    }

    @PostMapping("/submit")
    @Operation(summary = "Submit an assessment and calculate scores")
    public ResponseEntity<AssessmentResultResponse> submitAssessment(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                                                     @Valid @RequestBody AssessmentSubmitRequest request) {
        return ResponseEntity.ok(assessmentService.submitAssessment(userDetails.getId(), request.getSessionId()));
    }

    @GetMapping("/result/{sessionId}")
    @Operation(summary = "Get an assessment result report")
    public ResponseEntity<AssessmentResultResponse> getResult(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                                              @PathVariable Long sessionId) {
        return ResponseEntity.ok(assessmentService.getResult(userDetails.getId(), sessionId));
    }

    @GetMapping("/history")
    @Operation(summary = "Get previous submitted assessments for the authenticated student")
    public ResponseEntity<List<AssessmentResultResponse>> getHistory(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(assessmentService.getHistory(userDetails.getId()));
    }
}
