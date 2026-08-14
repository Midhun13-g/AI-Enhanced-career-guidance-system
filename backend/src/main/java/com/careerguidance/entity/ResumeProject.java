package com.careerguidance.entity;
import jakarta.persistence.*;
@Entity @Table(name="resume_projects") public class ResumeProject {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="resume_id") private Resume resume;
    private String projectName;
    @Column(columnDefinition="TEXT") private String description;
    @Column(columnDefinition="TEXT") private String technologies;
    private String duration;
    public Long getId(){
        return id;
    }
    public Resume getResume(){
        return resume;
    }
    public void setResume(Resume v){
        resume=v;
    }
    public String getProjectName(){
        return projectName;
    }
    public void setProjectName(String v){
        projectName=v;
    }
    public String getDescription(){
        return description;
    }
    public void setDescription(String v){
        description=v;
    }
    public String getTechnologies(){
        return technologies;
    }
    public void setTechnologies(String v){
        technologies=v;
    }
    public String getDuration(){
        return duration;
    }
    public void setDuration(String v){
        duration=v;
    }
}
