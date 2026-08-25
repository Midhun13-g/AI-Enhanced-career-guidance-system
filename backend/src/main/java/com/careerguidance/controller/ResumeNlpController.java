package com.careerguidance.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.careerguidance.dto.response.ProfileVectorResponse;
import com.careerguidance.dto.response.ResumeAnalysisReportResponse;
import com.careerguidance.dto.response.ResumeEntityResponse;
import com.careerguidance.dto.response.ResumeProcessResponse;
import com.careerguidance.dto.response.StudentSkillResponse;
import com.careerguidance.security.UserDetailsImpl;
import com.careerguidance.service.NlpPipelineService;
import com.careerguidance.service.ProfileVectorService;
import com.careerguidance.service.ResumeAnalysisService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/student/resume")
@Tag(name = "Resume NLP", description = "Resume intelligence pipeline for students")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('STUDENT')")
public class ResumeNlpController {

    private final NlpPipelineService pipeline;
    private final ResumeAnalysisService analysisService;
    private final ProfileVectorService vectorService;

    public ResumeNlpController(NlpPipelineService pipeline,
                                ResumeAnalysisService analysisService,
                                ProfileVectorService vectorService) {
        this.pipeline = pipeline;
        this.analysisService = analysisService;
        this.vectorService = vectorService;
    }

    @PostMapping("/process/{resumeId}")
    @Operation(summary = "Run the full NLP processing pipeline on an uploaded resume")
    public ResponseEntity<ResumeProcessResponse> process(
            @AuthenticationPrincipal UserDetailsImpl user,
            @PathVariable Long resumeId) {
        return ResponseEntity.ok(pipeline.process(user.getId(), resumeId));
    }

    @GetMapping("/report/{resumeId}")
    @Operation(summary = "Get the AI analysis report for a resume")
    public ResponseEntity<ResumeAnalysisReportResponse> getReport(
            @AuthenticationPrincipal UserDetailsImpl user,
            @PathVariable Long resumeId) {
        return ResponseEntity.ok(analysisService.getReport(user.getId(), resumeId));
    }

    @GetMapping("/entities/{resumeId}")
    @Operation(summary = "Get all NLP-extracted entities for a resume")
    public ResponseEntity<List<ResumeEntityResponse>> getEntities(
            @AuthenticationPrincipal UserDetailsImpl user,
            @PathVariable Long resumeId) {
        return ResponseEntity.ok(pipeline.getEntities(user.getId(), resumeId));
    }

    @GetMapping("/skills")
    @Operation(summary = "Get all skills extracted from the student's resumes")
    public ResponseEntity<List<StudentSkillResponse>> getSkills(
            @AuthenticationPrincipal UserDetailsImpl user) {
        return ResponseEntity.ok(pipeline.getStudentSkills(user.getId()));
    }

    @GetMapping("/profile-impact")
    @Operation(summary = "Get the student's career profile vector updated by resume processing")
    public ResponseEntity<ProfileVectorResponse> getProfileImpact(
            @AuthenticationPrincipal UserDetailsImpl user) {
        return ResponseEntity.ok(vectorService.getProfileImpact(user.getId()));
    }
}
