package com.careerguidance.service;

import com.careerguidance.constant.AnalysisStatus;
import com.careerguidance.dto.AIAnalysisResponse;
import com.careerguidance.dto.AiAnalysisResultDto;
import com.careerguidance.dto.AiAnalysisSummaryDto;
import com.careerguidance.entity.AiCareerAnalysis;
import com.careerguidance.entity.User;
import com.careerguidance.exception.AIServiceException;
import com.careerguidance.exception.UnauthorizedAccessException;
import com.careerguidance.repository.AiCareerAnalysisRepository;
import com.careerguidance.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AiCareerAnalysisServiceTest {

    @Mock
    private HuggingFaceAIClient aiClient;

    @Mock
    private AiCareerAnalysisRepository analysisRepository;

    @Mock
    private UserRepository userRepository;

    private ObjectMapper objectMapper;
    private AiCareerAnalysisService service;

    private User testUser;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        service = new AiCareerAnalysisService(aiClient, analysisRepository, userRepository, objectMapper);

        testUser = new User();
        org.springframework.test.util.ReflectionTestUtils.setField(testUser, "id", 10L);
        testUser.setEmail("student@example.com");
        testUser.setFirstName("Jane");
        testUser.setLastName("Doe");
    }

    @Test
    void analyzeResume_Success_SavesCompletedAnalysis() {
        MockMultipartFile file = new MockMultipartFile(
                "file", "resume.pdf", "application/pdf", "Dummy PDF content".getBytes()
        );

        when(userRepository.findById(10L)).thenReturn(Optional.of(testUser));

        AiCareerAnalysis savedAnalysis = new AiCareerAnalysis();
        savedAnalysis.setId(101L);
        savedAnalysis.setUser(testUser);
        savedAnalysis.setOriginalFileName("resume.pdf");
        savedAnalysis.setStatus(AnalysisStatus.PROCESSING);

        when(analysisRepository.save(any(AiCareerAnalysis.class))).thenReturn(savedAnalysis);

        AIAnalysisResponse aiResponse = new AIAnalysisResponse();
        aiResponse.setSuccess(true);
        aiResponse.setRequestId("req-12345");
        aiResponse.setExecutionTime(1.85);
        aiResponse.setResume(Map.of("skills", List.of("Java", "Spring Boot", "React")));

        when(aiClient.analyzeResume(file)).thenReturn(aiResponse);

        AiAnalysisResultDto result = service.analyzeResume(10L, file);

        assertNotNull(result);
        assertTrue(result.isSuccess());
        assertEquals(101L, result.getAnalysisId());
        assertEquals(AnalysisStatus.COMPLETED, result.getStatus());
        assertEquals("req-12345", result.getData().getRequestId());

        verify(analysisRepository, atLeast(2)).save(any(AiCareerAnalysis.class));
    }

    @Test
    void analyzeResume_EmptyFile_ThrowsException() {
        MockMultipartFile emptyFile = new MockMultipartFile("file", "resume.pdf", "application/pdf", new byte[0]);

        AIServiceException ex = assertThrows(AIServiceException.class, () -> service.analyzeResume(10L, emptyFile));
        assertEquals("INVALID_FILE", ex.getErrorCode());
        verifyNoInteractions(aiClient);
    }

    @Test
    void analyzeResume_UnsupportedExtension_ThrowsException() {
        MockMultipartFile exeFile = new MockMultipartFile("file", "resume.exe", "application/octet-stream", "Malicious".getBytes());

        AIServiceException ex = assertThrows(AIServiceException.class, () -> service.analyzeResume(10L, exeFile));
        assertEquals("UNSUPPORTED_FORMAT", ex.getErrorCode());
        verifyNoInteractions(aiClient);
    }

    @Test
    void analyzeResume_AiClientThrowsException_UpdatesStatusToFailed() {
        MockMultipartFile file = new MockMultipartFile("file", "resume.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "Content".getBytes());

        when(userRepository.findById(10L)).thenReturn(Optional.of(testUser));

        AiCareerAnalysis savedAnalysis = new AiCareerAnalysis();
        savedAnalysis.setId(102L);
        savedAnalysis.setUser(testUser);
        savedAnalysis.setStatus(AnalysisStatus.PROCESSING);

        when(analysisRepository.save(any(AiCareerAnalysis.class))).thenReturn(savedAnalysis);
        when(aiClient.analyzeResume(file)).thenThrow(new AIServiceException("AI_SERVICE_UNAVAILABLE", "Hugging Face Space is unreachable"));

        AIServiceException ex = assertThrows(AIServiceException.class, () -> service.analyzeResume(10L, file));
        assertEquals("AI_SERVICE_UNAVAILABLE", ex.getErrorCode());

        assertEquals(AnalysisStatus.FAILED, savedAnalysis.getStatus());
        verify(analysisRepository, times(2)).save(any(AiCareerAnalysis.class));
    }

    @Test
    void getAnalysisHistory_ReturnsSummaries() {
        AiCareerAnalysis entity = new AiCareerAnalysis();
        entity.setId(201L);
        entity.setUser(testUser);
        entity.setOriginalFileName("my_cv.pdf");
        entity.setStatus(AnalysisStatus.COMPLETED);
        entity.setResumeData("{\"skills\":[\"Java\",\"Python\"]}");

        when(analysisRepository.findByUserIdOrderByCreatedAtDesc(10L)).thenReturn(List.of(entity));

        List<AiAnalysisSummaryDto> history = service.getAnalysisHistory(10L);

        assertEquals(1, history.size());
        assertEquals(201L, history.get(0).getAnalysisId());
        assertEquals("my_cv.pdf", history.get(0).getOriginalFileName());
        assertEquals(2, history.get(0).getSkillCount());
    }

    @Test
    void getFullAnalysis_OwnedByDifferentUser_ThrowsUnauthorized() {
        User otherUser = new User();
        org.springframework.test.util.ReflectionTestUtils.setField(otherUser, "id", 999L);

        AiCareerAnalysis entity = new AiCareerAnalysis();
        entity.setId(301L);
        entity.setUser(otherUser);

        when(analysisRepository.findById(301L)).thenReturn(Optional.of(entity));

        assertThrows(UnauthorizedAccessException.class, () -> service.getFullAnalysis(10L, 301L));
    }

    @Test
    void deleteAnalysis_Success() {
        AiCareerAnalysis entity = new AiCareerAnalysis();
        entity.setId(401L);
        entity.setUser(testUser);

        when(analysisRepository.findById(401L)).thenReturn(Optional.of(entity));

        service.deleteAnalysis(10L, 401L);

        verify(analysisRepository).delete(entity);
    }
}
