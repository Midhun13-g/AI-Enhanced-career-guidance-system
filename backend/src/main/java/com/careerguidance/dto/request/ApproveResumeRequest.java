package com.careerguidance.dto.request; import jakarta.validation.constraints.Size;
public record ApproveResumeRequest(@Size(max=3000) String comment) {}
