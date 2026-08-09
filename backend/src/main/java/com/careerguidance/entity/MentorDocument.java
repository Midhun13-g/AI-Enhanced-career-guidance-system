package com.careerguidance.entity;
import jakarta.persistence.*; import java.time.LocalDateTime;
@Entity @Table(name="mentor_documents") public class MentorDocument {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id; @ManyToOne(optional=false) @JoinColumn(name="mentor_id") private MentorProfile mentor; private String documentType; private String fileUrl; @Enumerated(EnumType.STRING) private AccountStatus verificationStatus=AccountStatus.PENDING_VERIFICATION; private LocalDateTime uploadedAt=LocalDateTime.now(),verifiedAt; @ManyToOne @JoinColumn(name="verified_by") private User verifiedBy; @Column(columnDefinition="TEXT") private String remarks;
 public Long getId(){return id;} public void setMentor(MentorProfile v){mentor=v;} public String getDocumentType(){return documentType;} public void setDocumentType(String v){documentType=v;} public String getFileUrl(){return fileUrl;} public void setFileUrl(String v){fileUrl=v;} public void setVerificationStatus(AccountStatus v){verificationStatus=v;} public void setVerifiedAt(LocalDateTime v){verifiedAt=v;} public void setVerifiedBy(User v){verifiedBy=v;} public void setRemarks(String v){remarks=v;}
}
