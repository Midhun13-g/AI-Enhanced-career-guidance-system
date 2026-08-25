package com.careerguidance.service;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.multipart.MultipartFile;

import com.careerguidance.config.HuggingFaceProperties;
import com.careerguidance.dto.AIAnalysisResponse;
import com.careerguidance.dto.CareerGuidanceResponse;
import com.careerguidance.dto.CourseRecommendationResponse;
import com.careerguidance.dto.ExplanationResponse;
import com.careerguidance.dto.JobMatchResponse;
import com.careerguidance.dto.RoadmapResponse;
import com.careerguidance.dto.SkillGapResponse;
import com.careerguidance.exception.AIServiceException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class HuggingFaceAIClient {

    private static final Logger logger = LoggerFactory.getLogger(HuggingFaceAIClient.class);

    private final RestClient restClient;
    private final HuggingFaceProperties hfProperties;
    private final ObjectMapper objectMapper;

    public HuggingFaceAIClient(@Qualifier("huggingFaceRestClient") RestClient restClient,
                               HuggingFaceProperties hfProperties) {
        this(restClient, hfProperties, new ObjectMapper());
    }

    @org.springframework.beans.factory.annotation.Autowired
    public HuggingFaceAIClient(@Qualifier("huggingFaceRestClient") RestClient restClient,
                               HuggingFaceProperties hfProperties,
                               ObjectMapper objectMapper) {
        this.restClient = restClient;
        this.hfProperties = hfProperties;
        this.objectMapper = objectMapper != null ? objectMapper : new ObjectMapper();
    }

    public AIAnalysisResponse analyzeResume(MultipartFile file) {
        String endpoint = hfProperties.getSpace().getAnalyzeEndpoint();
        if (endpoint == null || endpoint.isBlank()) {
            endpoint = "/api/resume/analyze";
        }

        String spaceUrl = hfProperties.getSpace().getUrl();
        logger.info("Forwarding resume '{}' (size: {} bytes) to Hugging Face AI Space at '{}{}'",
                file.getOriginalFilename(), file.getSize(), spaceUrl, endpoint);

        int maxAttempts = Math.max(1, hfProperties.getRetry().getMaxAttempts());
        long baseBackoffMs = Math.max(500, hfProperties.getRetry().getBackoffMs());

        byte[] fileBytes;
        try {
            fileBytes = file.getBytes();
        } catch (IOException ex) {
            logger.error("Failed to read uploaded resume file bytes: {}", ex.getMessage());
            throw new AIServiceException("FILE_READ_ERROR", "Could not read uploaded resume file", ex);
        }

        String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "resume.pdf";
        AIServiceException lastException = null;

        for (int attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                if (attempt > 1) {
                    long backoff = baseBackoffMs * (long) Math.pow(2, attempt - 2);
                    logger.info("Retry attempt {}/{} after backoff of {} ms...", attempt, maxAttempts, backoff);
                    try {
                        Thread.sleep(backoff);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        throw new AIServiceException("AI_SERVICE_ERROR", "Execution was interrupted during retry backoff", ie);
                    }
                }

                // First try direct POST endpoint
                try {
                    ByteArrayResource fileResource = new ByteArrayResource(fileBytes) {
                        @Override
                        public String getFilename() {
                            return originalFilename;
                        }
                    };

                    MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
                    body.add("file", fileResource);

                    AIAnalysisResponse response = restClient.post()
                            .uri(endpoint)
                            .contentType(MediaType.MULTIPART_FORM_DATA)
                            .body(body)
                            .retrieve()
                            .body(AIAnalysisResponse.class);

                    if (response != null && (response.getJobMatches() != null || response.getCareerAnalysis() != null || response.getResume() != null)) {
                        logger.info("Successfully received direct AI response with request_id '{}'", response.getRequestId());
                        return response;
                    }
                } catch (RestClientResponseException ex) {
                    int statusCode = ex.getStatusCode().value();
                    logger.warn("Direct POST to {} returned status {}. Attempting Gradio API fallback flow...", endpoint, statusCode);
                } catch (Exception ex) {
                    logger.warn("Direct POST to {} failed: {}. Attempting Gradio API fallback flow...", endpoint, ex.getMessage());
                }

                // Fallback: Gradio 6 API protocol (/gradio_api/upload -> /gradio_api/call/analyze_resume)
                AIAnalysisResponse gradioResponse = executeGradioApiFlow(fileBytes, originalFilename);
                if (gradioResponse != null) {
                    return gradioResponse;
                }

            } catch (ResourceAccessException ex) {
                logger.warn("Attempt {}/{} failed due to connection error or read timeout: {}", attempt, maxAttempts, ex.getMessage());
                lastException = new AIServiceException("AI_TIMEOUT",
                        "Resume analysis timed out or could not connect to Hugging Face AI service. Please try again.",
                        HttpStatus.REQUEST_TIMEOUT, ex);

                if (attempt == maxAttempts) {
                    throw lastException;
                }
            } catch (AIServiceException ex) {
                throw ex;
            } catch (Exception ex) {
                logger.error("Unexpected error during Hugging Face AI analysis: {}", ex.getMessage(), ex);
                throw new AIServiceException("AI_PROCESSING_ERROR", "An unexpected error occurred during AI analysis", ex);
            }
        }

        if (lastException != null) {
            throw lastException;
        }

        throw new AIServiceException("AI_SERVICE_UNAVAILABLE", "Hugging Face AI service is currently unavailable");
    }

    private AIAnalysisResponse executeGradioApiFlow(byte[] fileBytes, String originalFilename) {
        try {
            logger.info("Executing Gradio API flow: Step 1 - Uploading file to /gradio_api/upload...");
            ByteArrayResource fileResource = new ByteArrayResource(fileBytes) {
                @Override
                public String getFilename() {
                    return originalFilename;
                }
            };

            MultiValueMap<String, Object> uploadBody = new LinkedMultiValueMap<>();
            uploadBody.add("files", fileResource);

            List<String> uploadedPaths = restClient.post()
                    .uri("/gradio_api/upload")
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(uploadBody)
                    .retrieve()
                    .body(new org.springframework.core.ParameterizedTypeReference<List<String>>() {});

            if (uploadedPaths == null || uploadedPaths.isEmpty()) {
                throw new AIServiceException("GRADIO_UPLOAD_FAILED", "Failed to upload file to Gradio API endpoint");
            }

            String remotePath = uploadedPaths.get(0);
            logger.info("Uploaded file to Gradio Space remote path: {}", remotePath);

            logger.info("Executing Gradio API flow: Step 2 - Initiating /gradio_api/call/analyze_resume...");
            Map<String, Object> fileData = new LinkedHashMap<>();
            fileData.put("path", remotePath);
            Map<String, Object> meta = new LinkedHashMap<>();
            meta.put("_type", "gradio.FileData");
            fileData.put("meta", meta);
            fileData.put("orig_name", originalFilename);

            Map<String, Object> payload = new LinkedHashMap<>();
            payload.put("data", Collections.singletonList(fileData));

            Map<String, Object> callResponse = restClient.post()
                    .uri("/gradio_api/call/analyze_resume")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(payload)
                    .retrieve()
                    .body(new org.springframework.core.ParameterizedTypeReference<Map<String, Object>>() {});

            if (callResponse == null || !callResponse.containsKey("event_id")) {
                throw new AIServiceException("GRADIO_CALL_FAILED", "Failed to initiate Gradio analyze_resume execution");
            }

            String eventId = String.valueOf(callResponse.get("event_id"));
            logger.info("Gradio execution event_id: {}. Step 3 - Fetching event result...", eventId);

            byte[] streamBytes = restClient.get()
                    .uri("/gradio_api/call/analyze_resume/" + eventId)
                    .retrieve()
                    .body(byte[].class);

            if (streamBytes == null || streamBytes.length == 0) {
                throw new AIServiceException("GRADIO_STREAM_EMPTY", "Gradio event stream returned empty response");
            }

            String jsonPayload = extractJsonFromSseStream(streamBytes);
            if (jsonPayload == null || jsonPayload.isBlank()) {
                throw new AIServiceException("INVALID_AI_RESPONSE", "Could not parse valid JSON from Gradio AI event stream");
            }

            return parseGradioOutputToResponse(jsonPayload);

        } catch (Exception ex) {
            logger.error("Gradio API flow failed: {}", ex.getMessage(), ex);
            if (ex instanceof AIServiceException aiEx) throw aiEx;
            if (ex instanceof ResourceAccessException rae) {
                throw new AIServiceException("AI_TIMEOUT", "Resume analysis timed out or could not connect to Hugging Face AI service.", HttpStatus.REQUEST_TIMEOUT, rae);
            }
            throw new AIServiceException("AI_SERVICE_ERROR", "Gradio AI analysis failed: " + ex.getMessage(), ex);
        }
    }

    private String extractJsonFromSseStream(byte[] streamBytes) throws IOException {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(new ByteArrayInputStream(streamBytes), StandardCharsets.UTF_8))) {
            String line;
            String lastDataLine = null;
            while ((line = reader.readLine()) != null) {
                if (line.startsWith("data:")) {
                    String dataContent = line.substring(5).trim();
                    if (!dataContent.equals("null") && !dataContent.isBlank()) {
                        lastDataLine = dataContent;
                    }
                }
            }
            return lastDataLine;
        }
    }

    @SuppressWarnings("unchecked")
    private AIAnalysisResponse parseGradioOutputToResponse(String jsonStr) {
        try {
            Object raw = objectMapper.readValue(jsonStr, Object.class);
            Map<String, Object> rootMap = null;

            if (raw instanceof List<?> list && !list.isEmpty()) {
                if (list.get(0) instanceof Map<?, ?> m) {
                    rootMap = (Map<String, Object>) m;
                }
            } else if (raw instanceof Map<?, ?> m) {
                rootMap = (Map<String, Object>) m;
            }

            if (rootMap == null) {
                throw new AIServiceException("INVALID_AI_RESPONSE", "Gradio returned unparseable JSON payload");
            }

            AIAnalysisResponse response = new AIAnalysisResponse();
            response.setSuccess(true);
            response.setRequestId("gradio-" + System.currentTimeMillis());

            Double execTime = rootMap.get("total_execution_seconds") instanceof Number n ? n.doubleValue() : null;
            if (execTime != null) {
                response.setExecutionTime(execTime);
            }

            Map<String, Object> finalResult = rootMap.get("final_result") instanceof Map<?, ?> m ? (Map<String, Object>) m : rootMap;

            // Map resume data
            Map<String, Object> resumeMap = new LinkedHashMap<>();
            if (finalResult.containsKey("step2_resume") && finalResult.get("step2_resume") instanceof Map<?, ?> s2) {
                resumeMap.putAll((Map<String, Object>) s2);
            }
            if (finalResult.containsKey("career_profile") && finalResult.get("career_profile") instanceof Map<?, ?> cp) {
                resumeMap.put("career_profile", cp);
            }
            response.setResume(resumeMap);

            // Map Job Matches
            List<JobMatchResponse> matchesList = new ArrayList<>();
            List<?> rawMatches = null;

            if (finalResult.get("top_5_roles") instanceof List<?> l) {
                rawMatches = l;
            } else if (finalResult.get("job_matches") instanceof List<?> l) {
                rawMatches = l;
            }

            if (rawMatches != null) {
                for (Object item : rawMatches) {
                    if (item instanceof Map<?, ?> rawItemMap) {
                        Map<String, Object> itemMap = (Map<String, Object>) rawItemMap;
                        JobMatchResponse jm = new JobMatchResponse();
                        jm.setRank(itemMap.get("rank") instanceof Number n ? n.intValue() : 1);
                        jm.setJobTitle(String.valueOf(itemMap.getOrDefault("job_title", itemMap.getOrDefault("title", "Career Role"))));
                        jm.setCompany(String.valueOf(itemMap.getOrDefault("company", "Partner Company")));
                        jm.setDomain(String.valueOf(itemMap.getOrDefault("domain", "Software Development")));

                        double score = 0.85;
                        if (itemMap.get("match_percentage") instanceof Number n) {
                            score = n.doubleValue() / (n.doubleValue() > 1 ? 100.0 : 1.0);
                        } else if (itemMap.get("match_score") instanceof Number n) {
                            score = n.doubleValue() / (n.doubleValue() > 1 ? 100.0 : 1.0);
                        }
                        jm.setMatchScore(score);

                        if (itemMap.get("matched_skills") instanceof List<?> mList) {
                            jm.setMatchedSkills((List<String>) mList);
                        }
                        if (itemMap.get("missing_skills") instanceof List<?> msList) {
                            jm.setMissingSkills((List<String>) msList);
                        }
                        matchesList.add(jm);
                    }
                }
            }
            response.setJobMatches(matchesList);

            // Map Skill Gaps
            List<SkillGapResponse> skillGaps = new ArrayList<>();
            List<String> learningPriorities = new ArrayList<>();

            if (finalResult.get("step6_skill_gaps") instanceof Map<?, ?> s6) {
                Map<String, Object> s6Map = (Map<String, Object>) s6;
                if (s6Map.get("missing_skills") instanceof List<?> msList) {
                    for (Object sk : msList) {
                        SkillGapResponse sg = new SkillGapResponse();
                        sg.setSkill(String.valueOf(sk));
                        sg.setPriority("HIGH");
                        sg.setReason("High-priority market requirement identified for your profile");
                        skillGaps.add(sg);
                    }
                }
                if (s6Map.get("learning_priorities") instanceof List<?> lpList) {
                    for (Object lp : lpList) {
                        learningPriorities.add(String.valueOf(lp));
                    }
                }
            }
            response.setSkillGaps(skillGaps);
            response.setLearningPriorities(learningPriorities);

            // Map Career Guidance
            CareerGuidanceResponse guidance = new CareerGuidanceResponse();
            if (finalResult.get("career_profile") instanceof Map<?, ?> cp) {
                Map<String, Object> domainMap = new LinkedHashMap<>();
                domainMap.put("primary_domain", String.valueOf(((Map<?, ?>) cp).get("primary_domain")));
                guidance.setDomainAnalysis(domainMap);
            }
            response.setCareerGuidance(guidance);

            // Map Roadmap
            List<RoadmapResponse> roadmapList = new ArrayList<>();
            List<?> phases = null;

            if (finalResult.get("roadmap_phases") instanceof List<?> l) {
                phases = l;
            } else if (finalResult.get("roadmap") instanceof List<?> l) {
                phases = l;
            }

            if (phases != null) {
                for (Object pObj : phases) {
                    if (pObj instanceof Map<?, ?> rawPMap) {
                        Map<String, Object> pMap = (Map<String, Object>) rawPMap;
                        RoadmapResponse rm = new RoadmapResponse();
                        rm.setPhase(pMap.get("phase") instanceof Number n ? n.intValue() : 1);
                        rm.setTitle(String.valueOf(pMap.getOrDefault("title", "Phase " + rm.getPhase())));
                        if (pMap.get("skills_to_learn") instanceof List<?> sl) {
                            rm.setSkillsToLearn((List<String>) sl);
                        }
                        if (pMap.get("projects") instanceof List<?> proj) {
                            rm.setProjects((List<String>) proj);
                        }
                        roadmapList.add(rm);
                    }
                }
            }
            response.setRoadmap(roadmapList);

            return response;

        } catch (Exception ex) {
            logger.error("Failed to parse Gradio JSON output: {}", ex.getMessage(), ex);
            throw new AIServiceException("PARSE_ERROR", "Failed to parse AI pipeline response", ex);
        }
    }
}
