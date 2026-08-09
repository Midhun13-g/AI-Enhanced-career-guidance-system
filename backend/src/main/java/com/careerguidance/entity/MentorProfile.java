package com.careerguidance.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.*;

@Entity @Table(name="mentor_profiles")
public class MentorProfile {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @OneToOne(optional=false) @JoinColumn(name="user_id") private User user;
 @Column(columnDefinition="TEXT") private String bio;
 private Integer experienceYears; private String company; private String jobTitle;
 @Column(columnDefinition="TEXT") private String expertise;
 private String linkedinUrl; private String githubUrl; private String portfolioUrl; private String resumeUrl;
 @Enumerated(EnumType.STRING) private AccountStatus verificationStatus = AccountStatus.PENDING_VERIFICATION;
 private LocalDateTime verifiedAt;
 @ManyToOne @JoinColumn(name="verified_by") private User verifiedBy;
 @OneToMany(mappedBy="mentor", cascade=CascadeType.ALL, orphanRemoval=true) private List<MentorDocument> documents=new ArrayList<>();
 public Long getId(){return id;} public User getUser(){return user;} public void setUser(User v){user=v;} public String getBio(){return bio;} public void setBio(String v){bio=v;} public Integer getExperienceYears(){return experienceYears;} public void setExperienceYears(Integer v){experienceYears=v;} public String getCompany(){return company;} public void setCompany(String v){company=v;} public String getJobTitle(){return jobTitle;} public void setJobTitle(String v){jobTitle=v;} public String getExpertise(){return expertise;} public void setExpertise(String v){expertise=v;} public String getLinkedinUrl(){return linkedinUrl;} public void setLinkedinUrl(String v){linkedinUrl=v;} public String getGithubUrl(){return githubUrl;} public void setGithubUrl(String v){githubUrl=v;} public String getPortfolioUrl(){return portfolioUrl;} public void setPortfolioUrl(String v){portfolioUrl=v;} public String getResumeUrl(){return resumeUrl;} public void setResumeUrl(String v){resumeUrl=v;} public AccountStatus getVerificationStatus(){return verificationStatus;} public void setVerificationStatus(AccountStatus v){verificationStatus=v;} public LocalDateTime getVerifiedAt(){return verifiedAt;} public void setVerifiedAt(LocalDateTime v){verifiedAt=v;} public User getVerifiedBy(){return verifiedBy;} public void setVerifiedBy(User v){verifiedBy=v;} public List<MentorDocument> getDocuments(){return documents;}
}
