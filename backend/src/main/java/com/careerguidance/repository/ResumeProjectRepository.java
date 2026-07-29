package com.careerguidance.repository;
import com.careerguidance.entity.ResumeProject;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ResumeProjectRepository extends JpaRepository<ResumeProject,Long> {
    long countByResumeId(Long resumeId);
}
