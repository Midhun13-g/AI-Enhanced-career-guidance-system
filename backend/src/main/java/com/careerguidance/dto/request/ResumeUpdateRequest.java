package com.careerguidance.dto.request;
import jakarta.validation.constraints.Size;
import java.util.List;
public class ResumeUpdateRequest {
    @Size(max=100) private List<String> skills;
    public List<String> getSkills(){
        return skills;
    }
    public void setSkills(List<String> v){
        skills=v;
    }
}
