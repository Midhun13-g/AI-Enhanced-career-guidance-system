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

                    if (hasMeaningfulAnalysis(response)) {
                        logger.info("Successfully received direct AI response with request_id '{}'", response.getRequestId());
                        return response;
                    }

                    // Check if direct response contains provider error
                    if (response != null && response.getRawAiResponse() != null) {
                        checkAndThrowProviderError(response.getRawAiResponse());
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

            // Read response as bytes first to handle application/octet-stream content type
            byte[] uploadResponseBytes = restClient.post()
                    .uri("/gradio_api/upload")
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(uploadBody)
                    .retrieve()
                    .body(byte[].class);

            if (uploadResponseBytes == null || uploadResponseBytes.length == 0) {
                throw new AIServiceException("GRADIO_UPLOAD_FAILED", "Gradio upload endpoint returned empty response");
            }

            String uploadResponseStr = new String(uploadResponseBytes, StandardCharsets.UTF_8);
            logger.debug("Gradio upload response: {}", uploadResponseStr);

            // Parse the JSON response (Gradio may return application/octet-stream for JSON)
            List<String> uploadedPaths;
            try {
                uploadedPaths = objectMapper.readValue(uploadResponseStr, new TypeReference<List<String>>() {});
            } catch (Exception ex) {
                logger.error("Failed to parse Gradio upload response as JSON: {}", uploadResponseStr);
                // Check if it's an error response
                checkAndThrowProviderError(uploadResponseStr);
                throw new AIServiceException("GRADIO_UPLOAD_FAILED", "Failed to parse upload response: " + ex.getMessage(), ex);
            }

            if (uploadedPaths == null || uploadedPaths.isEmpty()) {
                throw new AIServiceException("GRADIO_UPLOAD_FAILED", "Failed to upload file to Gradio API endpoint - no paths returned");
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

            // Read call response as bytes first to handle application/octet-stream content type
            byte[] callResponseBytes = restClient.post()
                    .uri("/gradio_api/call/analyze_resume")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(payload)
                    .retrieve()
                    .body(byte[].class);

            if (callResponseBytes == null || callResponseBytes.length == 0) {
                throw new AIServiceException("GRADIO_CALL_FAILED", "Gradio call endpoint returned empty response");
            }

            String callResponseStr = new String(callResponseBytes, StandardCharsets.UTF_8);
            logger.debug("Gradio call response: {}", callResponseStr);

            Map<String, Object> callResponse;
            try {
                callResponse = objectMapper.readValue(callResponseStr, new TypeReference<Map<String, Object>>() {});
            } catch (Exception ex) {
                logger.error("Failed to parse Gradio call response as JSON: {}", callResponseStr);
                checkAndThrowProviderError(callResponseStr);
                throw new AIServiceException("GRADIO_CALL_FAILED", "Failed to parse call response: " + ex.getMessage(), ex);
            }

            // Check if call response contains provider error
            if (callResponse != null) {
                checkAndThrowProviderError(callResponse);
            }

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

            String rawStreamResponse = new String(streamBytes, StandardCharsets.UTF_8);
            logger.debug("Raw Gradio SSE stream response: {}", rawStreamResponse);

            // Check for provider errors in raw stream response BEFORE parsing
            String providerError = detectProviderErrorInStream(rawStreamResponse);
            if (providerError != null) {
                logger.error("Hugging Face provider error detected in stream: {}", providerError);
                throw new AIServiceException("AI_QUOTA_EXCEEDED", providerError);
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

    private String detectProviderErrorInStream(String rawStream) {
        if (rawStream == null || rawStream.isBlank()) return null;

        String lower = rawStream.toLowerCase();

        // Check for ZeroGPU quota exceeded
        if (lower.contains("zerogpu") || lower.contains("zero gpu")) {
            if (lower.contains("quota") || lower.contains("exceeded")) {
                // Extract retry time if present
                String retryInfo = extractRetryTime(rawStream);
                String baseMsg = "AI analysis is temporarily unavailable because the Hugging Face ZeroGPU quota has been exceeded.";
                return retryInfo != null ? baseMsg + " Please try again in " + retryInfo + "." : baseMsg;
            }
        }

        // Check for other common provider errors
        if (lower.contains("rate limit") || lower.contains("too many requests")) {
            return "AI provider rate limit exceeded. Please try again later.";
        }

        if (lower.contains("unauthorized") || lower.contains("forbidden") || lower.contains("authentication failed")) {
            return "AI provider authentication failed. Please check service configuration.";
        }

        if (lower.contains("service unavailable") || lower.contains("503") || lower.contains("502")) {
            return "AI provider service is temporarily unavailable. Please try again later.";
        }

        if (lower.contains("timeout") || lower.contains("timed out")) {
            return "AI provider request timed out. Please try again.";
        }

        // Check for generic error patterns in the stream
        if (lower.contains("error") && (lower.contains("quota") || lower.contains("limit") || lower.contains("exceeded"))) {
            return "AI provider returned an error: quota or rate limit exceeded.";
        }

        return null;
    }

    private String extractRetryTime(String text) {
        if (text == null) return null;
        // Match patterns like "Try again in 3:34:23" or "try again in 5 minutes"
        java.util.regex.Matcher matcher = java.util.regex.Pattern.compile("(?i)try again in\\s+([\\d:\\s]+(?:hours?|minutes?|seconds?)?)").matcher(text);
        if (matcher.find()) {
            return matcher.group(1).trim();
        }
        matcher = java.util.regex.Pattern.compile("(?i)retry after\\s+([\\d:\\s]+(?:hours?|minutes?|seconds?)?)").matcher(text);
        if (matcher.find()) {
            return matcher.group(1).trim();
        }
        return null;
    }

@SuppressWarnings("unchecked")
    private AIAnalysisResponse parseGradioOutputToResponse(String jsonStr) {
        try {
            logger.info("==============================\nFULL RAW HUGGING FACE RESPONSE\n==============================\n{}", jsonStr);

            // First, check for Hugging Face / Gradio error responses before parsing
            Map<String, Object> errorCheck = objectMapper.readValue(jsonStr, new TypeReference<Map<String, Object>>() {});
            if (isProviderErrorResponse(errorCheck)) {
                String errorCode = determineErrorCode(errorCheck);
                String errorMessage = extractErrorMessage(errorCheck);
                logger.error("Hugging Face provider returned error: code={}, message={}", errorCode, errorMessage);
                throw new AIServiceException(errorCode, errorMessage);
            }

            Object raw = objectMapper.readValue(jsonStr, Object.class);
            Map<String, Object> rootMap = unwrapGradioPayload(raw);

            if (rootMap == null) {
                throw new AIServiceException("INVALID_AI_RESPONSE", "Gradio returned unparseable JSON payload");
            }

            AIAnalysisResponse response = new AIAnalysisResponse();
            response.setSuccess(true);
            response.setRequestId("gradio-" + System.currentTimeMillis());
            response.setRawAiResponse(jsonStr);

            Double execTime = rootMap.get("total_execution_seconds") instanceof Number n ? n.doubleValue() : null;
            if (execTime != null) {
                response.setExecutionTime(execTime);
            }

            Map<String, Object> finalResult = rootMap.get("final_result") instanceof Map<?, ?> m ? (Map<String, Object>) m : rootMap;

            // Step 9 is role-centric: the actionable skills, courses, and roadmap
            // live on the chosen role rather than at the result root.  Keep this
            // compatibility layer here so the REST response remains stable for the
            // frontend and historical analyses.
            Map<String, Object> selectedRole = getMap(finalResult.get("selected_role"));
            if (selectedRole.isEmpty()) {
                selectedRole = getMap(finalResult.get("default_selected_role"));
            }

            // Map resume data
            Map<String, Object> resumeMap = new LinkedHashMap<>();
            if (finalResult.get("resume") instanceof Map<?, ?> r) {
                resumeMap.putAll((Map<String, Object>) r);
            } else if (finalResult.get("step2_resume") instanceof Map<?, ?> s2) {
                resumeMap.putAll((Map<String, Object>) s2);
            }
            if (finalResult.get("career_profile") instanceof Map<?, ?> cp) {
                resumeMap.put("career_profile", cp);
            }
            if (!resumeMap.containsKey("skills")) {
                List<String> selectedRoleSkills = extractTextList(selectedRole.get("skills_you_have"));
                if (!selectedRoleSkills.isEmpty()) {
                    resumeMap.put("skills", selectedRoleSkills);
                }
            }
            response.setResume(resumeMap);

            // Map Job Matches
            List<JobMatchResponse> matchesList = new ArrayList<>();
            List<?> rawMatches = null;

            if (finalResult.get("job_matches") instanceof List<?> l) {
                rawMatches = l;
            } else if (finalResult.get("top_5_roles") instanceof List<?> l) {
                rawMatches = l;
            }

            if (rawMatches != null) {
                for (Object item : rawMatches) {
                    if (item instanceof Map<?, ?> rawItemMap) {
                        Map<String, Object> itemMap = (Map<String, Object>) rawItemMap;
                        Map<String, Object> job = getMap(itemMap.get("job"));
                        Map<String, Object> source = job.isEmpty() ? itemMap : job;
                        JobMatchResponse jm = new JobMatchResponse();
                        jm.setRank(itemMap.get("rank") instanceof Number n ? n.intValue() : 1);
                        jm.setJobTitle(String.valueOf(source.getOrDefault("job_title", source.getOrDefault("title", "Career Role"))));
                        jm.setCompany(String.valueOf(source.getOrDefault("company", source.getOrDefault("organization", ""))));
                        jm.setDomain(String.valueOf(source.getOrDefault("domain", source.getOrDefault("career_domain", ""))));
                        Map<String, Object> roleExplanation = getMap(itemMap.get("role_explanation"));
                        jm.setJobSummary(String.valueOf(source.getOrDefault("job_summary",
                                source.getOrDefault("summary", roleExplanation.getOrDefault("summary", "")))));

                        double score = 0.0;
                        if (itemMap.get("match_score") instanceof Number n) {
                            score = n.doubleValue() > 1.0 ? n.doubleValue() : n.doubleValue() * 100.0;
                        } else if (source.get("final_role_score") instanceof Number n) {
                            score = n.doubleValue() > 1.0 ? n.doubleValue() : n.doubleValue() * 100.0;
                        } else if (itemMap.get("job_match_score") instanceof Number n) {
                            score = n.doubleValue() > 1.0 ? n.doubleValue() : n.doubleValue() * 100.0;
                        } else if (itemMap.get("match_percentage") instanceof Number n) {
                            score = n.doubleValue() > 1.0 ? n.doubleValue() : n.doubleValue() * 100.0;
                        } else if (itemMap.get("overall_score") instanceof Number n) {
                            score = n.doubleValue() > 1.0 ? n.doubleValue() : n.doubleValue() * 100.0;
                        } else if (itemMap.get("semantic_similarity") instanceof Number n) {
                            score = n.doubleValue() > 1.0 ? n.doubleValue() : n.doubleValue() * 100.0;
                        }
                        jm.setMatchScore(score);

                        if (itemMap.get("semantic_similarity") instanceof Number n) {
                            jm.setSemanticSimilarity(n.doubleValue());
                        } else if (source.get("semantic_similarity") instanceof Number n) {
                            jm.setSemanticSimilarity(n.doubleValue());
                        }

                        Object matchedSkills = itemMap.containsKey("matched_skills") ? itemMap.get("matched_skills") : roleExplanation.get("skills_you_have");
                        if (matchedSkills instanceof List<?> mList) {
                            List<String> list = new ArrayList<>();
                            for (Object o : mList) list.add(String.valueOf(o));
                            jm.setMatchedSkills(list);
                        }
                        Object missingSkills = itemMap.containsKey("missing_skills") ? itemMap.get("missing_skills") : roleExplanation.get("main_skill_gaps");
                        if (missingSkills instanceof List<?> msList) {
                            List<String> list = new ArrayList<>();
                            for (Object o : msList) list.add(String.valueOf(o));
                            jm.setMissingSkills(list);
                        }
                        matchesList.add(jm);
                    }
                }
            }
            // Rank by strongest fit first: match score desc, then matched-skills
            // count desc. A role with 1 matched skill must never outrank a role
            // with 5 matched skills when its score is also lower.
            matchesList.sort((a, b) -> {
                int cmp = Double.compare(b.getMatchScore(), a.getMatchScore());
                if (cmp != 0) return cmp;
                int aMatched = a.getMatchedSkills() != null ? a.getMatchedSkills().size() : 0;
                int bMatched = b.getMatchedSkills() != null ? b.getMatchedSkills().size() : 0;
                return Integer.compare(bMatched, aMatched);
            });
            for (int i = 0; i < matchesList.size(); i++) {
                matchesList.get(i).setRank(i + 1);
            }
            response.setJobMatches(matchesList);

            // Map Skill Gaps
            List<SkillGapResponse> skillGaps = new ArrayList<>();
            List<String> learningPriorities = new ArrayList<>();

            if (finalResult.get("skill_gaps") instanceof List<?> list) {
                for (Object obj : list) {
                    if (obj instanceof Map<?, ?> rawMap) {
                        Map<String, Object> m = (Map<String, Object>) rawMap;
                        SkillGapResponse sg = new SkillGapResponse();
                        sg.setSkill(String.valueOf(m.getOrDefault("skill", "")));
                        sg.setPriority(String.valueOf(m.getOrDefault("priority", "HIGH")));
                        sg.setReason(String.valueOf(m.getOrDefault("reason", "")));
                        skillGaps.add(sg);
                    } else if (obj != null) {
                        SkillGapResponse sg = new SkillGapResponse();
                        sg.setSkill(String.valueOf(obj));
                        sg.setPriority("HIGH");
                        sg.setReason("Target role requirement");
                        skillGaps.add(sg);
                    }
                }
            } else if (finalResult.get("step6_skill_gaps") instanceof Map<?, ?> s6) {
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
            }
            if (skillGaps.isEmpty()) {
                for (Object item : asList(selectedRole.get("skills_to_learn"))) {
                    Map<String, Object> skill = getMap(item);
                    SkillGapResponse sg = new SkillGapResponse();
                    sg.setSkill(skill.isEmpty() ? String.valueOf(item) : String.valueOf(skill.getOrDefault("skill", skill.getOrDefault("canonical_skill", ""))));
                    sg.setPriority(skill.isEmpty() ? "HIGH" : String.valueOf(skill.getOrDefault("priority", "HIGH")));
                    sg.setReason(skill.isEmpty() ? "Target role requirement" : String.valueOf(skill.getOrDefault("reason", skill.getOrDefault("recommended_action", "Target role requirement"))));
                    if (!sg.getSkill().isBlank()) skillGaps.add(sg);
                }
            }

            if (finalResult.get("learning_priorities") instanceof List<?> lpList) {
                for (Object lp : lpList) {
                    learningPriorities.add(String.valueOf(lp));
                }
            }
            if (learningPriorities.isEmpty()) {
                for (Object item : asList(selectedRole.get("skills_to_learn"))) {
                    Map<String, Object> skill = getMap(item);
                    String value = skill.isEmpty() ? String.valueOf(item)
                            : String.valueOf(skill.getOrDefault("skill", skill.getOrDefault("canonical_skill", "")));
                    if (!value.isBlank()) learningPriorities.add(value);
                }
            }
            response.setSkillGaps(skillGaps);
            response.setLearningPriorities(learningPriorities);

            // Map Course Recommendations
            List<CourseRecommendationResponse> coursesList = new ArrayList<>();
            List<?> rawCourses = null;
            if (finalResult.get("course_recommendations") instanceof List<?> l) {
                rawCourses = l;
            } else if (finalResult.get("recommended_courses") instanceof List<?> l) {
                rawCourses = l;
            } else if (selectedRole.get("recommended_courses") instanceof List<?> l) {
                rawCourses = l;
            }

            if (rawCourses != null) {
                for (Object item : rawCourses) {
                    if (item instanceof Map<?, ?> rawMap) {
                        Map<String, Object> cm = (Map<String, Object>) rawMap;
                        Map<String, Object> course = getMap(cm.get("course"));
                        Map<String, Object> source = course.isEmpty() ? cm : course;
                        CourseRecommendationResponse cr = new CourseRecommendationResponse();
                        cr.setCourseName(String.valueOf(source.getOrDefault("course_name", source.getOrDefault("title", source.getOrDefault("name", "")))));
                        cr.setProvider(String.valueOf(source.getOrDefault("provider", source.getOrDefault("platform", ""))));
                        cr.setDomain(String.valueOf(source.getOrDefault("domain", source.getOrDefault("category", ""))));
                        cr.setRecommendationType(String.valueOf(cm.getOrDefault("recommendation_type", source.getOrDefault("recommendation_type", "course"))));
                        cr.setTargetSkill(String.valueOf(cm.getOrDefault("target_skill", cm.getOrDefault("canonical_skill", cm.getOrDefault("skill", source.getOrDefault("target_skill", ""))))));
                        cr.setDifficulty(String.valueOf(source.getOrDefault("difficulty", "")));
                        cr.setDuration(String.valueOf(source.getOrDefault("duration", source.getOrDefault("duration_hours", ""))));
                      
                        cr.setCourseUrl(String.valueOf(source.getOrDefault("course_url",
                                source.getOrDefault("courseUrl", source.getOrDefault("url",
                                        source.getOrDefault("link", source.getOrDefault("course_link",
                                                source.getOrDefault("courseLink",
                                                        cm.getOrDefault("course_url",
                                                                cm.getOrDefault("url",
                                                                        cm.getOrDefault("link", "")))))))))));

                        Map<String, Object> explanation = getMap(cm.get("explanation"));
                        cr.setReason(String.valueOf(cm.getOrDefault("reason", cm.getOrDefault("description",
                                explanation.getOrDefault("why_this_course", explanation.getOrDefault("why_you_need_it", source.getOrDefault("description", "")))))));
                        if (cm.get("recommendation_score") instanceof Number n) {
                            cr.setRecommendationScore(n.doubleValue());
                        } else if (source.get("recommendation_score") instanceof Number n) {
                            cr.setRecommendationScore(n.doubleValue());
                        } else if (source.get("final_score") instanceof Number n) {
                            cr.setRecommendationScore(n.doubleValue());
                        }
                        if (cm.get("semantic_similarity") instanceof Number n) {
                            cr.setSemanticSimilarity(n.doubleValue());
                        } else if (source.get("semantic_similarity") instanceof Number n) {
                            cr.setSemanticSimilarity(n.doubleValue());
                        }
                        coursesList.add(cr);
                    }
                }
            }
            response.setCourseRecommendations(coursesList);

            // Map Explanations
            List<ExplanationResponse> explanationsList = new ArrayList<>();
            if (finalResult.get("explanations") instanceof List<?> l) {
                for (Object item : l) {
                    if (item instanceof Map<?, ?> rawMap) {
                        Map<String, Object> em = (Map<String, Object>) rawMap;
                        ExplanationResponse er = new ExplanationResponse();
                        er.setRecommendation(String.valueOf(em.getOrDefault("recommendation", em.getOrDefault("factor", ""))));
                        er.setHumanReadableExplanation(String.valueOf(em.getOrDefault("human_readable_explanation", em.getOrDefault("explanation", ""))));
                        er.setExplanationType(String.valueOf(em.getOrDefault("explanation_type", em.getOrDefault("type", ""))));
                        if (em.get("feature_contributions") instanceof Map<?, ?> features) {
                            Map<String, Double> contributions = new LinkedHashMap<>();
                            features.forEach((key, value) -> {
                                if (value instanceof Number n) contributions.put(String.valueOf(key), n.doubleValue());
                            });
                            er.setFeatureContributions(contributions);
                        }
                        explanationsList.add(er);
                    }
                }
            }
            if (explanationsList.isEmpty()) {
                for (Object item : asList(selectedRole.get("recommended_courses"))) {
                    Map<String, Object> cm = getMap(item);
                    Map<String, Object> explanation = getMap(cm.get("explanation"));
                    if (explanation.isEmpty()) continue;
                    ExplanationResponse er = new ExplanationResponse();
                    er.setRecommendation(String.valueOf(cm.getOrDefault("canonical_skill", cm.getOrDefault("skill", ""))));
                    er.setHumanReadableExplanation(String.valueOf(explanation.getOrDefault("why_this_course", explanation.getOrDefault("why_you_need_it", explanation.getOrDefault("human_readable_explanation", "")))));
                    er.setExplanationType(String.valueOf(explanation.getOrDefault("explanation_type", explanation.getOrDefault("type", ""))));
                    if (explanation.get("feature_contributions") instanceof Map<?, ?> features) {
                        Map<String, Double> contributions = new LinkedHashMap<>();
                        features.forEach((key, value) -> {
                            if (value instanceof Number n) contributions.put(String.valueOf(key), n.doubleValue());
                        });
                        er.setFeatureContributions(contributions);
                    }
                    explanationsList.add(er);
                }
            }
            response.setExplanations(explanationsList);

            // Map Career Guidance & Analysis
            if (finalResult.get("career_analysis") instanceof Map<?, ?> ca) {
                response.setCareerAnalysis((Map<String, Object>) ca);
            } else if (finalResult.get("career_profile") instanceof Map<?, ?> cp) {
                response.setCareerAnalysis((Map<String, Object>) cp);
            }

            CareerGuidanceResponse guidance = new CareerGuidanceResponse();
            if (finalResult.get("career_guidance") instanceof Map<?, ?> cg) {
                Map<String, Object> cgMap = (Map<String, Object>) cg;
                if (cgMap.get("domain_analysis") instanceof Map<?, ?> da) {
                    guidance.setDomainAnalysis((Map<String, Object>) da);
                }
            } else if (finalResult.get("career_profile") instanceof Map<?, ?> cp) {
                Map<String, Object> domainMap = new LinkedHashMap<>();
                domainMap.put("primary_domain", String.valueOf(((Map<?, ?>) cp).get("primary_domain")));
                guidance.setDomainAnalysis(domainMap);
            }
            if (finalResult.get("role_guidance") instanceof List<?> roles) {
                List<Map<String, Object>> roleList = new ArrayList<>();
                for (Object role : roles) {
                    Map<String, Object> job = getMap(getMap(role).get("job"));
                    if (!job.isEmpty()) roleList.add(job);
                }
                guidance.setRecommendedRoles(roleList);
            }
            response.setCareerGuidance(guidance);

            // Map Roadmap
            List<RoadmapResponse> roadmapList = new ArrayList<>();
            List<?> phases = null;

            if (finalResult.get("roadmap") instanceof List<?> l) {
                phases = l;
            } else if (finalResult.get("roadmap_phases") instanceof List<?> l) {
                phases = l;
            } else if (selectedRole.get("roadmap") instanceof List<?> l) {
                phases = l;
            }

            if (phases != null) {
                for (Object pObj : phases) {
                    if (pObj instanceof Map<?, ?> rawPMap) {
                        Map<String, Object> pMap = (Map<String, Object>) rawPMap;
                        RoadmapResponse rm = new RoadmapResponse();
                        rm.setPhase(pMap.get("phase") instanceof Number n ? n.intValue()
                                : (pMap.get("phase_number") instanceof Number n ? n.intValue() : 1));
                        rm.setTitle(String.valueOf(pMap.getOrDefault("title", pMap.getOrDefault("phase_name", "Phase " + rm.getPhase()))));
                        rm.setDuration(String.valueOf(pMap.getOrDefault("duration", pMap.getOrDefault("estimated_duration", ""))));
                        rm.setExpectedOutcome(String.valueOf(pMap.getOrDefault("expected_outcome", pMap.getOrDefault("expectedOutcome", pMap.getOrDefault("learning_objective", "")))));
                        if (pMap.get("skills_to_learn") instanceof List<?> sl) {
                            List<String> list = new ArrayList<>();
                            for (Object o : sl) list.add(String.valueOf(o));
                            rm.setSkillsToLearn(list);
                        }
                        if (pMap.get("recommended_courses") instanceof List<?> rc) {
                            List<String> list = new ArrayList<>();
                            for (Object o : rc) list.add(String.valueOf(o));
                            rm.setRecommendedCourses(list);
                        }
                        if (pMap.get("projects") instanceof List<?> proj) {
                            List<String> list = new ArrayList<>();
                            for (Object o : proj) list.add(String.valueOf(o));
                            rm.setProjects(list);
                        }
                        roadmapList.add(rm);
                    }
                }
            }
            response.setRoadmap(roadmapList);

            try {
                String parsedJson = objectMapper.writeValueAsString(response);
                logger.info("==============================\nPARSED BACKEND RESPONSE\n==============================\n{}", parsedJson);
            } catch (Exception ignored) {}

            return response;

        } catch (Exception ex) {
            logger.error("Failed to parse Gradio JSON output: {}", ex.getMessage(), ex);
            throw new AIServiceException("PARSE_ERROR", "Failed to parse AI pipeline response", ex);
        }
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> getMap(Object value) {
        return value instanceof Map<?, ?> map
                ? (Map<String, Object>) map
                : Collections.emptyMap();
    }

    /**
     * Gradio's SSE result can be an object, an array, or a JSON string inside
     * data[0].  Step 9 commonly uses the latter.  Normalize those transport
     * wrappers before mapping the actual analysis payload.
     */
    @SuppressWarnings("unchecked")
    private Map<String, Object> unwrapGradioPayload(Object payload) throws IOException {
        Object current = payload;
        for (int depth = 0; depth < 5 && current != null; depth++) {
            if (current instanceof String text) {
                if (text.isBlank()) return null;
                current = objectMapper.readValue(text, Object.class);
                continue;
            }
            if (current instanceof List<?> list) {
                if (list.isEmpty()) return null;
                current = list.get(0);
                continue;
            }
            if (current instanceof Map<?, ?> rawMap) {
                Map<String, Object> map = (Map<String, Object>) rawMap;
                if (map.containsKey("final_result") || map.containsKey("top_5_roles") || map.containsKey("selected_role")) {
                    return map;
                }
                Object data = map.get("data");
                if (data instanceof List<?> dataList && !dataList.isEmpty()) {
                    current = dataList.get(0);
                    continue;
                }
                return map;
            }
            return null;
        }
        return null;
    }

    private boolean hasMeaningfulAnalysis(AIAnalysisResponse response) {
        if (response == null) return false;
        return (response.getJobMatches() != null && !response.getJobMatches().isEmpty())
                || (response.getCareerAnalysis() != null && !response.getCareerAnalysis().isEmpty())
                || (response.getResume() != null && !response.getResume().isEmpty());
    }

    private List<?> asList(Object value) {
        return value instanceof List<?> list ? list : Collections.emptyList();
    }

    private List<String> extractTextList(Object value) {
        List<String> result = new ArrayList<>();
        for (Object item : asList(value)) {
            if (item instanceof String text && !text.isBlank()) {
                result.add(text);
                continue;
            }
            Map<String, Object> map = getMap(item);
            Object text = map.getOrDefault("canonical_skill", map.getOrDefault("skill", map.getOrDefault("name", "")));
            if (text != null && !String.valueOf(text).isBlank()) result.add(String.valueOf(text));
        }
        return result;
    }

    private boolean isProviderErrorResponse(Map<String, Object> response) {
        if (response == null) return false;

        // Check for explicit error field
        if (response.containsKey("error")) {
            return true;
        }

        // Check for Gradio/Hugging Face error structure
        Object title = response.get("title");
        if (title instanceof String titleStr) {
            String lowerTitle = titleStr.toLowerCase();
            if (lowerTitle.contains("quota") || lowerTitle.contains("zero gpu") || lowerTitle.contains("zerogpu")
                    || lowerTitle.contains("rate limit") || lowerTitle.contains("unavailable")
                    || lowerTitle.contains("error") || lowerTitle.contains("failed")) {
                return true;
            }
        }

        // Check for visible error flag with error content
        if (Boolean.TRUE.equals(response.get("visible")) && response.containsKey("error")) {
            return true;
        }

        return false;
    }

    private String determineErrorCode(Map<String, Object> response) {
        if (response == null) return "PROVIDER_ERROR";

        Object title = response.get("title");
        Object error = response.get("error");

        String titleStr = title instanceof String ? ((String) title).toLowerCase() : "";
        String errorStr = error instanceof String ? ((String) error).toLowerCase() : "";

        // ZeroGPU quota exceeded - specific error code for frontend handling
        if (titleStr.contains("zerogpu") || titleStr.contains("zero gpu")
                || errorStr.contains("zerogpu") || errorStr.contains("zero gpu")
                || errorStr.contains("quota")) {
            return "AI_QUOTA_EXCEEDED";
        }

        // Rate limiting
        if (titleStr.contains("rate limit") || errorStr.contains("rate limit")
                || titleStr.contains("too many requests") || errorStr.contains("too many requests")) {
            return "RATE_LIMITED";
        }

        // Authentication/authorization
        if (titleStr.contains("unauthorized") || errorStr.contains("unauthorized")
                || titleStr.contains("forbidden") || errorStr.contains("forbidden")
                || titleStr.contains("authentication") || errorStr.contains("authentication")) {
            return "HF_AUTH_ERROR";
        }

        // Timeout
        if (titleStr.contains("timeout") || errorStr.contains("timeout")
                || titleStr.contains("timed out") || errorStr.contains("timed out")) {
            return "AI_TIMEOUT";
        }

        // Service unavailable
        if (titleStr.contains("unavailable") || errorStr.contains("unavailable")
                || titleStr.contains("service unavailable") || errorStr.contains("service unavailable")
                || titleStr.contains("503") || errorStr.contains("503")
                || titleStr.contains("502") || errorStr.contains("502")) {
            return "AI_SERVICE_UNAVAILABLE";
        }

        // Generic provider error
        return "PROVIDER_ERROR";
    }

    private String extractErrorMessage(Map<String, Object> response) {
        if (response == null) return "AI provider returned an error";

        Object error = response.get("error");
        if (error instanceof String errorStr && !errorStr.isBlank()) {
            return sanitizeProviderErrorMessage(errorStr);
        }

        Object title = response.get("title");
        if (title instanceof String titleStr && !titleStr.isBlank()) {
            return sanitizeProviderErrorMessage(titleStr);
        }

        return "AI analysis failed due to a provider error";
    }

    private String sanitizeProviderErrorMessage(String message) {
        if (message == null) return "AI service processing failed.";
        // Remove any potential sensitive information
        String sanitized = message;
        sanitized = sanitized.replaceAll("(?i)(hf_|bearer|token|api[_-]?key|secret)[\\s:=]+\\S+", "[REDACTED]");
        return sanitized;
    }

    private void checkAndThrowProviderError(String jsonStr) {
        try {
            Map<String, Object> errorCheck = objectMapper.readValue(jsonStr, new TypeReference<Map<String, Object>>() {});
            if (isProviderErrorResponse(errorCheck)) {
                String errorCode = determineErrorCode(errorCheck);
                String errorMessage = extractErrorMessage(errorCheck);
                logger.error("Hugging Face provider returned error: code={}, message={}", errorCode, errorMessage);
                throw new AIServiceException(errorCode, errorMessage);
            }
        } catch (AIServiceException ex) {
            throw ex;
        } catch (Exception ex) {
            logger.warn("Could not parse provider response for error checking: {}", ex.getMessage());
        }
    }

    private void checkAndThrowProviderError(Map<String, Object> response) {
        if (isProviderErrorResponse(response)) {
            String errorCode = determineErrorCode(response);
            String errorMessage = extractErrorMessage(response);
            logger.error("Hugging Face provider returned error: code={}, message={}", errorCode, errorMessage);
            throw new AIServiceException(errorCode, errorMessage);
        }
    }
}
