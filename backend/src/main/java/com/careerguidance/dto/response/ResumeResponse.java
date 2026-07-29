package com.careerguidance.dto.response;
import java.time.LocalDateTime;
import java.util.List;
public class ResumeResponse {
    private Long resumeId;
    private String fileName,status;
    private LocalDateTime uploadTime;
    private List<String> skills;
    public Long getResumeId(){
        return resumeId;
    }
    public void setResumeId(Long v){
        resumeId=v;
    }
    public String getFileName(){
        return fileName;
    }
    public void setFileName(String v){
        fileName=v;
    }
    public String getStatus(){
        return status;
    }
    public void setStatus(String v){
        status=v;
    }
    public LocalDateTime getUploadTime(){
        return uploadTime;
    }
    public void setUploadTime(LocalDateTime v){
        uploadTime=v;
    }
    public List<String> getSkills(){
        return skills;
    }
    public void setSkills(List<String> v){
        skills=v;
    }
}
