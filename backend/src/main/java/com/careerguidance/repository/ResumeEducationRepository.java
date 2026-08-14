package com.careerguidance.repository;
import com.careerguidance.entity.ResumeEducation;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ResumeEducationRepository extends JpaRepository<ResumeEducation,Long> {
    long countByResumeId(Long resumeId);
}
