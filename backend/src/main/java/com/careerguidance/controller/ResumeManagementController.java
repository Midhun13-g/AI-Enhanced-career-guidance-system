package com.careerguidance.controller;

import com.careerguidance.dto.response.ResumeSummaryResponse;
import com.careerguidance.entity.Resume;
import com.careerguidance.exception.ResumeNotFoundException;
import com.careerguidance.repository.ResumeAnalysisRepository;
import com.careerguidance.repository.ResumeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/admin/resumes")
@PreAuthorize("hasRole('ADMIN')")
public class ResumeManagementController {
    private final ResumeRepository resumes;
    private final ResumeAnalysisRepository analyses;

    public ResumeManagementController(ResumeRepository resumes, ResumeAnalysisRepository analyses) {
        this.resumes = resumes;
        this.analyses = analyses;
    }

    @GetMapping
    public List<ResumeSummaryResponse> all() {
        return resumes.findAll().stream().map(this::map).toList();
    }

    @GetMapping("/{id}")
    public ResumeSummaryResponse one(@PathVariable Long id) {
        return map(find(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        resumes.delete(find(id));
        return ResponseEntity.noContent().build();
    }

    private Resume find(Long id) {
        return resumes.findById(id)
                .orElseThrow(() -> new ResumeNotFoundException("Resume not found: " + id));
    }

    private ResumeSummaryResponse map(Resume resume) {
        var analysis = analyses.findByResumeId(resume.getId()).orElse(null);
        return new ResumeSummaryResponse(resume.getId(),
                resume.getUser().getFirstName() + " " + resume.getUser().getLastName(),
                resume.getOriginalFileName(), resume.getStatus().name(),
                analysis == null ? null : analysis.getResumeScore(),
                analysis == null ? null : analysis.getAtsScore(), resume.getUploadTime());
    }
}
