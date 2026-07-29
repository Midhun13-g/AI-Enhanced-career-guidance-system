package com.careerguidance.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity @Table(name="resume_analysis") public class ResumeAnalysis {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @OneToOne(fetch=FetchType.LAZY) @JoinColumn(name="resume_id",nullable=false,unique=true) private Resume resume;
    @Column(name="resume_score") private Double resumeScore;
    @Column(name="ats_score") private Double atsScore;
    @Column(name="skills_detected") private Integer skillsDetected;
    @Column(name="projects_detected") private Integer projectsDetected;
    @Column(name="experience_detected") private Integer experienceDetected;
    @Column(name="education_detected") private Integer educationDetected;
    @Column(name="certification_count") private Integer certificationCount;
    @Column(columnDefinition="TEXT") private String strengths;
    @Column(columnDefinition="TEXT") private String weaknesses;
    @Column(name="missing_information",columnDefinition="TEXT") private String missingInformation;
    @Column(columnDefinition="TEXT") private String recommendations;
    @Column(name="created_at") private LocalDateTime createdAt;
    @PrePersist void create(){
        createdAt=LocalDateTime.now();
    }
    public Long getId(){
        return id;
    }
    public Resume getResume(){
        return resume;
    }
    public void setResume(Resume v){
        resume=v;
    }
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
    public Integer getCertificationCount(){
        return certificationCount;
    }
    public void setCertificationCount(Integer v){
        certificationCount=v;
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
    public String getMissingInformation(){
        return missingInformation;
    }
    public void setMissingInformation(String v){
        missingInformation=v;
    }
    public String getRecommendations(){
        return recommendations;
    }
    public void setRecommendations(String v){
        recommendations=v;
    }
    public LocalDateTime getCreatedAt(){
        return createdAt;
    }
}
