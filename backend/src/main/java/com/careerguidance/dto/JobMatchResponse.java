package com.careerguidance.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class JobMatchResponse {
    private int rank;
    @JsonProperty("job_title")
    private String jobTitle;
    private String company;
    private String domain;
    @JsonProperty("match_score")
    private double matchScore;
    @JsonProperty("matched_skills")
    private List<String> matchedSkills;
    @JsonProperty("missing_skills")
    private List<String> missingSkills;
    @JsonProperty("semantic_similarity")
    private double semanticSimilarity;
    @JsonProperty("job_summary")
    private String jobSummary;

    public int getRank() { return rank; }
    public void setRank(int rank) { this.rank = rank; }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getDomain() { return domain; }
    public void setDomain(String domain) { this.domain = domain; }

    public double getMatchScore() { return matchScore; }
    public void setMatchScore(double matchScore) { this.matchScore = matchScore; }

    public List<String> getMatchedSkills() { return matchedSkills; }
    public void setMatchedSkills(List<String> matchedSkills) { this.matchedSkills = matchedSkills; }

    public List<String> getMissingSkills() { return missingSkills; }
    public void setMissingSkills(List<String> missingSkills) { this.missingSkills = missingSkills; }

    public double getSemanticSimilarity() { return semanticSimilarity; }
    public void setSemanticSimilarity(double semanticSimilarity) { this.semanticSimilarity = semanticSimilarity; }

    public String getJobSummary() { return jobSummary; }
    public void setJobSummary(String jobSummary) { this.jobSummary = jobSummary; }
}
