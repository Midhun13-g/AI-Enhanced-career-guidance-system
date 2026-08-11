package com.careerguidance.controller;

import com.careerguidance.constant.AssessmentStatus;
import com.careerguidance.dto.request.CreateAssessmentRequest;
import com.careerguidance.dto.response.AdminAssessmentResponse;
import com.careerguidance.entity.Assessment;
import com.careerguidance.entity.AssessmentItem;
import com.careerguidance.entity.AssessmentItemOption;
import com.careerguidance.entity.User;
import com.careerguidance.repository.AssessmentRepository;
import com.careerguidance.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin/assessments")
@PreAuthorize("hasRole('ADMIN')")
public class AdminAssessmentController {
    private final AssessmentRepository assessments;
    private final UserRepository users;
    public AdminAssessmentController(AssessmentRepository assessments, UserRepository users) { this.assessments = assessments; this.users = users; }

    @PostMapping
    public AdminAssessmentResponse create(@Valid @RequestBody CreateAssessmentRequest request, Authentication authentication) {
        boolean publishing = "PUBLISHED".equalsIgnoreCase(request.status());
        if (publishing && (request.questions() == null || request.questions().isEmpty())) {
            throw new IllegalArgumentException("Generate or add at least one question before publishing this assessment.");
        }
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
        if (request.questions() != null) {
            int questionOrder = 0;
            for (CreateAssessmentRequest.AssessmentQuestionInput input : request.questions()) {
                if (input.correctOptionIndex() == null || input.correctOptionIndex() < 0 || input.correctOptionIndex() >= input.options().size()) {
                    throw new IllegalArgumentException("Each question needs a valid correct answer.");
                }
                AssessmentItem item = new AssessmentItem();
                item.setAssessment(assessment); item.setQuestionText(input.questionText().trim());
                item.setDifficulty(request.difficulty().toUpperCase()); item.setDisplayOrder(questionOrder++);
                item.setNegativeMarks(request.negativeMarking() ? request.negativeValue() : 0.0);
                for (int optionOrder = 0; optionOrder < input.options().size(); optionOrder++) {
                    AssessmentItemOption option = new AssessmentItemOption();
                    option.setItem(item); option.setOptionText(input.options().get(optionOrder).trim());
                    option.setIsCorrect(optionOrder == input.correctOptionIndex()); option.setDisplayOrder(optionOrder);
                    item.getOptions().add(option);
                }
                assessment.getItems().add(item);
            }
            assessment.setTotalQuestions(request.questions().size());
        }
        return AdminAssessmentResponse.from(assessments.save(assessment));
    }

    @GetMapping
    public List<AdminAssessmentResponse> all() { return assessments.findAll().stream().map(AdminAssessmentResponse::from).toList(); }
}
