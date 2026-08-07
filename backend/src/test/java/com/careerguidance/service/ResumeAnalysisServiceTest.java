package com.careerguidance.service;

import com.careerguidance.dto.nlp.NlpParseResponse;
import com.careerguidance.dto.response.ResumeAnalysisReportResponse;
import com.careerguidance.entity.Resume;
import com.careerguidance.entity.ResumeAnalysisReport;
import com.careerguidance.exception.ResumeNotFoundException;
import com.careerguidance.repository.ResumeAnalysisReportRepository;
import com.careerguidance.repository.ResumeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ResumeAnalysisServiceTest {

    @Mock ResumeAnalysisReportRepository reportRepo;
    @Mock ResumeRepository resumeRepo;

    @InjectMocks ResumeAnalysisService service;

    private Resume resume;

    @BeforeEach
    void setUp() {
        resume = new Resume();
    }

    @Test
    void generateReport_withRichNlp_producesHighScore() {
        when(resumeRepo.findById(1L)).thenReturn(Optional.of(resume));
        when(reportRepo.findByResumeId(1L)).thenReturn(Optional.empty());
        when(reportRepo.save(any())).thenAnswer(inv -> {
            ResumeAnalysisReport r = inv.getArgument(0);
            r.setResume(resume);
            return r;
        });

        NlpParseResponse nlp = buildRichNlp();
        ResumeAnalysisReport report = service.generateReport(1L, nlp);

        assertThat(report.getOverallScore()).isGreaterThan(50.0);
        assertThat(report.getSkillScore()).isGreaterThan(0.0);
        assertThat(report.getAiFeedback()).isNotBlank();
    }

    @Test
    void generateReport_emptyNlp_givesZeroScores() {
        when(resumeRepo.findById(1L)).thenReturn(Optional.of(resume));
        when(reportRepo.findByResumeId(1L)).thenReturn(Optional.empty());
        when(reportRepo.save(any())).thenAnswer(inv -> {
            ResumeAnalysisReport r = inv.getArgument(0);
            r.setResume(resume);
            return r;
        });

        ResumeAnalysisReport report = service.generateReport(1L, new NlpParseResponse());

        assertThat(report.getSkillScore()).isEqualTo(0.0);
        assertThat(report.getProjectScore()).isEqualTo(0.0);
    }

    @Test
    void generateReport_resumeNotFound_throwsException() {
        when(resumeRepo.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.generateReport(99L, new NlpParseResponse()))
                .isInstanceOf(ResumeNotFoundException.class);
    }

    @Test
    void getReport_notFound_throwsException() {
        when(reportRepo.findByResumeId(5L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.getReport(5L))
                .isInstanceOf(ResumeNotFoundException.class)
                .hasMessageContaining("process the resume first");
    }

    @Test
    void getReport_found_returnsResponse() {
        ResumeAnalysisReport report = new ResumeAnalysisReport();
        report.setResume(resume);
        report.setOverallScore(75.0);
        report.setAtsScore(60.0);
        when(reportRepo.findByResumeId(1L)).thenReturn(Optional.of(report));

        ResumeAnalysisReportResponse response = service.getReport(1L);

        assertThat(response.getOverallScore()).isEqualTo(75.0);
        assertThat(response.getAtsScore()).isEqualTo(60.0);
    }

    private NlpParseResponse buildRichNlp() {
        NlpParseResponse nlp = new NlpParseResponse();

        NlpParseResponse.NlpSkill s1 = new NlpParseResponse.NlpSkill();
        s1.setName("Java"); s1.setConfidence(0.9);
        NlpParseResponse.NlpSkill s2 = new NlpParseResponse.NlpSkill();
        s2.setName("Python"); s2.setConfidence(0.85);
        NlpParseResponse.NlpSkill s3 = new NlpParseResponse.NlpSkill();
        s3.setName("React.js"); s3.setConfidence(0.8);
        nlp.setSkills(List.of(s1, s2, s3));

        NlpParseResponse.NlpEducation edu = new NlpParseResponse.NlpEducation();
        edu.setDegree("B.Tech"); edu.setInstitution("MIT");
        nlp.setEducation(List.of(edu));

        NlpParseResponse.NlpProject proj = new NlpParseResponse.NlpProject();
        proj.setName("Career Guidance System");
        nlp.setProjects(List.of(proj));

        return nlp;
    }
}
