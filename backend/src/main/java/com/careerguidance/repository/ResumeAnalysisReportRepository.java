package com.careerguidance.repository;

import com.careerguidance.entity.ResumeAnalysisReport;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ResumeAnalysisReportRepository extends JpaRepository<ResumeAnalysisReport, Long> {
    Optional<ResumeAnalysisReport> findByResumeId(Long resumeId);
}
