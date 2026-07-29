package com.careerguidance.repository;
import com.careerguidance.entity.ResumeAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface ResumeAnalysisRepository extends JpaRepository<ResumeAnalysis,Long> {
    Optional<ResumeAnalysis> findByResumeId(Long resumeId);
}
