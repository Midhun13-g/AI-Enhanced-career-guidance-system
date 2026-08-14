package com.careerguidance.service;

import com.careerguidance.constant.ResumeStatus;
import com.careerguidance.dto.nlp.NlpParseResponse;
import com.careerguidance.dto.response.ResumeProcessResponse;
import com.careerguidance.entity.Resume;
import com.careerguidance.entity.ResumeAnalysisReport;
import com.careerguidance.entity.User;
import com.careerguidance.exception.ResumeNotFoundException;
import com.careerguidance.exception.UnauthorizedAccessException;
import com.careerguidance.repository.ResumeEntityRepository;
import com.careerguidance.repository.ResumeRepository;
import com.careerguidance.repository.StudentSkillRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.nio.file.Path;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NlpPipelineServiceTest {

    @Mock ResumeRepository resumeRepo;
    @Mock ResumeEntityRepository entityRepo;
    @Mock StudentSkillRepository studentSkillRepo;
    @Mock TextExtractionService textExtractor;
    @Mock NlpClientService nlpClient;
    @Mock SkillTaxonomyService taxonomyService;
    @Mock ResumeAnalysisService analysisService;
    @Mock ProfileVectorService vectorService;

    @InjectMocks NlpPipelineService pipeline;

    private Resume resume;
    private User student;

    @BeforeEach
    void setUp() {
        student = new User();
        // Reflectively set id via a helper — use a real path that exists for the test
        resume = new Resume() {
            @Override public Long getId() { return 1L; }
        };
        resume.setUser(student);
        resume.setFilePath("dummy/path/resume.pdf");
        resume.setOriginalFileName("resume.pdf");
        resume.setStatus(ResumeStatus.UPLOADED);
    }

    @Test
    void process_wrongStudent_throwsUnauthorized() {
        User other = new User();
        resume.setUser(other);
        when(resumeRepo.findById(1L)).thenReturn(Optional.of(resume));

        // student id 99 does not own resume owned by 'other' (id null != 99)
        assertThatThrownBy(() -> pipeline.process(99L, 1L))
                .isInstanceOf(UnauthorizedAccessException.class);
    }

    @Test
    void process_resumeNotFound_throwsException() {
        when(resumeRepo.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> pipeline.process(1L, 99L))
                .isInstanceOf(ResumeNotFoundException.class);
    }

    @Test
    void process_successfulPipeline_returnsCompletedResponse() {
        // student id matches
        User owner = new User();
        resume.setUser(owner);

        when(resumeRepo.findById(1L)).thenReturn(Optional.of(resume));
        when(resumeRepo.save(any())).thenReturn(resume);
        when(textExtractor.extractText(any(Path.class))).thenReturn("Java Python Spring Boot developer with 2 years experience");

        NlpParseResponse nlp = new NlpParseResponse();
        NlpParseResponse.NlpSkill skill = new NlpParseResponse.NlpSkill();
        skill.setName("Java"); skill.setConfidence(0.9);
        nlp.setSkills(List.of(skill));

        when(nlpClient.parse(anyString(), anyString())).thenReturn(nlp);
        when(entityRepo.saveAll(any())).thenReturn(List.of());

        ResumeAnalysisReport report = new ResumeAnalysisReport();
        report.setOverallScore(72.0);
        when(analysisService.generateReport(anyLong(), any())).thenReturn(report);

        ResumeProcessResponse response = pipeline.process(owner.getId(), 1L);

        assertThat(response.getProcessingStatus()).isEqualTo("COMPLETED");
        assertThat(response.getSkillsExtracted()).isEqualTo(1);
        verify(taxonomyService).upsertStudentSkills(any(), eq(List.of("Java")), eq("RESUME"));
        verify(vectorService).updateResumeVector(any(), eq(nlp), eq(72.0));
    }

    @Test
    void process_nlpFails_setsStatusFailed() {
        User owner = new User();
        resume.setUser(owner);

        when(resumeRepo.findById(1L)).thenReturn(Optional.of(resume));
        when(resumeRepo.save(any())).thenReturn(resume);
        when(textExtractor.extractText(any(Path.class))).thenReturn("some text");
        when(nlpClient.parse(anyString(), anyString())).thenThrow(new RuntimeException("NLP down"));

        assertThatThrownBy(() -> pipeline.process(owner.getId(), 1L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("NLP down");

        verify(resumeRepo, atLeastOnce()).save(argThat(r -> r.getStatus() == ResumeStatus.FAILED));
    }
}
