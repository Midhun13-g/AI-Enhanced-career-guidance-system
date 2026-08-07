package com.careerguidance.service;

import com.careerguidance.dto.nlp.NlpParseResponse;
import com.careerguidance.dto.response.ProfileVectorResponse;
import com.careerguidance.entity.StudentProfileVector;
import com.careerguidance.entity.User;
import com.careerguidance.exception.ResourceNotFoundException;
import com.careerguidance.repository.StudentProfileVectorRepository;
import com.careerguidance.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ProfileVectorService {

    private final StudentProfileVectorRepository vectorRepo;
    private final UserRepository userRepo;

    public ProfileVectorService(StudentProfileVectorRepository vectorRepo, UserRepository userRepo) {
        this.vectorRepo = vectorRepo;
        this.userRepo = userRepo;
    }

    @Transactional
    public void updateResumeVector(Long studentId, NlpParseResponse nlp, double resumeScore) {
        User student = userRepo.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + studentId));

        StudentProfileVector vector = vectorRepo.findByStudentId(studentId)
                .orElseGet(() -> { StudentProfileVector v = new StudentProfileVector(); v.setStudent(student); return v; });

        Map<String, Object> resumeVector = buildResumeVector(nlp, resumeScore);
        vector.setResumeVector(resumeVector);
        vector.setOverallVector(mergeOverallVector(vector, resumeVector));
        vectorRepo.save(vector);
    }

    public ProfileVectorResponse getProfileImpact(Long studentId) {
        StudentProfileVector vector = vectorRepo.findByStudentId(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile vector not found for student: " + studentId));
        ProfileVectorResponse r = new ProfileVectorResponse();
        r.setStudentId(studentId);
        r.setResumeVector(vector.getResumeVector());
        r.setOverallVector(vector.getOverallVector());
        r.setUpdatedAt(vector.getUpdatedAt());
        return r;
    }

    private Map<String, Object> buildResumeVector(NlpParseResponse nlp, double resumeScore) {
        Map<String, Object> v = new HashMap<>();
        List<NlpParseResponse.NlpSkill> skills = nlp.getSkills() != null ? nlp.getSkills() : List.of();
        v.put("skill_count", skills.size());
        v.put("avg_skill_confidence", skills.stream()
                .mapToDouble(s -> s.getConfidence() != null ? s.getConfidence() : 0.0)
                .average().orElse(0.0));
        v.put("education_count", nlp.getEducation() != null ? nlp.getEducation().size() : 0);
        v.put("project_count", nlp.getProjects() != null ? nlp.getProjects().size() : 0);
        v.put("certification_count", nlp.getCertifications() != null ? nlp.getCertifications().size() : 0);
        v.put("experience_count", nlp.getExperience() != null ? nlp.getExperience().size() : 0);
        v.put("resume_score", resumeScore);
        return v;
    }

    private Map<String, Object> mergeOverallVector(StudentProfileVector existing, Map<String, Object> resumeVector) {
        Map<String, Object> overall = new HashMap<>();
        if (existing.getOverallVector() != null) overall.putAll(existing.getOverallVector());
        overall.putAll(resumeVector);
        // Weighted blend: resume contributes 40% to overall skill signal
        double resumeScore = ((Number) resumeVector.getOrDefault("resume_score", 0.0)).doubleValue();
        double prevScore = ((Number) overall.getOrDefault("overall_score", resumeScore)).doubleValue();
        overall.put("overall_score", prevScore * 0.6 + resumeScore * 0.4);
        return overall;
    }
}
