package com.careerguidance.controller;

import com.careerguidance.constant.AnalysisStatus;
import com.careerguidance.dto.*;
import com.careerguidance.security.UserDetailsImpl;
import com.careerguidance.service.AiCareerAnalysisService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ResumeAnalysisControllerTest {

    @Mock
    private AiCareerAnalysisService analysisService;

    private ResumeAnalysisController controller;
    private UserDetailsImpl testUserDetails;

    @BeforeEach
    void setUp() {
        controller = new ResumeAnalysisController(analysisService);
        testUserDetails = new UserDetailsImpl(10L, "student@example.com", "Jane", "Doe", "pass", List.of());
    }

    @Test
    void analyzeResume_Success() {
        MockMultipartFile file = new MockMultipartFile("file", "resume.pdf", "application/pdf", "Dummy PDF".getBytes());

        AIAnalysisResponse aiResponse = new AIAnalysisResponse();
        aiResponse.setSuccess(true);
        aiResponse.setRequestId("req-123");

        AiAnalysisResultDto resultDto = AiAnalysisResultDto.success(101L, aiResponse);
        when(analysisService.analyzeResume(eq(10L), eq(file))).thenReturn(resultDto);

        ResponseEntity<AiAnalysisResultDto> response = controller.analyzeResume(testUserDetails, file);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isSuccess());
        assertEquals(101L, response.getBody().getAnalysisId());
        assertEquals(AnalysisStatus.COMPLETED, response.getBody().getStatus());
    }

    @Test
    void getAnalysisHistory_Success() {
        AiAnalysisSummaryDto summary = new AiAnalysisSummaryDto();
        summary.setAnalysisId(101L);
        summary.setOriginalFileName("resume.pdf");

        when(analysisService.getAnalysisHistory(10L)).thenReturn(List.of(summary));

        ResponseEntity<List<AiAnalysisSummaryDto>> response = controller.getAnalysisHistory(testUserDetails);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        assertEquals(101L, response.getBody().get(0).getAnalysisId());
    }

    @Test
    void getSkills_Success() {
        when(analysisService.getSkillsBreakdown(10L, 101L)).thenReturn(Map.of("skills", List.of("Java", "Spring Boot")));

        ResponseEntity<Map<String, Object>> response = controller.getSkills(testUserDetails, 101L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().containsKey("skills"));
    }

    @Test
    void getJobMatches_Success() {
        JobMatchResponse job = new JobMatchResponse();
        job.setJobTitle("Software Engineer");
        job.setMatchScore(90.0);

        when(analysisService.getJobMatches(10L, 101L)).thenReturn(List.of(job));

        ResponseEntity<List<JobMatchResponse>> response = controller.getJobMatches(testUserDetails, 101L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        assertEquals("Software Engineer", response.getBody().get(0).getJobTitle());
    }

    @Test
    void deleteAnalysis_Success() {
        doNothing().when(analysisService).deleteAnalysis(10L, 101L);

        controller.deleteAnalysis(testUserDetails, 101L);

        verify(analysisService).deleteAnalysis(10L, 101L);
    }
}
