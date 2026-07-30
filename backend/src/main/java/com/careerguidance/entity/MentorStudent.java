package com.careerguidance.entity;
import jakarta.persistence.*; import java.time.LocalDateTime;
@Entity @Table(name="mentor_students", uniqueConstraints=@UniqueConstraint(columnNames={"mentor_id","student_id"})) public class MentorStudent {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="mentor_id",nullable=false) private Mentor mentor;
 @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="student_id",nullable=false) private User student;
 @Column(nullable=false,updatable=false) private LocalDateTime assignedAt;
 @PrePersist void create(){assignedAt=LocalDateTime.now();} public Long getId(){return id;} public Mentor getMentor(){return mentor;} public void setMentor(Mentor v){mentor=v;} public User getStudent(){return student;} public void setStudent(User v){student=v;}
}
