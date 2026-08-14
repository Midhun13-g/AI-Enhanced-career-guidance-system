package com.careerguidance.controller;

import com.careerguidance.dto.request.ResumeUpdateRequest;
import com.careerguidance.dto.response.ResumeAnalysisResponse;
import com.careerguidance.dto.response.ResumeResponse;
import com.careerguidance.security.UserDetailsImpl;
import com.careerguidance.service.ResumeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/resumes")
@Tag(name = "Resumes", description = "Resume upload, parsing, analysis, and management")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasAuthority('STUDENT')")
public class ResumeController {

    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload a PDF or DOCX resume")
    public ResponseEntity<ResumeResponse> uploadResume(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestPart("resume") MultipartFile resume) {
        ResumeResponse response = resumeService.uploadResume(userDetails.getId(), resume);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @Operation(summary = "Get resume history for the authenticated student")
    public ResponseEntity<List<ResumeResponse>> getResumeHistory(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(resumeService.getResumeHistory(userDetails.getId()));
    }

    @GetMapping("/{resumeId}")
    @Operation(summary = "Get resume details")
    public ResponseEntity<ResumeResponse> getResume(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long resumeId) {
        return ResponseEntity.ok(resumeService.getResume(userDetails.getId(), resumeId));
    }

    @PostMapping("/{resumeId}/parse")
    @Operation(summary = "Parse a resume and generate analysis")
    public ResponseEntity<ResumeResponse> parseResume(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long resumeId) {
        return ResponseEntity.ok(resumeService.parseResume(userDetails.getId(), resumeId));
    }

    @PutMapping("/{resumeId}")
    @Operation(summary = "Update extracted resume data")
    public ResponseEntity<ResumeResponse> updateResume(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long resumeId,
            @RequestBody ResumeUpdateRequest request) {
        return ResponseEntity.ok(resumeService.updateResume(userDetails.getId(), resumeId, request));
    }

    @GetMapping("/{resumeId}/analysis")
    @Operation(summary = "Get resume analysis and scores")
    public ResponseEntity<ResumeAnalysisResponse> getAnalysis(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long resumeId) {
        return ResponseEntity.ok(resumeService.getAnalysis(userDetails.getId(), resumeId));
    }

    @GetMapping("/{resumeId}/download")
    @Operation(summary = "Download the original resume file")
    public ResponseEntity<Resource> downloadResume(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long resumeId) {
        Resource resource = resumeService.downloadResume(userDetails.getId(), resumeId);
        ContentDisposition disposition = ContentDisposition.attachment()
                .filename(resource.getFilename() == null ? "resume" : resource.getFilename())
                .build();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, disposition.toString())
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }

    @DeleteMapping("/{resumeId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete a resume and its extracted data")
    public void deleteResume(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long resumeId) {
        resumeService.deleteResume(userDetails.getId(), resumeId);
    }
}
