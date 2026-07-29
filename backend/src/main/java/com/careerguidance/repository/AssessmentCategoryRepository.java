package com.careerguidance.repository;

import com.careerguidance.constant.AssessmentCategoryName;
import com.careerguidance.entity.AssessmentCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AssessmentCategoryRepository extends JpaRepository<AssessmentCategory, Long> {
    Optional<AssessmentCategory> findByName(AssessmentCategoryName name);
}
