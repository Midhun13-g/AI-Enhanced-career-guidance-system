package com.careerguidance.controller;

import com.careerguidance.dto.request.SkillTaxonomyRequest;
import com.careerguidance.dto.response.SkillTaxonomyResponse;
import com.careerguidance.repository.ResumeRepository;
import com.careerguidance.service.SkillTaxonomyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "Admin - NLP", description = "Admin APIs for skill taxonomy and resume statistics")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasAuthority('ADMIN')")
public class SkillTaxonomyAdminController {

    private final SkillTaxonomyService taxonomyService;
    private final ResumeRepository resumeRepo;

    public SkillTaxonomyAdminController(SkillTaxonomyService taxonomyService, ResumeRepository resumeRepo) {
        this.taxonomyService = taxonomyService;
        this.resumeRepo = resumeRepo;
    }

    @GetMapping("/skills")
    @Operation(summary = "List all skill taxonomy entries")
    public ResponseEntity<List<SkillTaxonomyResponse>> listSkills(
            @RequestParam(required = false) String search) {
        List<SkillTaxonomyResponse> result = (search != null && !search.isBlank())
                ? taxonomyService.search(search)
                : taxonomyService.getAll();
        return ResponseEntity.ok(result);
    }

    @PostMapping("/skills")
    @Operation(summary = "Create a new skill taxonomy entry")
    public ResponseEntity<SkillTaxonomyResponse> createSkill(@Valid @RequestBody SkillTaxonomyRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(taxonomyService.create(req));
    }

    @PutMapping("/skills/{id}")
    @Operation(summary = "Update a skill taxonomy entry")
    public ResponseEntity<SkillTaxonomyResponse> updateSkill(
            @PathVariable Long id, @Valid @RequestBody SkillTaxonomyRequest req) {
        return ResponseEntity.ok(taxonomyService.update(id, req));
    }

    @DeleteMapping("/skills/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete a skill taxonomy entry")
    public void deleteSkill(@PathVariable Long id) {
        taxonomyService.delete(id);
    }

    @GetMapping("/resume/statistics")
    @Operation(summary = "Get resume upload and processing statistics")
    public ResponseEntity<Map<String, Object>> statistics() {
        long total = resumeRepo.count();
        Map<String, Object> stats = Map.of(
                "totalResumes", total,
                "message", "Use /api/admin/resumes for full listing"
        );
        return ResponseEntity.ok(stats);
    }
}
