package com.careerguidance.dto.response;
import com.careerguidance.entity.*; import java.time.*; import java.util.*;
public record MentorProfileResponse(Long id, Long userId, String fullName, String email, String phone, String company, String jobTitle, Integer experienceYears, String expertise, String bio, String linkedinUrl, String githubUrl, String portfolioUrl, AccountStatus status, LocalDateTime submittedAt, LocalDateTime verifiedAt, List<Document> documents) { public record Document(Long id,String type,String fileUrl){} }
