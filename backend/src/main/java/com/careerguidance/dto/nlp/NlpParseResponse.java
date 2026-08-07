package com.careerguidance.dto.nlp;

import java.util.List;
import java.util.Map;

public class NlpParseResponse {
    private List<NlpSkill> skills;
    private List<NlpEducation> education;
    private List<NlpProject> projects;
    private List<NlpCertification> certifications;
    private List<NlpExperience> experience;
    private Double resumeScore;
    private String summary;

    public List<NlpSkill> getSkills() { return skills; }
    public void setSkills(List<NlpSkill> skills) { this.skills = skills; }
    public List<NlpEducation> getEducation() { return education; }
    public void setEducation(List<NlpEducation> education) { this.education = education; }
    public List<NlpProject> getProjects() { return projects; }
    public void setProjects(List<NlpProject> projects) { this.projects = projects; }
    public List<NlpCertification> getCertifications() { return certifications; }
    public void setCertifications(List<NlpCertification> certifications) { this.certifications = certifications; }
    public List<NlpExperience> getExperience() { return experience; }
    public void setExperience(List<NlpExperience> experience) { this.experience = experience; }
    public Double getResumeScore() { return resumeScore; }
    public void setResumeScore(Double resumeScore) { this.resumeScore = resumeScore; }
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public static class NlpSkill {
        private String name;
        private Double confidence;
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public Double getConfidence() { return confidence; }
        public void setConfidence(Double confidence) { this.confidence = confidence; }
    }

    public static class NlpEducation {
        private String degree;
        private String institution;
        private String cgpa;
        private Integer graduationYear;
        public String getDegree() { return degree; }
        public void setDegree(String degree) { this.degree = degree; }
        public String getInstitution() { return institution; }
        public void setInstitution(String institution) { this.institution = institution; }
        public String getCgpa() { return cgpa; }
        public void setCgpa(String cgpa) { this.cgpa = cgpa; }
        public Integer getGraduationYear() { return graduationYear; }
        public void setGraduationYear(Integer graduationYear) { this.graduationYear = graduationYear; }
    }

    public static class NlpProject {
        private String name;
        private String description;
        private List<String> technologies;
        private String duration;
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public List<String> getTechnologies() { return technologies; }
        public void setTechnologies(List<String> technologies) { this.technologies = technologies; }
        public String getDuration() { return duration; }
        public void setDuration(String duration) { this.duration = duration; }
    }

    public static class NlpCertification {
        private String name;
        private String provider;
        private String completionDate;
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getProvider() { return provider; }
        public void setProvider(String provider) { this.provider = provider; }
        public String getCompletionDate() { return completionDate; }
        public void setCompletionDate(String completionDate) { this.completionDate = completionDate; }
    }

    public static class NlpExperience {
        private String company;
        private String designation;
        private String duration;
        private String description;
        public String getCompany() { return company; }
        public void setCompany(String company) { this.company = company; }
        public String getDesignation() { return designation; }
        public void setDesignation(String designation) { this.designation = designation; }
        public String getDuration() { return duration; }
        public void setDuration(String duration) { this.duration = duration; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }
}
