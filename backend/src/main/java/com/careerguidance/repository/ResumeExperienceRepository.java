package com.careerguidance.repository;
import com.careerguidance.entity.ResumeExperience;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ResumeExperienceRepository extends JpaRepository<ResumeExperience,Long> {
    long countByResumeId(Long resumeId);
}
