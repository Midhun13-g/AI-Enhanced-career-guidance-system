package com.careerguidance.repository;

import com.careerguidance.entity.AttemptAnswer;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AttemptAnswerRepository extends JpaRepository<AttemptAnswer, Long> {

    @EntityGraph(attributePaths = {"item", "selectedOption"})
    List<AttemptAnswer> findByAttemptId(Long attemptId);

    Optional<AttemptAnswer> findByAttemptIdAndItemId(Long attemptId, Long itemId);

    boolean existsByAttemptIdAndItemId(Long attemptId, Long itemId);
}
