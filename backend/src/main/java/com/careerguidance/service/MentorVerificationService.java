package com.careerguidance.service;
import com.careerguidance.dto.request.*; import com.careerguidance.dto.response.*; import java.util.*;
public interface MentorVerificationService { MessageResponse register(MentorRegistrationRequest request); List<MentorProfileResponse> pending(); MentorProfileResponse detail(Long id); MessageResponse approve(Long id,String adminEmail); MessageResponse reject(Long id,RejectionRequest request,String adminEmail); Map<String,Long> statistics(); }
