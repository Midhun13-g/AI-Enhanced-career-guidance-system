package com.careerguidance.entity;
import jakarta.persistence.*; import java.time.LocalDateTime;
@Entity @Table(name="resume_feedback") public class ResumeFeedback {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="resume_id",nullable=false) private Resume resume;
 @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="mentor_id",nullable=false) private Mentor mentor;
 @Column(nullable=false,length=3000) private String feedback; @Column(updatable=false,nullable=false) private LocalDateTime createdAt;
 @PrePersist void create(){createdAt=LocalDateTime.now();} public void setResume(Resume v){resume=v;} public void setMentor(Mentor v){mentor=v;} public void setFeedback(String v){feedback=v;}
}
