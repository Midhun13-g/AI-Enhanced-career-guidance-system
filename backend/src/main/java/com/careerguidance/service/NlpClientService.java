package com.careerguidance.service;

import com.careerguidance.dto.nlp.NlpParseRequest;
import com.careerguidance.dto.nlp.NlpParseResponse;
import com.careerguidance.exception.ParsingFailedException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class NlpClientService {

    private final RestClient restClient;

    public NlpClientService(@Value("${nlp.service.url:http://localhost:8000}") String nlpServiceUrl) {
        this.restClient = RestClient.builder().baseUrl(nlpServiceUrl).build();
    }

    public NlpParseResponse parse(String resumeText, String fileName) {
        NlpParseRequest request = new NlpParseRequest(resumeText, fileName);
        try {
            NlpParseResponse response = restClient.post()
                    .uri("/api/nlp/parse")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(NlpParseResponse.class);
            if (response == null) throw new ParsingFailedException("NLP service returned empty response");
            return response;
        } catch (ParsingFailedException e) {
            throw e;
        } catch (Exception e) {
            throw new ParsingFailedException("NLP service unavailable: " + e.getMessage(), e);
        }
    }
}
