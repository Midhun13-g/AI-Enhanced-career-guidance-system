package com.careerguidance.repository;

import com.careerguidance.entity.AssessmentResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AssessmentResultRepository extends JpaRepository<AssessmentResult, Long> {
    Optional<AssessmentResult> findBySessionId(Long sessionId);
    java.util.List<AssessmentResult> findBySessionUserIdOrderByCreatedAtDesc(Long userId);
}
