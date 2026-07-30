package com.careerguidance.dto.response;
import java.time.LocalDateTime;
public record ResumeSummaryResponse(Long id,String studentName,String fileName,String status,Double resumeScore,Double atsScore,LocalDateTime uploadTime) {}
