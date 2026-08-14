package com.careerguidance.entity;
import jakarta.persistence.*;
@Entity @Table(name="mentors") public class Mentor {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @OneToOne(fetch=FetchType.LAZY) @JoinColumn(name="user_id",nullable=false,unique=true) private User user;
 private String specialization; private String designation;
 public Long getId(){return id;} public User getUser(){return user;} public void setUser(User v){user=v;}
 public String getSpecialization(){return specialization;} public void setSpecialization(String v){specialization=v;}
 public String getDesignation(){return designation;} public void setDesignation(String v){designation=v;}
}
