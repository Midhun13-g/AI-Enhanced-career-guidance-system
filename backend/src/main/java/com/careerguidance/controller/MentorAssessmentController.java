package com.careerguidance.controller;

import com.careerguidance.dto.response.AdminAssessmentResponse;
import com.careerguidance.entity.Assessment;
import com.careerguidance.exception.ResourceNotFoundException;
import com.careerguidance.repository.AssessmentRepository;
import com.careerguidance.repository.UserRepository;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/mentor/assessments")
@PreAuthorize("hasRole('MENTOR')")
public class MentorAssessmentController {
  private final AssessmentRepository assessments; private final UserRepository users;
  public MentorAssessmentController(AssessmentRepository a, UserRepository u) { assessments=a; users=u; }
  @GetMapping public List<AdminAssessmentResponse> mine(Authentication auth) { var user=users.findByEmail(auth.getName()).orElseThrow(); return assessments.findByCreatedByIdOrderByCreatedAtDesc(user.getId()).stream().map(AdminAssessmentResponse::from).toList(); }
  @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id, Authentication auth) { var user=users.findByEmail(auth.getName()).orElseThrow(); Assessment assessment=assessments.findById(id).orElseThrow(()->new ResourceNotFoundException("Assessment not found")); if(!assessment.getCreatedBy().getId().equals(user.getId())) throw new org.springframework.security.access.AccessDeniedException("You can delete only your own assessments."); assessments.delete(assessment); return ResponseEntity.noContent().build(); }
}
