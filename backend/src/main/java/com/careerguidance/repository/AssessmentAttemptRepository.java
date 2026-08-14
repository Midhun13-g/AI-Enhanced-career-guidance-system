package com.careerguidance.repository;

import com.careerguidance.constant.AttemptStatus;
import com.careerguidance.entity.AssessmentAttempt;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface AssessmentAttemptRepository extends JpaRepository<AssessmentAttempt, Long> {

    int countByStudentIdAndAssessmentId(Long studentId, Long assessmentId);

    List<AssessmentAttempt> findByStudentIdOrderByStartedAtDesc(Long studentId);

    @EntityGraph(attributePaths = {"assessment", "answers", "answers.item", "answers.selectedOption", "result"})
    Optional<AssessmentAttempt> findWithDetailsById(Long id);

    @Query("SELECT a FROM AssessmentAttempt a WHERE a.student.id = :studentId AND a.assessment.id = :assessmentId AND a.status = :status")
    Optional<AssessmentAttempt> findByStudentIdAndAssessmentIdAndStatus(Long studentId, Long assessmentId, AttemptStatus status);

    boolean existsByStudentIdAndAssessmentIdAndStatus(Long studentId, Long assessmentId, AttemptStatus status);
}
