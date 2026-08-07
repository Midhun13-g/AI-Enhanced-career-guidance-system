package com.careerguidance.dto.nlp;

public class NlpParseRequest {
    private String resumeText;
    private String fileName;

    public NlpParseRequest() {}
    public NlpParseRequest(String resumeText, String fileName) {
        this.resumeText = resumeText;
        this.fileName = fileName;
    }

    public String getResumeText() { return resumeText; }
    public void setResumeText(String resumeText) { this.resumeText = resumeText; }
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
}
