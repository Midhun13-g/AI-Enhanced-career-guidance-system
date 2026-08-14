package com.careerguidance.repository;

import com.careerguidance.entity.AssessmentSession;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AssessmentSessionRepository extends JpaRepository<AssessmentSession, Long> {
    List<AssessmentSession> findByUserIdOrderByStartedAtDesc(Long userId);

    @EntityGraph(attributePaths = {"answers", "answers.question", "answers.question.category", "answers.option", "result"})
    Optional<AssessmentSession> findWithAnswersById(Long id);
}
