package com.careerguidance.controller;

import com.careerguidance.dto.response.DashboardResponse;
import com.careerguidance.entity.RoleName;
import com.careerguidance.repository.AssessmentSessionRepository;
import com.careerguidance.repository.ResumeAnalysisRepository;
import com.careerguidance.repository.ResumeRepository;
import com.careerguidance.repository.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
@PreAuthorize("hasRole('ADMIN')")
public class AdminDashboardController {
    private final UserRepository users;
    private final ResumeRepository resumes;
    private final AssessmentSessionRepository sessions;
    private final ResumeAnalysisRepository analyses;

    public AdminDashboardController(UserRepository users, ResumeRepository resumes,
                                    AssessmentSessionRepository sessions, ResumeAnalysisRepository analyses) {
        this.users = users;
        this.resumes = resumes;
        this.sessions = sessions;
        this.analyses = analyses;
    }

    @GetMapping
    public DashboardResponse dashboard() {
        var allAnalyses = analyses.findAll();
        double averageResumeScore = allAnalyses.stream()
                .mapToDouble(analysis -> analysis.getResumeScore() == null ? 0 : analysis.getResumeScore())
                .average().orElse(0);
        double averageAtsScore = allAnalyses.stream()
                .mapToDouble(analysis -> analysis.getAtsScore() == null ? 0 : analysis.getAtsScore())
                .average().orElse(0);
        long activeUsers = users.findAll().stream().filter(user -> Boolean.TRUE.equals(user.getActive())).count();

        return new DashboardResponse(users.count(), users.countByRoles_Name(RoleName.STUDENT),
                users.countByRoles_Name(RoleName.MENTOR), users.countByRoles_Name(RoleName.ADMIN),
                resumes.count(), sessions.count(), averageResumeScore, averageAtsScore, activeUsers);
    }
}
