package com.careerguidance.entity;
import jakarta.persistence.*;
@Entity @Table(name="resume_experience") public class ResumeExperience {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="resume_id") private Resume resume;
    private String company,designation,duration;
    @Column(columnDefinition="TEXT") private String description;
    public Long getId(){
        return id;
    }
    public Resume getResume(){
        return resume;
    }
    public void setResume(Resume v){
        resume=v;
    }
    public String getCompany(){
        return company;
    }
    public void setCompany(String v){
        company=v;
    }
    public String getDesignation(){
        return designation;
    }
    public void setDesignation(String v){
        designation=v;
    }
    public String getDuration(){
        return duration;
    }
    public void setDuration(String v){
        duration=v;
    }
    public String getDescription(){
        return description;
    }
    public void setDescription(String v){
        description=v;
    }
}
