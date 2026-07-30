package com.careerguidance.entity;
import com.careerguidance.constant.ResumeStatus;
import com.careerguidance.constant.ResumeReviewStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity @Table(name = "resumes")
public class Resume {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id", nullable = false) private User user;
    @Column(name="original_file_name", nullable=false) private String originalFileName;
    @Column(name="stored_file_name", nullable=false, unique=true) private String storedFileName;
    @Column(name="file_type", nullable=false) private String fileType;
    @Column(name="file_size", nullable=false) private Long fileSize;
    @Column(name="file_path", nullable=false) private String filePath;
    @Enumerated(EnumType.STRING) @Column(nullable=false) private ResumeStatus status;
    @Enumerated(EnumType.STRING) @Column(name="review_status", nullable=false) private ResumeReviewStatus reviewStatus = ResumeReviewStatus.PENDING;
    @Column(name="upload_time", nullable=false, updatable=false) private LocalDateTime uploadTime;
    @Column(name="last_updated", nullable=false) private LocalDateTime lastUpdated;
    @PrePersist void create(){
        uploadTime=LocalDateTime.now();
        lastUpdated=uploadTime;
    }
    @PreUpdate void update(){
        lastUpdated=LocalDateTime.now();
    }
    public Long getId(){
        return id;
    }
    public User getUser(){
        return user;
    }
    public void setUser(User v){
        user=v;
    }
    public String getOriginalFileName(){
        return originalFileName;
    }
    public void setOriginalFileName(String v){
        originalFileName=v;
    }
    public String getStoredFileName(){
        return storedFileName;
    }
    public void setStoredFileName(String v){
        storedFileName=v;
    }
    public String getFileType(){
        return fileType;
    }
    public void setFileType(String v){
        fileType=v;
    }
    public Long getFileSize(){
        return fileSize;
    }
    public void setFileSize(Long v){
        fileSize=v;
    }
    public String getFilePath(){
        return filePath;
    }
    public void setFilePath(String v){
        filePath=v;
    }
    public ResumeStatus getStatus(){
        return status;
    }
    public void setStatus(ResumeStatus v){
        status=v;
    }
    public ResumeReviewStatus getReviewStatus(){ return reviewStatus; }
    public void setReviewStatus(ResumeReviewStatus v){ reviewStatus=v; }
    public LocalDateTime getUploadTime(){
        return uploadTime;
    }
    public LocalDateTime getLastUpdated(){
        return lastUpdated;
    }
}
