package com.careerguidance.service.impl;
import com.careerguidance.service.ResumeParserService;
import org.springframework.stereotype.Service;
import java.nio.file.Path;
import java.util.List;
@Service public class MockResumeParserService implements ResumeParserService {
    public List<String> extractSkills(Path file){
        return List.of("Communication", "Problem Solving");
    }
    public String generateResumeSummary(Path file){
        return "Resume parsed by the local mock parser.";
    }
}
