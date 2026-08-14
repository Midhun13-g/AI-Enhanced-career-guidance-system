package com.careerguidance.service.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.careerguidance.dto.request.StudentProfileRequest;
import com.careerguidance.dto.response.ProfileCompletionResponse;
import com.careerguidance.dto.response.StudentProfileResponse;
import com.careerguidance.entity.StudentProfile;
import com.careerguidance.entity.User;
import com.careerguidance.exception.BadRequestException;
import com.careerguidance.exception.ResourceNotFoundException;
import com.careerguidance.mapper.StudentProfileMapper;
import com.careerguidance.repository.StudentProfileRepository;
import com.careerguidance.repository.UserRepository;
import com.careerguidance.service.StudentProfileService;

@Service
public class StudentProfileServiceImpl implements StudentProfileService {

    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;
    private final Path uploadDir = Paths.get("uploads/profile-images");

    public StudentProfileServiceImpl(StudentProfileRepository studentProfileRepository, UserRepository userRepository) {
        this.studentProfileRepository = studentProfileRepository;
        this.userRepository = userRepository;
    }

    @Override
    public StudentProfileResponse getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        StudentProfile profile = studentProfileRepository.findByUserId(userId)
                .orElseGet(() -> createProfileFromUser(user));
        return StudentProfileMapper.toResponse(profile);
    }

    private StudentProfile createProfileFromUser(User user) {
        StudentProfile profile = new StudentProfile();
        profile.setUser(user);
        profile.setFirstName(user.getFirstName());
        profile.setLastName(user.getLastName());
        profile.setEmail(user.getEmail());
        profile.setPhone(user.getPhone());
        profile.setGender(user.getGender());
        profile.setDateOfBirth(user.getDob());
        profile.setCollegeName(user.getCollegeName());
        profile.setCgpa(user.getCgpa());
        return studentProfileRepository.save(profile);
    }

    @Override
    public StudentProfileResponse createOrUpdateProfile(Long userId, StudentProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        StudentProfile profile = studentProfileRepository.findByUserId(userId)
                .map(existing -> { StudentProfileMapper.updateEntity(existing, request); return existing; })
                .orElseGet(() -> StudentProfileMapper.toEntity(request, user));

        StudentProfile saved = studentProfileRepository.save(profile);
        return StudentProfileMapper.toResponse(saved);
    }

    @Override
    public StudentProfileResponse uploadProfileImage(Long userId, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Please select an image file");
        }

        StudentProfile profile = studentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));

        try {
            Files.createDirectories(uploadDir);
            String fileName = "user-" + userId + "-" + System.currentTimeMillis() + "-" + file.getOriginalFilename();
            Path targetPath = uploadDir.resolve(fileName);
            Files.copy(file.getInputStream(), targetPath);
            profile.setProfileImage(targetPath.toString());
            StudentProfile saved = studentProfileRepository.save(profile);
            return StudentProfileMapper.toResponse(saved);
        } catch (IOException ex) {
            throw new BadRequestException("Unable to upload profile image");
        }
    }

    @Override
    public ProfileCompletionResponse getProfileCompletion(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        StudentProfile profile = studentProfileRepository.findByUserId(userId)
                .orElseGet(() -> createProfileFromUser(user));

        List<String> missingFields = new ArrayList<>();
        if (profile.getSkills() == null || profile.getSkills().isEmpty()) {
            missingFields.add("Skills");
        }
        if (profile.getCareerGoal() == null || profile.getCareerGoal().isBlank()) {
            missingFields.add("Career Goal");
        }
        if (profile.getLinkedinUrl() == null || profile.getLinkedinUrl().isBlank()) {
            missingFields.add("LinkedIn");
        }
        if (profile.getCollegeName() == null || profile.getCollegeName().isBlank()) {
            missingFields.add("College Name");
        }
        if (profile.getPhone() == null || profile.getPhone().isBlank()) {
            missingFields.add("Phone");
        }

        int completedFields = 6 - missingFields.size();
        int percent = Math.max(0, Math.min(100, Math.round(completedFields * 100f / 6)));

        return new ProfileCompletionResponse(percent, missingFields);
    }
}
