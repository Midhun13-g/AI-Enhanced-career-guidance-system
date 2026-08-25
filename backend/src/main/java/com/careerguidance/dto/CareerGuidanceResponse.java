package com.careerguidance.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import java.util.Map;

public class CareerGuidanceResponse {
    @JsonProperty("recommended_roles")
    private List<Map<String, Object>> recommendedRoles;
    @JsonProperty("domain_analysis")
    private Map<String, Object> domainAnalysis;

    public List<Map<String, Object>> getRecommendedRoles() { return recommendedRoles; }
    public void setRecommendedRoles(List<Map<String, Object>> recommendedRoles) { this.recommendedRoles = recommendedRoles; }

    public Map<String, Object> getDomainAnalysis() { return domainAnalysis; }
    public void setDomainAnalysis(Map<String, Object> domainAnalysis) { this.domainAnalysis = domainAnalysis; }
}
