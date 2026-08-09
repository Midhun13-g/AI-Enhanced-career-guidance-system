package com.careerguidance.service.impl;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import com.careerguidance.constant.ResumeStatus;
import com.careerguidance.dto.request.ResumeUpdateRequest;
import com.careerguidance.dto.response.ResumeAnalysisResponse;
import com.careerguidance.dto.response.ResumeResponse;
import com.careerguidance.entity.Resume;
import com.careerguidance.entity.ResumeAnalysis;
import com.careerguidance.entity.User;
import com.careerguidance.exception.BadRequestException;
import com.careerguidance.exception.FileTooLargeException;
import com.careerguidance.exception.ResumeNotFoundException;
import com.careerguidance.exception.UnauthorizedException;
import com.careerguidance.repository.ResumeAnalysisRepository;
import com.careerguidance.repository.ResumeRepository;
import com.careerguidance.repository.ResumeSkillRepository;
import com.careerguidance.repository.UserRepository;
import com.careerguidance.service.ResumeParserService;
import java.io.ByteArrayInputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.multipart.MultipartFile;

@ExtendWith(MockitoExtension.class)
class ResumeServiceImplTest {
    @Mock private ResumeRepository resumeRepository;
    @Mock private ResumeSkillRepository resumeSkillRepository;
    @Mock private ResumeAnalysisRepository resumeAnalysisRepository;
    @Mock private UserRepository userRepository;
    @Mock private ResumeParserService resumeParserService;
    @Mock private MultipartFile mockFile;

    private ResumeServiceImpl resumeService;
    private User testUser;
    private Path storageDirectory;

    @BeforeEach
    void setUp() throws Exception {
        storageDirectory = Files.createTempDirectory("resume-service-test-");
        resumeService = new ResumeServiceImpl(resumeRepository, resumeSkillRepository,
                resumeAnalysisRepository, userRepository, resumeParserService, storageDirectory.toString());
        testUser = new User();
        ReflectionTestUtils.setField(testUser, "id", 1L);
        testUser.setEmail("user@example.com");
        testUser.setFirstName("John");
        testUser.setLastName("Doe");
    }

    @Test void testUploadResumeFileEmpty() {
        when(mockFile.isEmpty()).thenReturn(true);
        assertThrows(BadRequestException.class, () -> resumeService.uploadResume(1L, mockFile));
    }

    @Test void testUploadResumeFileTooLarge() {
        when(mockFile.isEmpty()).thenReturn(false);
        when(mockFile.getSize()).thenReturn(6L * 1024 * 1024);
        assertThrows(FileTooLargeException.class, () -> resumeService.uploadResume(1L, mockFile));
    }

