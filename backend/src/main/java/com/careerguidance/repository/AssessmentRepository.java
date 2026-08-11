package com.careerguidance.repository;

import com.careerguidance.entity.Assessment;
import com.careerguidance.constant.AssessmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AssessmentRepository extends JpaRepository<Assessment, Long> {
    List<Assessment> findByStatusOrderByCreatedAtDesc(AssessmentStatus status);
}
