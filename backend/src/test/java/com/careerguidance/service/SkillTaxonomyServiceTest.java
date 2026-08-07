package com.careerguidance.service;

import com.careerguidance.dto.request.SkillTaxonomyRequest;
import com.careerguidance.dto.response.SkillTaxonomyResponse;
import com.careerguidance.entity.SkillTaxonomy;
import com.careerguidance.entity.User;
import com.careerguidance.exception.ResourceNotFoundException;
import com.careerguidance.repository.SkillTaxonomyRepository;
import com.careerguidance.repository.StudentSkillRepository;
import com.careerguidance.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SkillTaxonomyServiceTest {

    @Mock SkillTaxonomyRepository taxonomyRepo;
    @Mock StudentSkillRepository studentSkillRepo;
    @Mock UserRepository userRepo;

    @InjectMocks SkillTaxonomyService service;

    private SkillTaxonomy reactSkill;

    @BeforeEach
    void setUp() {
        reactSkill = new SkillTaxonomy();
        reactSkill.setSkillName("ReactJS");
        reactSkill.setNormalizedName("React.js");
        reactSkill.setCategory("Frontend");
    }

    @Test
    void normalizeSkill_existingEntry_returnsExisting() {
        when(taxonomyRepo.findBySkillNameIgnoreCase("ReactJS")).thenReturn(Optional.of(reactSkill));

        SkillTaxonomy result = service.normalizeSkill("ReactJS");

        assertThat(result.getNormalizedName()).isEqualTo("React.js");
        verify(taxonomyRepo, never()).save(any());
    }

    @Test
    void normalizeSkill_unknownSkill_createsNewEntry() {
        when(taxonomyRepo.findBySkillNameIgnoreCase("Rust")).thenReturn(Optional.empty());
        when(taxonomyRepo.save(any())).thenAnswer(inv -> inv.getArgument(0));

        SkillTaxonomy result = service.normalizeSkill("Rust");

        assertThat(result.getSkillName()).isEqualTo("Rust");
        assertThat(result.getNormalizedName()).isEqualTo("Rust");
        verify(taxonomyRepo).save(any());
    }

    @Test
    void upsertStudentSkills_deletesOldAndSavesNew() {
        User student = new User();
        when(userRepo.findById(1L)).thenReturn(Optional.of(student));
        when(taxonomyRepo.findBySkillNameIgnoreCase(anyString())).thenReturn(Optional.of(reactSkill));

        service.upsertStudentSkills(1L, List.of("ReactJS", "Python"), "RESUME");

        verify(studentSkillRepo).deleteByStudentIdAndSource(1L, "RESUME");
        verify(studentSkillRepo, times(2)).save(any());
    }

    @Test
    void upsertStudentSkills_userNotFound_throwsException() {
        when(userRepo.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.upsertStudentSkills(99L, List.of("Java"), "RESUME"))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void create_persistsAndReturnsResponse() {
        SkillTaxonomyRequest req = new SkillTaxonomyRequest();
        req.setSkillName("Kotlin");
        req.setNormalizedName("Kotlin");
        req.setCategory("Language");

        SkillTaxonomy saved = new SkillTaxonomy();
        saved.setSkillName("Kotlin");
        saved.setNormalizedName("Kotlin");
        saved.setCategory("Language");
        when(taxonomyRepo.save(any())).thenReturn(saved);

        SkillTaxonomyResponse response = service.create(req);

        assertThat(response.getSkillName()).isEqualTo("Kotlin");
        assertThat(response.getCategory()).isEqualTo("Language");
    }

    @Test
    void delete_notFound_throwsException() {
        when(taxonomyRepo.existsById(42L)).thenReturn(false);

        assertThatThrownBy(() -> service.delete(42L))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
