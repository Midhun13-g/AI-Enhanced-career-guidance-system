package com.careerguidance.controller;

import com.careerguidance.constant.AssessmentStatus;
import com.careerguidance.dto.request.CreateAssessmentRequest;
import com.careerguidance.entity.Assessment;
import com.careerguidance.entity.User;
import com.careerguidance.repository.AssessmentRepository;
import com.careerguidance.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/assessments")
@PreAuthorize("hasRole('ADMIN')")
public class AdminAssessmentController {
    private final AssessmentRepository assessments;
    private final UserRepository users;
    public AdminAssessmentController(AssessmentRepository assessments, UserRepository users) { this.assessments = assessments; this.users = users; }

    @PostMapping
    public Assessment create(@Valid @RequestBody CreateAssessmentRequest request, Authentication authentication) {
        User admin = users.findByEmail(authentication.getName()).orElseThrow();
        Assessment assessment = new Assessment();
        assessment.setTitle(request.name()); assessment.setDescription(request.description()); assessment.setCategory(request.category());
        assessment.setDifficulty(request.difficulty().toUpperCase()); assessment.setDurationMinutes(request.duration());
        assessment.setTotalQuestions(request.questionCount()); assessment.setPassingPercentage(request.passingMarks().doubleValue());
        assessment.setMaximumAttempts(request.maxAttempts()); assessment.setNegativeMarking(request.negativeMarking());
        assessment.setNegativeValue(request.negativeMarking() ? request.negativeValue() : 0.0);
        assessment.setShuffleQuestions(request.shuffleQuestions()); assessment.setInstructions(request.instructions()); assessment.setCreatedBy(admin);
        try { assessment.setStatus(AssessmentStatus.valueOf((request.status() == null ? "DRAFT" : request.status()).toUpperCase())); }
        catch (IllegalArgumentException ex) { assessment.setStatus(AssessmentStatus.DRAFT); }
        return assessments.save(assessment);
    }
}
