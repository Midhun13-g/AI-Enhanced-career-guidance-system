package com.careerguidance.service;
import com.careerguidance.dto.request.ResumeUpdateRequest;
import com.careerguidance.dto.response.*;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;
import java.util.*;
public interface ResumeService {
    ResumeResponse uploadResume(Long userId, MultipartFile file);
    List<ResumeResponse> getResumeHistory(Long userId);
    ResumeResponse getResume(Long userId,Long id);
    ResumeResponse parseResume(Long userId,Long id);
    ResumeResponse updateResume(Long userId,Long id,ResumeUpdateRequest request);
    ResumeAnalysisResponse getAnalysis(Long userId,Long id);
    Resource downloadResume(Long userId,Long id);
    void deleteResume(Long userId,Long id);
}
