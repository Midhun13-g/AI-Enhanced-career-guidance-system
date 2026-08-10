package com.careerguidance.dto.response;

import java.time.LocalDateTime;
import java.util.Set;

public record AdminUserResponse(Long id, String firstName, String lastName, String email, String phone,
                                Set<String> roles, Boolean active, String accountStatus, LocalDateTime createdAt) {}
