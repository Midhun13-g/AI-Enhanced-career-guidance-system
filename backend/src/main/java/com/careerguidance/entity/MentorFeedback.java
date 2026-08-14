package com.careerguidance.entity;
import jakarta.persistence.*; import java.time.LocalDateTime;
@Entity @Table(name="mentor_feedback") public class MentorFeedback {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="mentor_id",nullable=false) private Mentor mentor;
 @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="student_id",nullable=false) private User student;
 @Column(nullable=false) private String feedbackType; @Column(nullable=false,length=3000) private String feedback;
 @Column(updatable=false,nullable=false) private LocalDateTime createdAt;
 @PrePersist void create(){createdAt=LocalDateTime.now();} public void setMentor(Mentor v){mentor=v;} public void setStudent(User v){student=v;} public void setFeedbackType(String v){feedbackType=v;} public void setFeedback(String v){feedback=v;}
}
