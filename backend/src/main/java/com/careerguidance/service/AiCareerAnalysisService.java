package com.careerguidance.service;

import com.careerguidance.constant.AnalysisStatus;
import com.careerguidance.dto.*;
import com.careerguidance.entity.AiCareerAnalysis;
import com.careerguidance.entity.User;
import com.careerguidance.exception.AIServiceException;
import com.careerguidance.exception.ResourceNotFoundException;
import com.careerguidance.exception.UnauthorizedAccessException;
import com.careerguidance.repository.AiCareerAnalysisRepository;
import com.careerguidance.repository.UserRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@Service
public class AiCareerAnalysisService {

    private static final Logger logger = LoggerFactory.getLogger(AiCareerAnalysisService.class);
    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList(".pdf", ".docx", ".doc", ".txt");
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    private final HuggingFaceAIClient aiClient;
    private final AiCareerAnalysisRepository analysisRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    public AiCareerAnalysisService(HuggingFaceAIClient aiClient,
                                   AiCareerAnalysisRepository analysisRepository,
                                   UserRepository userRepository,
                                   ObjectMapper objectMapper) {
        this.aiClient = aiClient;
        this.analysisRepository = analysisRepository;
        this.userRepository = userRepository;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public AiAnalysisResultDto analyzeResume(Long userId, MultipartFile file) {
        validateFile(file);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "resume.pdf";
        String fileType = file.getContentType();

        AiCareerAnalysis analysis = new AiCareerAnalysis();
        analysis.setUser(user);
        analysis.setOriginalFileName(originalFilename);
        analysis.setFileType(fileType);
        analysis.setFileSize(file.getSize());
        analysis.setStatus(AnalysisStatus.PROCESSING);
        analysis = analysisRepository.save(analysis);

        Long analysisId = analysis.getId();
        logger.info("Created initial AI analysis record ID {} for user ID {}", analysisId, userId);

        try {
            AIAnalysisResponse aiResponse = aiClient.analyzeResume(file);

            analysis.setStatus(AnalysisStatus.COMPLETED);
            analysis.setHfRequestId(aiResponse.getRequestId());
            analysis.setExecutionTime(aiResponse.getExecutionTime());

            analysis.setResumeData(serializeJson(aiResponse.getResume()));
            analysis.setJobMatches(serializeJson(aiResponse.getJobMatches()));
            analysis.setCareerAnalysis(serializeJson(aiResponse.getCareerAnalysis()));
            analysis.setSkillGaps(serializeJson(aiResponse.getSkillGaps()));
            analysis.setLearningPriorities(serializeJson(aiResponse.getLearningPriorities()));
            analysis.setCourseRecommendations(serializeJson(aiResponse.getCourseRecommendations()));
            analysis.setExplanations(serializeJson(aiResponse.getExplanations()));
            analysis.setCareerGuidance(serializeJson(aiResponse.getCareerGuidance()));
            analysis.setRoadmap(serializeJson(aiResponse.getRoadmap()));
            analysis.setRawAiResponse(aiResponse.getRawAiResponse());

            analysisRepository.save(analysis);
            logger.info("Successfully updated analysis ID {} to COMPLETED", analysisId);

            return AiAnalysisResultDto.success(analysisId, aiResponse);

        } catch (AIServiceException ex) {
            logger.error("AI processing failed for analysis ID {}: {}", analysisId, ex.getMessage());
            analysis.setStatus(AnalysisStatus.FAILED);
            analysis.setErrorMessage(sanitizeErrorMessage(ex.getMessage()));
            analysisRepository.save(analysis);
            throw ex;
        } catch (Exception ex) {
            logger.error("Unexpected failure for analysis ID {}: {}", analysisId, ex.getMessage(), ex);
            analysis.setStatus(AnalysisStatus.FAILED);
            analysis.setErrorMessage("AI analysis failed unexpectedly. Please try again.");
            analysisRepository.save(analysis);
            throw new AIServiceException("AI_SERVICE_ERROR", "AI processing failed. Please try again later.", HttpStatus.INTERNAL_SERVER_ERROR, ex);
        }
    }

    @Transactional(readOnly = true)
    public List<AiAnalysisSummaryDto> getAnalysisHistory(Long userId) {
        List<AiCareerAnalysis> list = analysisRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return list.stream().map(this::toSummaryDto).toList();
    }

    @Transactional(readOnly = true)
    public AiAnalysisResultDto getFullAnalysis(Long userId, Long analysisId) {
        AiCareerAnalysis entity = getOwnedAnalysis(userId, analysisId);
        AIAnalysisResponse data = toAiAnalysisResponse(entity);
        return new AiAnalysisResultDto(
                entity.getStatus() == AnalysisStatus.COMPLETED,
                entity.getId(),
                entity.getStatus(),
                data
        );
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getSkillsBreakdown(Long userId, Long analysisId) {
        AiCareerAnalysis entity = getOwnedAnalysis(userId, analysisId);
        Map<String, Object> resumeData = deserializeJson(entity.getResumeData(), new TypeReference<Map<String, Object>>() {});
        Map<String, Object> result = new LinkedHashMap<>();
        if (resumeData != null) {
            result.put("skills", resumeData.get("skills"));
            result.put("technicalSkills", resumeData.get("technical_skills"));
            result.put("professionalSkills", resumeData.get("professional_skills"));
            result.put("skillCategories", resumeData.get("skill_categories"));
        }
        return result;
    }

    @Transactional(readOnly = true)
    public List<JobMatchResponse> getJobMatches(Long userId, Long analysisId) {
        AiCareerAnalysis entity = getOwnedAnalysis(userId, analysisId);
        List<JobMatchResponse> list = deserializeJson(entity.getJobMatches(), new TypeReference<List<JobMatchResponse>>() {});
        return list != null ? list : Collections.emptyList();
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getSkillGaps(Long userId, Long analysisId) {
        AiCareerAnalysis entity = getOwnedAnalysis(userId, analysisId);
        List<SkillGapResponse> gaps = deserializeJson(entity.getSkillGaps(), new TypeReference<List<SkillGapResponse>>() {});
        List<String> priorities = deserializeJson(entity.getLearningPriorities(), new TypeReference<List<String>>() {});

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("skillGaps", gaps != null ? gaps : Collections.emptyList());
        result.put("learningPriorities", priorities != null ? priorities : Collections.emptyList());
        return result;
    }

    @Transactional(readOnly = true)
    public List<CourseRecommendationResponse> getCourseRecommendations(Long userId, Long analysisId) {
        AiCareerAnalysis entity = getOwnedAnalysis(userId, analysisId);
        List<CourseRecommendationResponse> list = deserializeJson(entity.getCourseRecommendations(), new TypeReference<List<CourseRecommendationResponse>>() {});
        return list != null ? list : Collections.emptyList();
    }

    @Transactional(readOnly = true)
    public List<ExplanationResponse> getExplanations(Long userId, Long analysisId) {
        AiCareerAnalysis entity = getOwnedAnalysis(userId, analysisId);
        List<ExplanationResponse> list = deserializeJson(entity.getExplanations(), new TypeReference<List<ExplanationResponse>>() {});
        return list != null ? list : Collections.emptyList();
    }

    @Transactional(readOnly = true)
    public CareerGuidanceResponse getCareerGuidance(Long userId, Long analysisId) {
        AiCareerAnalysis entity = getOwnedAnalysis(userId, analysisId);
        CareerGuidanceResponse guidance = deserializeJson(entity.getCareerGuidance(), new TypeReference<CareerGuidanceResponse>() {});
        return guidance != null ? guidance : new CareerGuidanceResponse();
    }

    @Transactional(readOnly = true)
    public List<RoadmapResponse> getRoadmap(Long userId, Long analysisId) {
        AiCareerAnalysis entity = getOwnedAnalysis(userId, analysisId);
        List<RoadmapResponse> list = deserializeJson(entity.getRoadmap(), new TypeReference<List<RoadmapResponse>>() {});
        return list != null ? list : Collections.emptyList();
    }

    @Transactional
    public void deleteAnalysis(Long userId, Long analysisId) {
        AiCareerAnalysis entity = getOwnedAnalysis(userId, analysisId);
        analysisRepository.delete(entity);
        logger.info("Deleted AI analysis ID {} for user ID {}", analysisId, userId);
    }

    private AiCareerAnalysis getOwnedAnalysis(Long userId, Long analysisId) {
        AiCareerAnalysis analysis = analysisRepository.findById(analysisId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume analysis not found with ID: " + analysisId));

        if (!analysis.getUser().getId().equals(userId)) {
            throw new UnauthorizedAccessException("You do not have permission to access this analysis");
        }

        return analysis;
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new AIServiceException("INVALID_FILE", "Uploaded resume file cannot be empty.", HttpStatus.BAD_REQUEST);
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new AIServiceException("FILE_TOO_LARGE", "Uploaded file size exceeds maximum limit of 10MB.", HttpStatus.PAYLOAD_TOO_LARGE);
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isBlank()) {
            throw new AIServiceException("INVALID_FILE_NAME", "Uploaded file must have a valid filename.", HttpStatus.BAD_REQUEST);
        }

        String lowerName = originalFilename.toLowerCase();
        boolean validExt = ALLOWED_EXTENSIONS.stream().anyMatch(lowerName::endsWith);
        if (!validExt) {
            throw new AIServiceException("UNSUPPORTED_FORMAT", "Only PDF, DOCX, DOC, and TXT files are supported.", HttpStatus.BAD_REQUEST);
        }
    }

    private AiAnalysisSummaryDto toSummaryDto(AiCareerAnalysis entity) {
        AiAnalysisSummaryDto dto = new AiAnalysisSummaryDto();
        dto.setAnalysisId(entity.getId());
        dto.setOriginalFileName(entity.getOriginalFileName());
        dto.setFileType(entity.getFileType());
        dto.setFileSize(entity.getFileSize());
        dto.setStatus(entity.getStatus());
        dto.setHfRequestId(entity.getHfRequestId());
        dto.setExecutionTime(entity.getExecutionTime());
        dto.setErrorMessage(entity.getErrorMessage());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());

        // Extract top job role and match score if available
        if (entity.getJobMatches() != null && !entity.getJobMatches().isBlank()) {
            List<JobMatchResponse> jobs = deserializeJson(entity.getJobMatches(), new TypeReference<List<JobMatchResponse>>() {});
            if (jobs != null && !jobs.isEmpty()) {
                dto.setTopJobRole(jobs.get(0).getJobTitle());
                dto.setTopMatchScore(jobs.get(0).getMatchScore());
            }
        }

        // Extract skill count if available
        if (entity.getResumeData() != null && !entity.getResumeData().isBlank()) {
            Map<String, Object> resume = deserializeJson(entity.getResumeData(), new TypeReference<Map<String, Object>>() {});
            if (resume != null && resume.get("skills") instanceof List<?> skillList) {
                dto.setSkillCount(skillList.size());
            }
        }

        return dto;
    }

    private AIAnalysisResponse toAiAnalysisResponse(AiCareerAnalysis entity) {
        AIAnalysisResponse resp = new AIAnalysisResponse();
        resp.setSuccess(entity.getStatus() == AnalysisStatus.COMPLETED);
        resp.setRequestId(entity.getHfRequestId());
        resp.setExecutionTime(entity.getExecutionTime() != null ? entity.getExecutionTime() : 0.0);

        if (entity.getResumeData() != null) {
            resp.setResume(deserializeJson(entity.getResumeData(), new TypeReference<Map<String, Object>>() {}));
        }
        if (entity.getJobMatches() != null) {
            resp.setJobMatches(deserializeJson(entity.getJobMatches(), new TypeReference<List<JobMatchResponse>>() {}));
        }
        if (entity.getCareerAnalysis() != null) {
            resp.setCareerAnalysis(deserializeJson(entity.getCareerAnalysis(), new TypeReference<Map<String, Object>>() {}));
        }
        if (entity.getSkillGaps() != null) {
            resp.setSkillGaps(deserializeJson(entity.getSkillGaps(), new TypeReference<List<SkillGapResponse>>() {}));
        }
        if (entity.getLearningPriorities() != null) {
            resp.setLearningPriorities(deserializeJson(entity.getLearningPriorities(), new TypeReference<List<String>>() {}));
        }
        if (entity.getCourseRecommendations() != null) {
            resp.setCourseRecommendations(deserializeJson(entity.getCourseRecommendations(), new TypeReference<List<CourseRecommendationResponse>>() {}));
        }
        if (entity.getExplanations() != null) {
            resp.setExplanations(deserializeJson(entity.getExplanations(), new TypeReference<List<ExplanationResponse>>() {}));
        }
        if (entity.getCareerGuidance() != null) {
            resp.setCareerGuidance(deserializeJson(entity.getCareerGuidance(), new TypeReference<CareerGuidanceResponse>() {}));
        }
        if (entity.getRoadmap() != null) {
            resp.setRoadmap(deserializeJson(entity.getRoadmap(), new TypeReference<List<RoadmapResponse>>() {}));
        }
        resp.setRawAiResponse(entity.getRawAiResponse());

        return resp;
    }

    private String serializeJson(Object obj) {
        if (obj == null) return null;
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (Exception ex) {
            logger.warn("Failed to serialize object to JSON: {}", ex.getMessage());
            return null;
        }
    }

    private <T> T deserializeJson(String json, TypeReference<T> typeRef) {
        if (json == null || json.isBlank()) return null;
        try {
            return objectMapper.readValue(json, typeRef);
        } catch (Exception ex) {
            logger.warn("Failed to deserialize JSON: {}", ex.getMessage());
            return null;
        }
    }

    private String sanitizeErrorMessage(String msg) {
        if (msg == null) return "AI service processing failed.";
        if (msg.contains("hf_") || msg.contains("Bearer") || msg.contains("token")) {
            return "AI service authentication error.";
        }
        return msg;
    }
}
