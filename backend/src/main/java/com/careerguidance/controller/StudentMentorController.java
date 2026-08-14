package com.careerguidance.controller;
import com.careerguidance.dto.request.ChooseMentorRequest;
import com.careerguidance.dto.response.MessageResponse;
import com.careerguidance.entity.AccountStatus;
import com.careerguidance.entity.MentorStudent;
import com.careerguidance.exception.BadRequestException;
import com.careerguidance.repository.MentorRepository;
import com.careerguidance.repository.MentorStudentRepository;
import com.careerguidance.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/student/mentor") @PreAuthorize("hasRole('STUDENT')")
public class StudentMentorController {
 private final UserRepository users; private final MentorRepository mentors; private final MentorStudentRepository assignments; private final com.careerguidance.repository.MentorProfileRepository profiles;
 public StudentMentorController(UserRepository u,MentorRepository m,MentorStudentRepository a,com.careerguidance.repository.MentorProfileRepository p){users=u;mentors=m;assignments=a;profiles=p;}
 @GetMapping public java.util.List<com.careerguidance.dto.response.MentorProfileResponse> available(){return profiles.findByVerificationStatus(AccountStatus.VERIFIED).stream().map(p->{var u=p.getUser();return new com.careerguidance.dto.response.MentorProfileResponse(p.getId(),u.getId(),u.getFirstName()+" "+u.getLastName(),u.getEmail(),u.getPhone(),p.getCompany(),p.getJobTitle(),p.getExperienceYears(),p.getExpertise(),p.getBio(),p.getLinkedinUrl(),p.getGithubUrl(),p.getPortfolioUrl(),p.getVerificationStatus(),u.getActive(),u.getCreatedAt(),p.getVerifiedAt(),java.util.List.of());}).toList();}
 @PostMapping public ResponseEntity<MessageResponse> choose(@Valid @RequestBody ChooseMentorRequest request, Authentication auth){var student=users.findByEmail(auth.getName()).orElseThrow();var mentorProfile=profiles.findByUserEmail(request.mentorEmail().trim().toLowerCase()).filter(p->p.getVerificationStatus()==AccountStatus.VERIFIED).orElseThrow(()->new BadRequestException("No verified mentor exists with that Gmail address."));var mentor=mentors.findByUserId(mentorProfile.getUser().getId()).orElseGet(()->{var m=new com.careerguidance.entity.Mentor();m.setUser(mentorProfile.getUser());m.setSpecialization(mentorProfile.getExpertise());m.setDesignation(mentorProfile.getJobTitle());return mentors.save(m);});if(!assignments.existsByMentorIdAndStudentId(mentor.getId(),student.getId())){var link=new MentorStudent();link.setMentor(mentor);link.setStudent(student);assignments.save(link);}return ResponseEntity.ok(new MessageResponse("Mentor selected successfully."));}
}
