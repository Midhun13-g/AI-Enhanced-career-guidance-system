package com.careerguidance.repository;

import com.careerguidance.entity.AssessmentQuestion;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssessmentQuestionRepository extends JpaRepository<AssessmentQuestion, Long> {
    @EntityGraph(attributePaths = {"category", "options"})
    List<AssessmentQuestion> findByIsActiveTrueOrderByCategoryNameAscDisplayOrderAsc();
}