    @Test void testUploadResumeSuccess() throws Exception {
        byte[] contents = "%PDF test".getBytes();
        when(mockFile.isEmpty()).thenReturn(false);
        when(mockFile.getSize()).thenReturn((long) contents.length);
        when(mockFile.getContentType()).thenReturn("application/pdf");
        when(mockFile.getOriginalFilename()).thenReturn("resume.pdf");
        when(mockFile.getInputStream()).thenAnswer(invocation -> new ByteArrayInputStream(contents));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(resumeRepository.existsByUserIdAndOriginalFileNameAndFileSize(1L, "resume.pdf", (long) contents.length)).thenReturn(false);
        when(resumeRepository.save(any(Resume.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(resumeSkillRepository.findByResumeId(any())).thenReturn(List.of());

        ResumeResponse response = resumeService.uploadResume(1L, mockFile);

        assertEquals("resume.pdf", response.getFileName());
        verify(resumeRepository).save(any(Resume.class));
    }

    @Test void testGetResumeHistorySuccess() {
        Resume resume1 = resume(1L, testUser, "resume1.pdf");
        Resume resume2 = resume(2L, testUser, "resume2.pdf");
        when(resumeRepository.findByUserIdOrderByUploadTimeDesc(1L)).thenReturn(List.of(resume1, resume2));
        when(resumeSkillRepository.findByResumeId(any())).thenReturn(List.of());

        List<ResumeResponse> result = resumeService.getResumeHistory(1L);

        assertEquals(2, result.size());
        assertEquals("resume1.pdf", result.get(0).getFileName());
        verify(resumeRepository).findByUserIdOrderByUploadTimeDesc(1L);
    }

    @Test void testGetResumeSuccess() {
        Resume resume = resume(1L, testUser, "resume.pdf");
        when(resumeRepository.findById(1L)).thenReturn(Optional.of(resume));
        when(resumeSkillRepository.findByResumeId(1L)).thenReturn(List.of());

        ResumeResponse result = resumeService.getResume(1L, 1L);

        assertEquals("resume.pdf", result.getFileName());
    }

    @Test void testGetResumeNotFound() {
        when(resumeRepository.findById(999L)).thenReturn(Optional.empty());
        assertThrows(ResumeNotFoundException.class, () -> resumeService.getResume(1L, 999L));
    }

    @Test void testGetResumeUnauthorized() {
        User differentUser = new User();
        ReflectionTestUtils.setField(differentUser, "id", 2L);
        when(resumeRepository.findById(1L)).thenReturn(Optional.of(resume(1L, differentUser, "resume.pdf")));
        assertThrows(UnauthorizedException.class, () -> resumeService.getResume(1L, 1L));
    }

    @Test void testGetAnalysisSuccess() {
        when(resumeRepository.findById(1L)).thenReturn(Optional.of(resume(1L, testUser, "resume.pdf")));
        ResumeAnalysis analysis = new ResumeAnalysis();
        analysis.setResumeScore(75.0);
        analysis.setAtsScore(70.0);
        analysis.setSkillsDetected(3);
        when(resumeAnalysisRepository.findByResumeId(1L)).thenReturn(Optional.of(analysis));

        ResumeAnalysisResponse result = resumeService.getAnalysis(1L, 1L);

        assertEquals(75.0, result.getResumeScore());
    }

    @Test void testDeleteResumeSuccess() {
        Resume resume = resume(1L, testUser, "resume.pdf");
        resume.setFilePath(storageDirectory.resolve("missing.pdf").toString());
        when(resumeRepository.findById(1L)).thenReturn(Optional.of(resume));

        resumeService.deleteResume(1L, 1L);

        verify(resumeRepository).delete(resume);
    }

    @Test void testParseResumeSuccess() throws Exception {
        Path file = Files.createFile(storageDirectory.resolve("resume.pdf"));
        Resume resume = resume(1L, testUser, "resume.pdf");
        resume.setFilePath(file.toString());
        when(resumeRepository.findById(1L)).thenReturn(Optional.of(resume));
        when(resumeParserService.extractSkills(file)).thenReturn(List.of("Java", "Spring Boot"));
        when(resumeSkillRepository.findByResumeId(1L)).thenReturn(List.of());
        when(resumeAnalysisRepository.findByResumeId(1L)).thenReturn(Optional.empty());

        ResumeResponse response = resumeService.parseResume(1L, 1L);

        assertEquals(ResumeStatus.PARSED.name(), response.getStatus());
        verify(resumeSkillRepository).deleteByResumeId(1L);
        verify(resumeRepository, atLeastOnce()).save(resume);
    }

    @Test void testUpdateResumeWithSkills() {
        Resume resume = resume(1L, testUser, "resume.pdf");
        ResumeUpdateRequest request = new ResumeUpdateRequest();
        request.setSkills(List.of("Java", "Python"));
        when(resumeRepository.findById(1L)).thenReturn(Optional.of(resume));
        when(resumeSkillRepository.findByResumeId(1L)).thenReturn(List.of());
        when(resumeAnalysisRepository.findByResumeId(1L)).thenReturn(Optional.empty());

        assertDoesNotThrow(() -> resumeService.updateResume(1L, 1L, request));
        verify(resumeSkillRepository).deleteByResumeId(1L);
    }

    private Resume resume(Long id, User user, String fileName) {
        Resume resume = new Resume();
        ReflectionTestUtils.setField(resume, "id", id);
        resume.setUser(user);
        resume.setOriginalFileName(fileName);
        resume.setStoredFileName(fileName);
        resume.setFileType("application/pdf");
        resume.setFileSize(1L);
        resume.setFilePath(storageDirectory.resolve(fileName).toString());
        resume.setStatus(ResumeStatus.UPLOADED);
        return resume;
    }
}
