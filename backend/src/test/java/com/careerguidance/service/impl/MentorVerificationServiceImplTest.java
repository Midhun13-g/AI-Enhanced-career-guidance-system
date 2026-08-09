package com.careerguidance.service.impl;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import com.careerguidance.dto.request.MentorRegistrationRequest;
import com.careerguidance.dto.request.RejectionRequest;
import com.careerguidance.dto.response.MentorProfileResponse;
import com.careerguidance.entity.*;
import com.careerguidance.exception.*;
import com.careerguidance.repository.*;

@ExtendWith(MockitoExtension.class)
public class MentorVerificationServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private MentorProfileRepository mentorProfileRepository;

    @Mock
    private MentorVerificationLogRepository mentorVerificationLogRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private MentorVerificationServiceImpl mentorVerificationService;

    @Test
    void testRegisterSuccess() {
        // Arrange
        MentorRegistrationRequest request = new MentorRegistrationRequest();
        request.setFullName("John Smith");
        request.setEmail("john@example.com");
        request.setPassword("password123");
        request.setCompany("Tech Corp");
        request.setJobTitle("Senior Developer");
        request.setExperienceYears(5);
        request.setDocuments(List.of(document("Government ID"), document("Professional ID"), document("Resume")));

        Role mentorRole = new Role();
        mentorRole.setName(RoleName.MENTOR);

        when(userRepository.existsByEmail("john@example.com")).thenReturn(false);
        when(roleRepository.findByName(RoleName.MENTOR)).thenReturn(Optional.of(mentorRole));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(mentorProfileRepository.save(any(MentorProfile.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(passwordEncoder.encode("password123")).thenReturn("encoded-password");

        // Act
        assertDoesNotThrow(() -> mentorVerificationService.register(request));

        // Assert
        verify(userRepository, times(1)).existsByEmail("john@example.com");
        verify(roleRepository, times(1)).findByName(RoleName.MENTOR);
        verify(userRepository, times(1)).save(any(User.class));
        verify(mentorProfileRepository, times(1)).save(any(MentorProfile.class));
    }

    @Test
    void testPending() {
        // Arrange
        MentorProfile profile = new MentorProfile();
        profile.setUser(user(1L, "mentor@example.com"));
        ReflectionTestUtils.setField(profile, "id", 1L);
        profile.setVerificationStatus(AccountStatus.PENDING_VERIFICATION);
        profile.setCompany("Tech Corp");
        profile.setJobTitle("Developer");

        when(mentorProfileRepository.findByVerificationStatus(AccountStatus.PENDING_VERIFICATION))
                .thenReturn(List.of(profile));

        // Act
        List<MentorProfileResponse> result = mentorVerificationService.pending();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(mentorProfileRepository, times(1)).findByVerificationStatus(AccountStatus.PENDING_VERIFICATION);
    }

    @Test
    void testDetail() {
        // Arrange
        MentorProfile profile = new MentorProfile();
        profile.setUser(user(1L, "mentor@example.com"));
        ReflectionTestUtils.setField(profile, "id", 1L);
        profile.setVerificationStatus(AccountStatus.VERIFIED);
        profile.setCompany("Tech Corp");

        when(mentorProfileRepository.findById(1L)).thenReturn(Optional.of(profile));

        // Act
        MentorProfileResponse result = mentorVerificationService.detail(1L);

        // Assert
        assertNotNull(result);
        verify(mentorProfileRepository, times(1)).findById(1L);
    }

    @Test
    void testDetailNotFound() {
        // Arrange
        when(mentorProfileRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> mentorVerificationService.detail(999L));
    }

    @Test
    void testApprove() {
        // Arrange
        MentorProfile profile = new MentorProfile();
        profile.setVerificationStatus(AccountStatus.PENDING_VERIFICATION);

        User mentorUser = new User();
        mentorUser.setEmail("mentor@example.com");
        mentorUser.setAccountStatus(AccountStatus.PENDING_VERIFICATION);
        profile.setUser(mentorUser);

        User adminUser = new User();
        adminUser.setEmail("admin@example.com");

        when(mentorProfileRepository.findById(1L)).thenReturn(Optional.of(profile));
        when(userRepository.findByEmail("admin@example.com")).thenReturn(Optional.of(adminUser));

        // Act
        assertDoesNotThrow(() -> mentorVerificationService.approve(1L, "admin@example.com"));

        // Assert
        verify(mentorProfileRepository, times(1)).findById(1L);
        verify(userRepository, times(1)).findByEmail("admin@example.com");
        verify(mentorVerificationLogRepository, times(1)).save(any(MentorVerificationLog.class));
    }

    @Test
    void testApproveAdminNotFound() {
        // Arrange
        MentorProfile profile = new MentorProfile();
        when(mentorProfileRepository.findById(1L)).thenReturn(Optional.of(profile));
        when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(UnauthorizedException.class,
                () -> mentorVerificationService.approve(1L, "nonexistent@example.com"));
    }

    @Test
    void testReject() {
        // Arrange
        MentorProfile profile = new MentorProfile();
        profile.setVerificationStatus(AccountStatus.PENDING_VERIFICATION);

        User mentorUser = new User();
        mentorUser.setEmail("mentor@example.com");
        profile.setUser(mentorUser);

        User adminUser = new User();
        adminUser.setEmail("admin@example.com");

        when(mentorProfileRepository.findById(1L)).thenReturn(Optional.of(profile));
        when(userRepository.findByEmail("admin@example.com")).thenReturn(Optional.of(adminUser));

        // Act
        RejectionRequest request = new RejectionRequest();
        request.setRemarks("Incomplete documents");
        assertDoesNotThrow(() -> mentorVerificationService.reject(1L, request, "admin@example.com"));

        // Assert
        verify(mentorProfileRepository, times(1)).findById(1L);
        verify(userRepository, times(1)).findByEmail("admin@example.com");
        verify(mentorVerificationLogRepository, times(1)).save(any(MentorVerificationLog.class));
    }

    @Test
    void testStatistics() {
        // Arrange
        when(userRepository.countByRoles_Name(RoleName.MENTOR)).thenReturn(10L);
        when(mentorProfileRepository.countByVerificationStatus(AccountStatus.PENDING_VERIFICATION)).thenReturn(3L);
        when(mentorProfileRepository.countByVerificationStatus(AccountStatus.VERIFIED)).thenReturn(7L);
        when(mentorProfileRepository.countByVerificationStatus(AccountStatus.REJECTED)).thenReturn(0L);

        // Act
        assertDoesNotThrow(() -> mentorVerificationService.statistics());

        // Assert
        verify(userRepository, times(1)).countByRoles_Name(RoleName.MENTOR);
    }

    private MentorRegistrationRequest.DocumentRequest document(String type) {
        MentorRegistrationRequest.DocumentRequest document = new MentorRegistrationRequest.DocumentRequest();
        document.documentType = type;
        document.fileUrl = "https://example.com/" + type.replace(" ", "-").toLowerCase();
        return document;
    }

    private User user(Long id, String email) {
        User user = new User();
        ReflectionTestUtils.setField(user, "id", id);
        user.setFirstName("John");
        user.setLastName("Smith");
        user.setEmail(email);
        return user;
    }
}
