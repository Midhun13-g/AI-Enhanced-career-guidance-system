package com.careerguidance.repository;
import com.careerguidance.entity.ResumeCertification;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ResumeCertificationRepository extends JpaRepository<ResumeCertification,Long> {
    long countByResumeId(Long resumeId);
}
