package com.careerguidance.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.careerguidance.dto.request.StudentProfileRequest;
import com.careerguidance.dto.response.ProfileCompletionResponse;
import com.careerguidance.dto.response.StudentProfileResponse;
import com.careerguidance.security.UserDetailsImpl;
import com.careerguidance.service.StudentProfileService;

import jakarta.validation.Valid;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/profile")
public class StudentProfileController {

    private final StudentProfileService studentProfileService;

    public StudentProfileController(StudentProfileService studentProfileService) {
        this.studentProfileService = studentProfileService;
    }

    @GetMapping
    public ResponseEntity<StudentProfileResponse> getProfile(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(studentProfileService.getProfile(userDetails.getId()));
    }

    @PutMapping
    public ResponseEntity<StudentProfileResponse> updateProfile(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                                               @Valid @RequestBody StudentProfileRequest request) {
        return ResponseEntity.ok(studentProfileService.createOrUpdateProfile(userDetails.getId(), request));
    }

    @PostMapping("/image")
    public ResponseEntity<StudentProfileResponse> uploadImage(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                                              @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(studentProfileService.uploadProfileImage(userDetails.getId(), file));
    }

    @GetMapping("/completion")
    public ResponseEntity<ProfileCompletionResponse> getCompletion(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(studentProfileService.getProfileCompletion(userDetails.getId()));
    }
}
