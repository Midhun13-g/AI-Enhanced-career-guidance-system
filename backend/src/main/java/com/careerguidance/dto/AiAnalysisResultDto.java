package com.careerguidance.dto;

import com.careerguidance.constant.AnalysisStatus;
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class AiAnalysisResultDto {

    private boolean success;
    private Long analysisId;
    private AnalysisStatus status;
    private String message;
    private AIAnalysisResponse data;

    public AiAnalysisResultDto() {}

    public AiAnalysisResultDto(boolean success, Long analysisId, AnalysisStatus status, AIAnalysisResponse data) {
        this.success = success;
        this.analysisId = analysisId;
        this.status = status;
        this.data = data;
    }

    public static AiAnalysisResultDto success(Long analysisId, AIAnalysisResponse data) {
        return new AiAnalysisResultDto(true, analysisId, AnalysisStatus.COMPLETED, data);
    }

    public static AiAnalysisResultDto failed(Long analysisId, String message) {
        AiAnalysisResultDto dto = new AiAnalysisResultDto(false, analysisId, AnalysisStatus.FAILED, null);
        dto.setMessage(message);
        return dto;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public Long getAnalysisId() {
        return analysisId;
    }

    public void setAnalysisId(Long analysisId) {
        this.analysisId = analysisId;
    }

    public AnalysisStatus getStatus() {
        return status;
    }

    public void setStatus(AnalysisStatus status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public AIAnalysisResponse getData() {
        return data;
    }

    public void setData(AIAnalysisResponse data) {
        this.data = data;
    }
}
