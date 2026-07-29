package com.careerguidance.entity;
import jakarta.persistence.*;
import java.time.LocalDate;
@Entity @Table(name="resume_certifications") public class ResumeCertification {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="resume_id") private Resume resume;
    private String certificateName,provider;
    private LocalDate completionDate;
    public Long getId(){
        return id;
    }
    public Resume getResume(){
        return resume;
    }
    public void setResume(Resume v){
        resume=v;
    }
    public String getCertificateName(){
        return certificateName;
    }
    public void setCertificateName(String v){
        certificateName=v;
    }
    public String getProvider(){
        return provider;
    }
    public void setProvider(String v){
        provider=v;
    }
    public LocalDate getCompletionDate(){
        return completionDate;
    }
    public void setCompletionDate(LocalDate v){
        completionDate=v;
    }
}
