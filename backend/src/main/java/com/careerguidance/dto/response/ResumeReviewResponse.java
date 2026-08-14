package com.careerguidance.dto.response; import java.time.LocalDateTime; import java.util.List;
public record ResumeReviewResponse(Long id,String fileName,String fileType,Long fileSize,String reviewStatus,Double resumeScore,Double atsScore,List<String> skills,LocalDateTime uploadedAt) {}
