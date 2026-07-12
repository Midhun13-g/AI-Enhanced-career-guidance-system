package com.careerguidance.service.impl;

import com.careerguidance.dto.request.LoginRequest;
import com.careerguidance.dto.request.RegisterRequest;
import com.careerguidance.dto.response.JwtResponse;
import com.careerguidance.dto.response.MessageResponse;
import com.careerguidance.entity.Role;
import com.careerguidance.entity.RoleName;
import com.careerguidance.entity.User;
import com.careerguidance.exception.BadRequestException;
import com.careerguidance.repository.RoleRepository;
import com.careerguidance.repository.UserRepository;
import com.careerguidance.security.JwtUtils;
import com.careerguidance.security.UserDetailsImpl;
import com.careerguidance.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthServiceImpl(AuthenticationManager authenticationManager, UserRepository userRepository,
                           RoleRepository roleRepository, PasswordEncoder passwordEncoder, JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @Override
    public JwtResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return new JwtResponse(jwt, userDetails.getId(), userDetails.getFirstName(), userDetails.getLastName(),
                userDetails.getEmail(), roles);
    }

    @Override
    public MessageResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already in use");
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setGender(request.getGender());
        user.setDob(request.getDob() != null ? LocalDate.parse(request.getDob()) : null);
        user.setEducationLevel(request.getEducationLevel());
        user.setCollegeName(request.getCollegeName());
        user.setCgpa(request.getCgpa());
        user.setLocation(request.getLocation());

        Role studentRole = roleRepository.findByName(RoleName.STUDENT)
                .orElseThrow(() -> new BadRequestException("Role not found"));
        user.setRoles(Set.of(studentRole));

        userRepository.save(user);
        return new MessageResponse("User registered successfully");
    }
}
