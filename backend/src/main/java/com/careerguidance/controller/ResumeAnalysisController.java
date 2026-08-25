package com.careerguidance.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.careerguidance.dto.AiAnalysisResultDto;
import com.careerguidance.dto.AiAnalysisSummaryDto;
import com.careerguidance.dto.CareerGuidanceResponse;
import com.careerguidance.dto.CourseRecommendationResponse;
import com.careerguidance.dto.ExplanationResponse;
import com.careerguidance.dto.JobMatchResponse;
import com.careerguidance.dto.RoadmapResponse;
import com.careerguidance.security.UserDetailsImpl;
import com.careerguidance.service.AiCareerAnalysisService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping({"/api/resumes", "/api/resume"})
@Tag(name = "AI Resume Analysis Integration", description = "Endpoints for orchestrating AI Resume Analysis via Hugging Face AI Service")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('STUDENT')")
public class ResumeAnalysisController {

    private final AiCareerAnalysisService analysisService;

    public ResumeAnalysisController(AiCareerAnalysisService analysisService) {
        this.analysisService = analysisService;
    }

    @PostMapping(value = "/analyze", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Analyze resume using the external Hugging Face AI Career Guidance pipeline")
    public ResponseEntity<AiAnalysisResultDto> analyzeResume(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam("file") MultipartFile file) {
        AiAnalysisResultDto response = analysisService.analyzeResume(userDetails.getId(), file);
        return ResponseEntity.ok(response);
    }

    @GetMapping(value = {"/analyses", "/history"})
    @Operation(summary = "Get authenticated user's AI resume analysis history")
    public ResponseEntity<List<AiAnalysisSummaryDto>> getAnalysisHistory(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(analysisService.getAnalysisHistory(userDetails.getId()));
    }

    @GetMapping(value = {"/analyses/{analysisId}", "/{analysisId}/full"})
    @Operation(summary = "Get complete AI analysis by ID")
    public ResponseEntity<AiAnalysisResultDto> getFullAnalysis(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long analysisId) {
        return ResponseEntity.ok(analysisService.getFullAnalysis(userDetails.getId(), analysisId));
    }

    @GetMapping(value = {"/{analysisId}/skills", "/analyses/{analysisId}/skills"})
    @Operation(summary = "Get extracted skills breakdown for analysis")
    public ResponseEntity<Map<String, Object>> getSkills(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long analysisId) {
        return ResponseEntity.ok(analysisService.getSkillsBreakdown(userDetails.getId(), analysisId));
    }

    @GetMapping(value = {"/{analysisId}/jobs", "/analyses/{analysisId}/jobs"})
    @Operation(summary = "Get semantic job matches for analysis")
    public ResponseEntity<List<JobMatchResponse>> getJobMatches(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long analysisId) {
        return ResponseEntity.ok(analysisService.getJobMatches(userDetails.getId(), analysisId));
    }

    @GetMapping(value = {"/{analysisId}/skill-gaps", "/analyses/{analysisId}/skill-gaps"})
    @Operation(summary = "Get skill gaps and learning priorities for analysis")
    public ResponseEntity<Map<String, Object>> getSkillGaps(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long analysisId) {
        return ResponseEntity.ok(analysisService.getSkillGaps(userDetails.getId(), analysisId));
    }

    @GetMapping(value = {"/{analysisId}/courses", "/analyses/{analysisId}/courses"})
    @Operation(summary = "Get course recommendations for analysis")
    public ResponseEntity<List<CourseRecommendationResponse>> getCourses(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long analysisId) {
        return ResponseEntity.ok(analysisService.getCourseRecommendations(userDetails.getId(), analysisId));
    }

    @GetMapping(value = {"/{analysisId}/explanations", "/analyses/{analysisId}/explanations"})
    @Operation(summary = "Get SHAP and rule-based explanations for analysis")
    public ResponseEntity<List<ExplanationResponse>> getExplanations(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long analysisId) {
        return ResponseEntity.ok(analysisService.getExplanations(userDetails.getId(), analysisId));
    }

    @GetMapping(value = {"/{analysisId}/career-guidance", "/analyses/{analysisId}/career-guidance"})
    @Operation(summary = "Get career guidance and domain analysis for analysis")
    public ResponseEntity<CareerGuidanceResponse> getCareerGuidance(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long analysisId) {
        return ResponseEntity.ok(analysisService.getCareerGuidance(userDetails.getId(), analysisId));
    }

    @GetMapping(value = {"/{analysisId}/roadmap", "/analyses/{analysisId}/roadmap"})
    @Operation(summary = "Get career roadmap for analysis")
    public ResponseEntity<List<RoadmapResponse>> getRoadmap(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long analysisId) {
        return ResponseEntity.ok(analysisService.getRoadmap(userDetails.getId(), analysisId));
    }

    @DeleteMapping(value = {"/analyses/{analysisId}", "/{analysisId}/ai"})
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete an AI analysis by ID")
    public void deleteAnalysis(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long analysisId) {
        analysisService.deleteAnalysis(userDetails.getId(), analysisId);
    }
}
