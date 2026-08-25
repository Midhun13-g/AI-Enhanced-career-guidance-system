package com.careerguidance.service;

import com.careerguidance.config.HuggingFaceProperties;
import com.careerguidance.dto.AIAnalysisResponse;
import com.careerguidance.dto.JobMatchResponse;
import com.careerguidance.exception.AIServiceException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

public class HuggingFaceAIClientTest {

    private RestClient restClient;
    private RestClient.RequestBodyUriSpec requestBodyUriSpec;
    private RestClient.RequestBodySpec requestBodySpec;
    private RestClient.ResponseSpec responseSpec;
    private HuggingFaceProperties properties;
    private HuggingFaceAIClient client;

    @BeforeEach
    void setUp() {
        restClient = mock(RestClient.class);
        requestBodyUriSpec = mock(RestClient.RequestBodyUriSpec.class);
        requestBodySpec = mock(RestClient.RequestBodySpec.class);
        responseSpec = mock(RestClient.ResponseSpec.class);

        properties = new HuggingFaceProperties();
        properties.getSpace().setUrl("https://test-space.hf.space");
        properties.getSpace().setAnalyzeEndpoint("/api/resume/analyze");
        properties.getRetry().setMaxAttempts(2);
        properties.getRetry().setBackoffMs(50);

        client = new HuggingFaceAIClient(restClient, properties);

        when(restClient.post()).thenReturn(requestBodyUriSpec);
        when(requestBodyUriSpec.uri(anyString())).thenReturn(requestBodySpec);
        when(requestBodySpec.contentType(any())).thenReturn(requestBodySpec);
        when(requestBodySpec.body(any(Object.class))).thenReturn(requestBodySpec);
        when(requestBodySpec.retrieve()).thenReturn(responseSpec);
    }

    @Test
    void analyzeResume_Success() {
        MockMultipartFile file = new MockMultipartFile("file", "sample.pdf", "application/pdf", "Valid PDF data".getBytes());

        AIAnalysisResponse expectedResponse = new AIAnalysisResponse();
        expectedResponse.setSuccess(true);
        expectedResponse.setRequestId("test-req-999");
        expectedResponse.setExecutionTime(1.2);
        expectedResponse.setJobMatches(Collections.singletonList(new JobMatchResponse()));

        when(responseSpec.body(AIAnalysisResponse.class)).thenReturn(expectedResponse);

        AIAnalysisResponse response = client.analyzeResume(file);

        assertNotNull(response);
        assertTrue(response.isSuccess());
        assertEquals("test-req-999", response.getRequestId());
    }

    @Test
    void analyzeResume_ResourceAccessException_RetriesAndThrowsTimeout() {
        MockMultipartFile file = new MockMultipartFile("file", "sample.pdf", "application/pdf", "Valid PDF data".getBytes());

        when(responseSpec.body(any(Class.class))).thenThrow(new ResourceAccessException("Connection timed out"));
        when(responseSpec.body(any(org.springframework.core.ParameterizedTypeReference.class))).thenThrow(new ResourceAccessException("Connection timed out"));

        AIServiceException ex = assertThrows(AIServiceException.class, () -> client.analyzeResume(file));
        assertEquals("AI_TIMEOUT", ex.getErrorCode());
        verify(restClient, times(2)).post();
    }
}
