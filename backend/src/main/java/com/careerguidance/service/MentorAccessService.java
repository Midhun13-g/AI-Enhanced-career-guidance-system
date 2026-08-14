package com.careerguidance.service;
import com.careerguidance.entity.*; import com.careerguidance.exception.*; import com.careerguidance.repository.*; import org.springframework.security.core.Authentication; import org.springframework.stereotype.Service;
@Service public class MentorAccessService { private final UserRepository users; private final MentorRepository mentors; private final MentorStudentRepository assignments;
 public MentorAccessService(UserRepository u,MentorRepository m,MentorStudentRepository a){users=u;mentors=m;assignments=a;}
 public Mentor current(Authentication auth){ User user=users.findByEmail(auth.getName()).orElseThrow(()->new UnauthorizedException("User not found")); return mentors.findByUserId(user.getId()).orElseThrow(()->new UnauthorizedException("Mentor profile not found")); }
 public void assigned(Mentor mentor,Long studentId){if(!assignments.existsByMentorIdAndStudentId(mentor.getId(),studentId))throw new StudentNotAssignedException();}
}
