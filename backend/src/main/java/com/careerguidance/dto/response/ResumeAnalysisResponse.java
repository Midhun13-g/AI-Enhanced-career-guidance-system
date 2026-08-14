package com.careerguidance.dto.response;
public class ResumeAnalysisResponse {
    private Double resumeScore,atsScore;
    private Integer skillsDetected,projectsDetected,experienceDetected,educationDetected,certificationsDetected;
    private String strengths,weaknesses,recommendations,missingInformation;
    public Double getResumeScore(){
        return resumeScore;
    }
    public void setResumeScore(Double v){
        resumeScore=v;
    }
    public Double getAtsScore(){
        return atsScore;
    }
    public void setAtsScore(Double v){
        atsScore=v;
    }
    public Integer getSkillsDetected(){
        return skillsDetected;
    }
    public void setSkillsDetected(Integer v){
        skillsDetected=v;
    }
    public Integer getProjectsDetected(){
        return projectsDetected;
    }
    public void setProjectsDetected(Integer v){
        projectsDetected=v;
    }
    public Integer getExperienceDetected(){
        return experienceDetected;
    }
    public void setExperienceDetected(Integer v){
        experienceDetected=v;
    }
    public Integer getEducationDetected(){
        return educationDetected;
    }
    public void setEducationDetected(Integer v){
        educationDetected=v;
    }
    public Integer getCertificationsDetected(){
        return certificationsDetected;
    }
    public void setCertificationsDetected(Integer v){
        certificationsDetected=v;
    }
    public String getStrengths(){
        return strengths;
    }
    public void setStrengths(String v){
        strengths=v;
    }
    public String getWeaknesses(){
        return weaknesses;
    }
    public void setWeaknesses(String v){
        weaknesses=v;
    }
    public String getRecommendations(){
        return recommendations;
    }
    public void setRecommendations(String v){
        recommendations=v;
    }
    public String getMissingInformation(){
        return missingInformation;
    }
    public void setMissingInformation(String v){
        missingInformation=v;
    }
}
