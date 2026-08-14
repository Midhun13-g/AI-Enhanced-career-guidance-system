package com.careerguidance.repository;

import com.careerguidance.entity.AssessmentAnswer;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AssessmentAnswerRepository extends JpaRepository<AssessmentAnswer, Long> {
    boolean existsBySessionIdAndQuestionId(Long sessionId, Long questionId);

    Optional<AssessmentAnswer> findBySessionIdAndQuestionId(Long sessionId, Long questionId);

    @EntityGraph(attributePaths = {"session", "question", "question.category", "option"})
    List<AssessmentAnswer> findBySessionId(Long sessionId);

    Optional<AssessmentAnswer> findByIdAndSessionUserId(Long id, Long userId);
}
