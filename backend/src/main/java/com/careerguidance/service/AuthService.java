package com.careerguidance.service;

import com.careerguidance.dto.request.LoginRequest;
import com.careerguidance.dto.request.RegisterRequest;
import com.careerguidance.dto.response.JwtResponse;
import com.careerguidance.dto.response.MessageResponse;

public interface AuthService {
    JwtResponse login(LoginRequest request);
    MessageResponse register(RegisterRequest request);
}
