package com.careerguidance.entity;
import jakarta.persistence.*;
@Entity @Table(name="resume_skills") public class ResumeSkill {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="resume_id",nullable=false) private Resume resume;
    @Column(name="skill_name",nullable=false) private String skillName;
    @Column(name="skill_category") private String skillCategory;
    @Column(name="confidence_score") private Double confidenceScore;
    public Long getId(){
        return id;
    }
    public Resume getResume(){
        return resume;
    }
    public void setResume(Resume v){
        resume=v;
    }
    public String getSkillName(){
        return skillName;
    }
    public void setSkillName(String v){
        skillName=v;
    }
    public String getSkillCategory(){
        return skillCategory;
    }
    public void setSkillCategory(String v){
        skillCategory=v;
    }
    public Double getConfidenceScore(){
        return confidenceScore;
    }
    public void setConfidenceScore(Double v){
        confidenceScore=v;
    }
}
