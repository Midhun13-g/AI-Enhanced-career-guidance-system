package com.careerguidance.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AIAnalysisResponse {

    private boolean success = true;

    @JsonProperty("request_id")
    @JsonAlias({"requestId", "request_id"})
    private String requestId;

    @JsonProperty("resume")
    @JsonAlias({"resume", "parsed_resume", "resume_overview"})
    private Map<String, Object> resume;

    @JsonProperty("job_matches")
    @JsonAlias({"job_matches", "jobMatches"})
    private List<JobMatchResponse> jobMatches;

    @JsonProperty("career_analysis")
    @JsonAlias({"career_analysis", "careerAnalysis"})
    private Map<String, Object> careerAnalysis;

    @JsonProperty("skill_gaps")
    @JsonAlias({"skill_gaps", "skillGaps"})
    private List<SkillGapResponse> skillGaps;

    @JsonProperty("learning_priorities")
    @JsonAlias({"learning_priorities", "learningPriorities"})
    private List<String> learningPriorities;

    @JsonProperty("course_recommendations")
    @JsonAlias({"course_recommendations", "courseRecommendations"})
    private List<CourseRecommendationResponse> courseRecommendations;

    @JsonProperty("explanations")
    @JsonAlias({"explanations", "recommendation_explanations"})
    private List<ExplanationResponse> explanations;

    @JsonProperty("career_guidance")
    @JsonAlias({"career_guidance", "careerGuidance"})
    private CareerGuidanceResponse careerGuidance;

    @JsonProperty("roadmap")
    @JsonAlias({"roadmap"})
    private List<RoadmapResponse> roadmap;

    @JsonProperty("execution_time")
    @JsonAlias({"execution_time", "executionTime"})
    private double executionTime;

    @JsonProperty("raw_ai_response")
    @JsonAlias({"raw_ai_response", "rawAiResponse"})
    private String rawAiResponse;

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getRequestId() { return requestId; }
    public void setRequestId(String requestId) { this.requestId = requestId; }

    public Map<String, Object> getResume() { return resume; }
    public void setResume(Map<String, Object> resume) { this.resume = resume; }

    public List<JobMatchResponse> getJobMatches() { return jobMatches; }
    public void setJobMatches(List<JobMatchResponse> jobMatches) { this.jobMatches = jobMatches; }

    public Map<String, Object> getCareerAnalysis() { return careerAnalysis; }
    public void setCareerAnalysis(Map<String, Object> careerAnalysis) { this.careerAnalysis = careerAnalysis; }

    public List<SkillGapResponse> getSkillGaps() { return skillGaps; }
    public void setSkillGaps(List<SkillGapResponse> skillGaps) { this.skillGaps = skillGaps; }

    public List<String> getLearningPriorities() { return learningPriorities; }
    public void setLearningPriorities(List<String> learningPriorities) { this.learningPriorities = learningPriorities; }

    public List<CourseRecommendationResponse> getCourseRecommendations() { return courseRecommendations; }
    public void setCourseRecommendations(List<CourseRecommendationResponse> courseRecommendations) { this.courseRecommendations = courseRecommendations; }

    public List<ExplanationResponse> getExplanations() { return explanations; }
    public void setExplanations(List<ExplanationResponse> explanations) { this.explanations = explanations; }

    public CareerGuidanceResponse getCareerGuidance() { return careerGuidance; }
    public void setCareerGuidance(CareerGuidanceResponse careerGuidance) { this.careerGuidance = careerGuidance; }

    public List<RoadmapResponse> getRoadmap() { return roadmap; }
    public void setRoadmap(List<RoadmapResponse> roadmap) { this.roadmap = roadmap; }

    public double getExecutionTime() { return executionTime; }
    public void setExecutionTime(double executionTime) { this.executionTime = executionTime; }

    public String getRawAiResponse() { return rawAiResponse; }
    public void setRawAiResponse(String rawAiResponse) { this.rawAiResponse = rawAiResponse; }
}
