package com.careerguidance.entity;
import jakarta.persistence.*;
@Entity @Table(name="resume_education") public class ResumeEducation {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="resume_id") private Resume resume;
    private String degree,college,university,cgpa;
    private Integer graduationYear;
    public Long getId(){
        return id;
    }
    public Resume getResume(){
        return resume;
    }
    public void setResume(Resume v){
        resume=v;
    }
    public String getDegree(){
        return degree;
    }
    public void setDegree(String v){
        degree=v;
    }
    public String getCollege(){
        return college;
    }
    public void setCollege(String v){
        college=v;
    }
    public String getUniversity(){
        return university;
    }
    public void setUniversity(String v){
        university=v;
    }
    public String getCgpa(){
        return cgpa;
    }
    public void setCgpa(String v){
        cgpa=v;
    }
    public Integer getGraduationYear(){
        return graduationYear;
    }
    public void setGraduationYear(Integer v){
        graduationYear=v;
    }
}
