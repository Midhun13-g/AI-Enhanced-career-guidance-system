package com.careerguidance.service;

import org.springframework.web.multipart.MultipartFile;

import com.careerguidance.dto.request.StudentProfileRequest;
import com.careerguidance.dto.response.ProfileCompletionResponse;
import com.careerguidance.dto.response.StudentProfileResponse;

public interface StudentProfileService {
    StudentProfileResponse getProfile(Long userId);
    StudentProfileResponse createOrUpdateProfile(Long userId, StudentProfileRequest request);
    StudentProfileResponse uploadProfileImage(Long userId, MultipartFile file);
    ProfileCompletionResponse getProfileCompletion(Long userId);
}
