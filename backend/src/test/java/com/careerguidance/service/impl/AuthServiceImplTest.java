package com.careerguidance.service.impl;

import com.careerguidance.dto.request.LoginRequest;
import com.careerguidance.dto.request.RegisterRequest;
import com.careerguidance.dto.response.JwtResponse;
import com.careerguidance.dto.response.MessageResponse;
import com.careerguidance.entity.Role;
import com.careerguidance.entity.RoleName;
import com.careerguidance.entity.User;
import com.careerguidance.entity.AccountStatus;
import com.careerguidance.exception.BadRequestException;
import com.careerguidance.exception.UnauthorizedException;
import com.careerguidance.repository.RoleRepository;
import com.careerguidance.repository.UserRepository;
import com.careerguidance.security.JwtUtils;
import com.careerguidance.security.UserDetailsImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.Collections;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private Authentication authentication;

    @Mock
    private SecurityContext securityContext;

    private AuthServiceImpl authService;

    @BeforeEach
    void setUp() {
        authService = new AuthServiceImpl(authenticationManager, userRepository, roleRepository, passwordEncoder,
                jwtUtils);
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void testLoginSuccess() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setEmail("user@example.com");
        request.setPassword("password123");

        User user = new User();
        user.setEmail("user@example.com");
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setAccountStatus(AccountStatus.ACTIVE);

        UserDetailsImpl userDetails = new UserDetailsImpl(1L, "user@example.com", "John", "Doe",
                "encoded", Collections.emptyList());

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(jwtUtils.generateJwtToken(authentication)).thenReturn("jwt_token_123");

        // Act
        JwtResponse response = authService.login(request);

        // Assert
        assertNotNull(response);
        assertEquals("jwt_token_123", response.getToken());
        assertEquals(1L, response.getId());
        assertEquals("user@example.com", response.getEmail());
        assertEquals("John", response.getFirstName());
        assertEquals("Doe", response.getLastName());
        verify(userRepository, times(1)).findByEmail("user@example.com");
        verify(authenticationManager, times(1)).authenticate(any());
    }

    @Test
    void testLoginUserNotFound() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setEmail("nonexistent@example.com");
        request.setPassword("password123");

        when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(UnauthorizedException.class, () -> authService.login(request));
        verify(userRepository, times(1)).findByEmail("nonexistent@example.com");
        verify(authenticationManager, times(0)).authenticate(any());
    }

    @Test
    void testLoginAccountRejected() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setEmail("rejected@example.com");
        request.setPassword("password123");

        User user = new User();
        user.setEmail("rejected@example.com");
        user.setAccountStatus(AccountStatus.REJECTED);

        when(userRepository.findByEmail("rejected@example.com")).thenReturn(Optional.of(user));

        // Act & Assert
        assertThrows(UnauthorizedException.class, () -> authService.login(request));
        verify(authenticationManager, times(0)).authenticate(any());
    }

    @Test
    void testLoginAccountDisabled() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setEmail("disabled@example.com");
        request.setPassword("password123");

        User user = new User();
        user.setEmail("disabled@example.com");
        user.setAccountStatus(AccountStatus.DISABLED);

        when(userRepository.findByEmail("disabled@example.com")).thenReturn(Optional.of(user));

        // Act & Assert
        assertThrows(UnauthorizedException.class, () -> authService.login(request));
        verify(authenticationManager, times(0)).authenticate(any());
    }

    @Test
    void testLoginPendingVerification() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setEmail("pending@example.com");
        request.setPassword("password123");

        User user = new User();
        user.setEmail("pending@example.com");
        user.setFirstName("Jane");
        user.setLastName("Smith");
        user.setAccountStatus(AccountStatus.PENDING_VERIFICATION);

        UserDetailsImpl userDetails = new UserDetailsImpl(2L, "pending@example.com", "Jane", "Smith",
                "encoded", Collections.emptyList());

        when(userRepository.findByEmail("pending@example.com")).thenReturn(Optional.of(user));
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(jwtUtils.generateJwtToken(authentication)).thenReturn("jwt_token_456");

        // Act
        JwtResponse response = authService.login(request);

        // Assert
        assertNotNull(response);
        assertEquals(AccountStatus.PENDING_VERIFICATION, response.getAccountStatus());
        assertEquals("Your mentor account is pending administrator verification.", response.getMessage());
    }

    @Test
    void testRegisterSuccess() {
        // Arrange
        RegisterRequest request = new RegisterRequest();
        request.setFirstName("Alice");
        request.setLastName("Johnson");
        request.setEmail("alice@example.com");
        request.setPassword("securePass123");
        request.setPhone("+1234567890");
        request.setGender("Female");
        request.setDob("1995-05-15");
        request.setEducationLevel("Bachelor");
        request.setCollegeName("State University");
        request.setCgpa(3.8);
        request.setLocation("New York");

        Role studentRole = new Role();
        studentRole.setName(RoleName.STUDENT);

        when(userRepository.existsByEmail("alice@example.com")).thenReturn(false);
        when(roleRepository.findByName(RoleName.STUDENT)).thenReturn(Optional.of(studentRole));
        when(passwordEncoder.encode("securePass123")).thenReturn("encoded_password");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        MessageResponse response = authService.register(request);

        // Assert
        assertNotNull(response);
        assertEquals("User registered successfully", response.getMessage());

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository, times(1)).save(userCaptor.capture());
        User savedUser = userCaptor.getValue();
        assertEquals("Alice", savedUser.getFirstName());
        assertEquals("Johnson", savedUser.getLastName());
        assertEquals("alice@example.com", savedUser.getEmail());
        assertEquals(AccountStatus.ACTIVE, savedUser.getAccountStatus());
        assertEquals("encoded_password", savedUser.getPassword());
    }

    @Test
    void testRegisterEmailAlreadyExists() {
        // Arrange
        RegisterRequest request = new RegisterRequest();
        request.setEmail("existing@example.com");
        request.setFirstName("Bob");
        request.setLastName("Brown");
        request.setPassword("password123");

        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        // Act & Assert
        assertThrows(BadRequestException.class, () -> authService.register(request));
        verify(userRepository, times(0)).save(any());
    }

    @Test
    void testRegisterRoleNotFound() {
        // Arrange
        RegisterRequest request = new RegisterRequest();
        request.setEmail("newuser@example.com");
        request.setFirstName("Charlie");
        request.setLastName("Davis");
        request.setPassword("password123");

        when(userRepository.existsByEmail("newuser@example.com")).thenReturn(false);
        when(roleRepository.findByName(RoleName.STUDENT)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(BadRequestException.class, () -> authService.register(request));
        verify(userRepository, times(0)).save(any());
    }

    @Test
    void testRegisterWithNullDateOfBirth() {
        // Arrange
        RegisterRequest request = new RegisterRequest();
        request.setFirstName("David");
        request.setLastName("Evans");
        request.setEmail("david@example.com");
        request.setPassword("password123");
        request.setDob(null);

        Role studentRole = new Role();
        studentRole.setName(RoleName.STUDENT);

        when(userRepository.existsByEmail("david@example.com")).thenReturn(false);
        when(roleRepository.findByName(RoleName.STUDENT)).thenReturn(Optional.of(studentRole));
        when(passwordEncoder.encode("password123")).thenReturn("encoded_password");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        MessageResponse response = authService.register(request);

        // Assert
        assertNotNull(response);
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository, times(1)).save(userCaptor.capture());
        User savedUser = userCaptor.getValue();
        assertNull(savedUser.getDob());
    }
}
