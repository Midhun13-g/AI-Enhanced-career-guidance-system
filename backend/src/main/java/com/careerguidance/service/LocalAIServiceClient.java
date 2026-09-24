package com.careerguidance.service;

import com.careerguidance.config.AIServiceProperties;
import com.careerguidance.dto.AIAnalysisResponse;
import com.careerguidance.exception.AIServiceException;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

/** Isolates the local FastAPI contract from the remote Gradio contract. */
@Service
public class LocalAIServiceClient {
    private final RestClient restClient;
    private final AIServiceProperties properties;

    public LocalAIServiceClient(@Qualifier("localAiRestClient") RestClient restClient, AIServiceProperties properties) {
        this.restClient = restClient;
        this.properties = properties;
    }

    public AIAnalysisResponse analyzeResume(byte[] bytes, String filename) {
        try {
            ByteArrayResource resource = new ByteArrayResource(bytes) {
                @Override public String getFilename() { return filename; }
            };
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", resource);
            AIAnalysisResponse response = restClient.post().uri(properties.getAnalyzeEndpoint())
                    .contentType(MediaType.MULTIPART_FORM_DATA).body(body).retrieve().body(AIAnalysisResponse.class);
            if (response == null || !response.isSuccess()) {
                throw new AIServiceException("INVALID_RESPONSE", "The local AI service returned an unexpected response.");
            }
            return response;
        } catch (RestClientResponseException ex) {
            throw new AIServiceException("LOCAL_AI_UNAVAILABLE", "The local AI service could not process this resume.", ex);
        } catch (ResourceAccessException ex) {
            throw new AIServiceException("LOCAL_AI_UNAVAILABLE", "The local AI service is unavailable.", ex);
        }
    }
}
