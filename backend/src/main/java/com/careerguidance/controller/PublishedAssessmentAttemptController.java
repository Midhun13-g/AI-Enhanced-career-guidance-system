package com.careerguidance.controller;

import com.careerguidance.constant.AssessmentStatus;
import com.careerguidance.constant.AttemptStatus;
import com.careerguidance.dto.request.PublishedAssessmentSubmitRequest;
import com.careerguidance.dto.response.PublishedAssessmentResultResponse;
import com.careerguidance.entity.Assessment;
import com.careerguidance.entity.AssessmentAttempt;
import com.careerguidance.entity.AttemptAnswer;
import com.careerguidance.exception.ResourceNotFoundException;
import com.careerguidance.repository.AssessmentAttemptRepository;
import com.careerguidance.repository.AssessmentRepository;
import com.careerguidance.repository.UserRepository;
import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/assessment/published")
public class PublishedAssessmentAttemptController {
    private final AssessmentRepository assessments;
    private final AssessmentAttemptRepository attempts;
    private final UserRepository users;

    public PublishedAssessmentAttemptController(AssessmentRepository assessments, AssessmentAttemptRepository attempts, UserRepository users) {
        this.assessments = assessments; this.attempts = attempts; this.users = users;
    }

    @PostMapping("/{assessmentId}/submit")
    @Transactional
    public ResponseEntity<PublishedAssessmentResultResponse> submit(@PathVariable Long assessmentId,
            @Valid @RequestBody PublishedAssessmentSubmitRequest request, Authentication authentication) {
        Assessment assessment = published(assessmentId);
        var student = users.findByEmail(authentication.getName()).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        int used = attempts.countByStudentIdAndAssessmentId(student.getId(), assessmentId);
        if (used >= assessment.getMaximumAttempts()) throw new IllegalArgumentException("Maximum attempts reached for this assessment.");

        Map<Long, Long> submitted = new HashMap<>();
        request.answers().forEach(answer -> submitted.put(answer.questionId(), answer.optionId()));
        AssessmentAttempt attempt = new AssessmentAttempt();
        attempt.setStudent(student); attempt.setAssessment(assessment); attempt.setAttemptNumber(used + 1);
        int correct = 0, wrong = 0, skipped = 0;
        for (var item : assessment.getItems().stream().filter(item -> Boolean.TRUE.equals(item.getIsActive()))
                .sorted(Comparator.comparing(item -> item.getDisplayOrder())).toList()) {
            Long selectedId = submitted.get(item.getId());
            var selected = item.getOptions().stream().filter(option -> option.getId().equals(selectedId)).findFirst().orElse(null);
            var correctOption = item.getOptions().stream().filter(option -> Boolean.TRUE.equals(option.getIsCorrect())).findFirst().orElse(null);
            AttemptAnswer answer = new AttemptAnswer(); answer.setAttempt(attempt); answer.setItem(item); answer.setSelectedOption(selected);
            answer.setSelectedText(selected == null ? null : selected.getOptionText());
            boolean isCorrect = selected != null && correctOption != null && selected.getId().equals(correctOption.getId());
            answer.setIsCorrect(isCorrect); answer.setMarksObtained(isCorrect ? item.getMarks() : 0.0); attempt.getAnswers().add(answer);
            if (selected == null) skipped++; else if (isCorrect) correct++; else wrong++;
        }
        int total = correct + wrong + skipped;
        double percentage = total == 0 ? 0.0 : correct * 100.0 / total;
        attempt.setCorrectAnswers(correct); attempt.setWrongAnswers(wrong); attempt.setSkippedAnswers(skipped);
        attempt.setScore((double) correct); attempt.setPercentage(percentage); attempt.setAccuracy(percentage);
        attempt.setTimeTakenSecs(request.timeTakenSecs()); attempt.setStatus(AttemptStatus.SUBMITTED); attempt.setSubmittedAt(LocalDateTime.now());
        return ResponseEntity.ok(toResult(attempts.save(attempt)));
    }

    @GetMapping("/attempts/{attemptId}/result")
    @Transactional(readOnly = true)
    public ResponseEntity<PublishedAssessmentResultResponse> result(@PathVariable Long attemptId, Authentication authentication) {
        var attempt = attempts.findWithDetailsById(attemptId).orElseThrow(() -> new ResourceNotFoundException("Assessment attempt not found"));
        if (!attempt.getStudent().getEmail().equals(authentication.getName())) throw new org.springframework.security.access.AccessDeniedException("This attempt belongs to another user.");
        return ResponseEntity.ok(toResult(attempt));
    }

    @GetMapping("/history")
    @Transactional(readOnly = true)
    public ResponseEntity<List<PublishedAssessmentResultResponse>> history(Authentication authentication) {
        var user = users.findByEmail(authentication.getName()).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return ResponseEntity.ok(attempts.findByStudentIdOrderByStartedAtDesc(user.getId()).stream()
                .filter(attempt -> attempt.getStatus() == AttemptStatus.SUBMITTED).map(this::toResult).toList());
    }

    private Assessment published(Long id) {
        return assessments.findById(id).filter(item -> item.getStatus() == AssessmentStatus.PUBLISHED)
                .orElseThrow(() -> new ResourceNotFoundException("Published assessment not found"));
    }

    private PublishedAssessmentResultResponse toResult(AssessmentAttempt attempt) {
        var review = attempt.getAnswers().stream().sorted(Comparator.comparing(answer -> answer.getItem().getDisplayOrder())).map(answer -> {
            var correct = answer.getItem().getOptions().stream().filter(option -> Boolean.TRUE.equals(option.getIsCorrect())).findFirst().orElse(null);
            return new PublishedAssessmentResultResponse.ReviewQuestion(answer.getItem().getId(), answer.getItem().getQuestionText(),
                    answer.getSelectedText(), correct == null ? "" : correct.getOptionText(), Boolean.TRUE.equals(answer.getIsCorrect()));
        }).toList();
        return new PublishedAssessmentResultResponse(attempt.getId(), attempt.getAssessment().getId(), attempt.getAssessment().getTitle(),
                attempt.getPercentage(), attempt.getAssessment().getPassingPercentage(), attempt.getPercentage() >= attempt.getAssessment().getPassingPercentage(),
                attempt.getCorrectAnswers(), attempt.getWrongAnswers(), attempt.getSkippedAnswers(), attempt.getSubmittedAt(), review);
    }
}
