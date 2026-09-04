package com.careerguidance.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class RoadmapResponse {
    private int phase;
    private String title;
    private String duration;
    @JsonProperty("skills_to_learn")
    private List<String> skillsToLearn;
    @JsonProperty("recommended_courses")
    private List<String> recommendedCourses;
    private List<String> projects;
    @JsonProperty("expected_outcome")
    private String expectedOutcome;

    public int getPhase() { return phase; }
    public void setPhase(int phase) { this.phase = phase; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public List<String> getSkillsToLearn() { return skillsToLearn; }
    public void setSkillsToLearn(List<String> skillsToLearn) { this.skillsToLearn = skillsToLearn; }

    public List<String> getRecommendedCourses() { return recommendedCourses; }
    public void setRecommendedCourses(List<String> recommendedCourses) { this.recommendedCourses = recommendedCourses; }

    public List<String> getProjects() { return projects; }
    public void setProjects(List<String> projects) { this.projects = projects; }

    public String getExpectedOutcome() { return expectedOutcome; }
    public void setExpectedOutcome(String expectedOutcome) { this.expectedOutcome = expectedOutcome; }
}
