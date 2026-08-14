package com.careerguidance.dto.response;
public record DashboardResponse(long totalUsers,long totalStudents,long totalMentors,long totalAdmins,long totalResumes,long totalAssessments,double averageResumeScore,double averageAtsScore,long activeUsers) {}
