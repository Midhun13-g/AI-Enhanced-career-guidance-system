package com.careerguidance.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "attempt_certificates")
public class AttemptCertificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "attempt_id", nullable = false, unique = true)
    private AssessmentAttempt attempt;

    @Column(length = 500)
    private String certificateUrl;

    @Column(nullable = false)
    private LocalDateTime issuedDate;

    @PrePersist
    protected void onCreate() { issuedDate = LocalDateTime.now(); }

    public Long getId() { return id; }
    public AssessmentAttempt getAttempt() { return attempt; }
    public void setAttempt(AssessmentAttempt attempt) { this.attempt = attempt; }
    public String getCertificateUrl() { return certificateUrl; }
    public void setCertificateUrl(String certificateUrl) { this.certificateUrl = certificateUrl; }
    public LocalDateTime getIssuedDate() { return issuedDate; }
}
