package com.careerguidance.service;
import java.nio.file.Path;
import java.util.List;
/** Adapter boundary for the future Python AI parser. */ public interface ResumeParserService {
    List<String> extractSkills(Path file);
    String generateResumeSummary(Path file);
}
