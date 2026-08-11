package com.careerguidance.service.impl;

import com.careerguidance.dto.request.GroqAssessmentRequest;
import com.careerguidance.dto.response.GroqAssessmentPlanResponse;
import com.careerguidance.service.GroqAssessmentService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@Service
public class GroqAssessmentServiceImpl implements GroqAssessmentService {
    private final ObjectMapper mapper;
    private final String apiKey;
    private final String model;

    public GroqAssessmentServiceImpl(ObjectMapper mapper, @Value("${groq.api-key:}") String apiKey,
                                     @Value("${groq.model:llama-3.1-8b-instant}") String model) {
        this.mapper = mapper;
        this.apiKey = apiKey;
        this.model = model;
    }

    @Override
    public GroqAssessmentPlanResponse createPlan(GroqAssessmentRequest request) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "Groq is not configured. Set GROQ_API_KEY and restart the backend.");
        }
        int questionCount = Math.max(1, Math.min(request.questionCount(), 100));
        String topic = request.topic() == null || request.topic().isBlank() ? "a suitable core topic" : request.topic().trim();
        String prompt = "You design student assessments. Return ONLY valid JSON, with no markdown. " +
                "Create a concise assessment plan for topic '" + topic + "', category '" + request.category() +
                "', difficulty '" + request.difficulty() + "', and " + questionCount + " questions. " +
                "Use exactly these JSON fields: name (string), description (string), skills (array of 3 to 6 strings), " +
                "instructions (string), duration (integer 5 to 180), questionCount (integer), passingMarks (integer 1 to 100), " +
                "suggestedTopics (array of 5 specific topic strings), questions (array of exactly " + questionCount +
                " MCQ objects). Every question object must have questionText (string), options (array of exactly 4 strings), " +
                "correctOptionIndex (integer 0 to 3), and explanation (string).";
        try {
            Map<String, Object> requestBody = Map.of(
                    "model", model,
                    "temperature", 0.4,
                    "messages", List.of(Map.of("role", "user", "content", prompt)),
                    "response_format", Map.of("type", "json_object")
            );
            String raw = RestClient.create("https://api.groq.com/openai/v1")
                    .post().uri("/chat/completions")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve().body(String.class);
            JsonNode root = mapper.readTree(raw);
            String content = root.path("choices").path(0).path("message").path("content").asText();
            GroqAssessmentPlanResponse plan = mapper.readValue(content, GroqAssessmentPlanResponse.class);
            if (plan.questions() == null || plan.questions().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                        "The AI service did not return assessment questions. Please try again.");
            }
            return plan;
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                    "Groq could not generate an assessment plan. Check its API key, model, and account limits.");
        }
    }
}
