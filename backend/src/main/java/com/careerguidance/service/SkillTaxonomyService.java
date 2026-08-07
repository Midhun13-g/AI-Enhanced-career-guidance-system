package com.careerguidance.service;

import com.careerguidance.dto.request.SkillTaxonomyRequest;
import com.careerguidance.dto.response.SkillTaxonomyResponse;
import com.careerguidance.entity.SkillTaxonomy;
import com.careerguidance.entity.StudentSkill;
import com.careerguidance.entity.User;
import com.careerguidance.exception.ResourceNotFoundException;
import com.careerguidance.repository.SkillTaxonomyRepository;
import com.careerguidance.repository.StudentSkillRepository;
import com.careerguidance.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SkillTaxonomyService {

    private final SkillTaxonomyRepository taxonomyRepo;
    private final StudentSkillRepository studentSkillRepo;
    private final UserRepository userRepo;

    public SkillTaxonomyService(SkillTaxonomyRepository taxonomyRepo,
                                StudentSkillRepository studentSkillRepo,
                                UserRepository userRepo) {
        this.taxonomyRepo = taxonomyRepo;
        this.studentSkillRepo = studentSkillRepo;
        this.userRepo = userRepo;
    }

    /** Finds or creates a taxonomy entry for the given raw skill name. */
    @Transactional
    public SkillTaxonomy normalizeSkill(String rawSkillName) {
        return taxonomyRepo.findBySkillNameIgnoreCase(rawSkillName.trim())
                .orElseGet(() -> {
                    SkillTaxonomy entry = new SkillTaxonomy();
                    entry.setSkillName(rawSkillName.trim());
                    entry.setNormalizedName(rawSkillName.trim());
                    entry.setCategory("General");
                    return taxonomyRepo.save(entry);
                });
    }

    /** Replaces all RESUME-sourced student skills with the newly extracted set. */
    @Transactional
    public void upsertStudentSkills(Long studentId, List<String> rawSkillNames, String source) {
        User student = userRepo.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + studentId));
        studentSkillRepo.deleteByStudentIdAndSource(studentId, source);
        rawSkillNames.stream()
                .filter(s -> s != null && !s.isBlank())
                .distinct()
                .forEach(raw -> {
                    SkillTaxonomy taxonomy = normalizeSkill(raw);
                    StudentSkill ss = new StudentSkill();
                    ss.setStudent(student);
                    ss.setSkill(taxonomy);
                    ss.setSource(source);
                    ss.setConfidence(0.85);
                    studentSkillRepo.save(ss);
                });
    }

    public List<SkillTaxonomyResponse> getAll() {
        return taxonomyRepo.findAll().stream().map(this::toResponse).toList();
    }

    public List<SkillTaxonomyResponse> search(String keyword) {
        return taxonomyRepo.searchByKeyword(keyword).stream().map(this::toResponse).toList();
    }

    @Transactional
    public SkillTaxonomyResponse create(SkillTaxonomyRequest req) {
        SkillTaxonomy entry = new SkillTaxonomy();
        entry.setSkillName(req.getSkillName());
        entry.setNormalizedName(req.getNormalizedName());
        entry.setCategory(req.getCategory());
        entry.setDescription(req.getDescription());
        return toResponse(taxonomyRepo.save(entry));
    }

    @Transactional
    public SkillTaxonomyResponse update(Long id, SkillTaxonomyRequest req) {
        SkillTaxonomy entry = taxonomyRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found: " + id));
        entry.setSkillName(req.getSkillName());
        entry.setNormalizedName(req.getNormalizedName());
        entry.setCategory(req.getCategory());
        entry.setDescription(req.getDescription());
        return toResponse(taxonomyRepo.save(entry));
    }

    @Transactional
    public void delete(Long id) {
        if (!taxonomyRepo.existsById(id)) throw new ResourceNotFoundException("Skill not found: " + id);
        taxonomyRepo.deleteById(id);
    }

    private SkillTaxonomyResponse toResponse(SkillTaxonomy s) {
        SkillTaxonomyResponse r = new SkillTaxonomyResponse();
        r.setId(s.getId());
        r.setSkillName(s.getSkillName());
        r.setNormalizedName(s.getNormalizedName());
        r.setCategory(s.getCategory());
        r.setDescription(s.getDescription());
        r.setCreatedAt(s.getCreatedAt());
        return r;
    }
}
