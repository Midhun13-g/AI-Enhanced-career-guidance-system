package com.careerguidance.controller;
import com.careerguidance.dto.request.*; import com.careerguidance.dto.response.*; import com.careerguidance.service.MentorVerificationService; import jakarta.validation.Valid; import org.springframework.http.*; import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api") public class MentorVerificationController {
 private final MentorVerificationService service; public MentorVerificationController(MentorVerificationService s){service=s;}
 @PostMapping("/auth/register/mentor") public ResponseEntity<MessageResponse> register(@Valid @RequestBody MentorRegistrationRequest r){return ResponseEntity.status(HttpStatus.CREATED).body(service.register(r));}
}
