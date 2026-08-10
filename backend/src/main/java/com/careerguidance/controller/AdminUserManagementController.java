package com.careerguidance.controller;

import com.careerguidance.dto.response.AdminUserResponse;
import com.careerguidance.entity.User;
import com.careerguidance.exception.ResourceNotFoundException;
import com.careerguidance.repository.UserRepository;
import org.springframework.data.domain.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserManagementController {
    private final UserRepository users;
    public AdminUserManagementController(UserRepository users) { this.users = users; }

    @GetMapping
    public Page<AdminUserResponse> all(@RequestParam(defaultValue = "") String search,
                                       @RequestParam(defaultValue = "0") int page,
                                       @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, Math.min(size, 100), Sort.by("createdAt").descending());
        return users.findByEmailContainingIgnoreCaseOrFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(search, search, search, pageable).map(this::out);
    }

    @PatchMapping("/{id}/activate")
    public AdminUserResponse activate(@PathVariable Long id) { return setActive(id, true); }

    @PatchMapping("/{id}/deactivate")
    public AdminUserResponse deactivate(@PathVariable Long id) { return setActive(id, false); }

    private AdminUserResponse setActive(Long id, boolean active) {
        User user = users.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        user.setActive(active);
        return out(users.save(user));
    }

    private AdminUserResponse out(User user) {
        return new AdminUserResponse(user.getId(), user.getFirstName(), user.getLastName(), user.getEmail(), user.getPhone(),
                user.getRoles().stream().map(role -> role.getName().name()).collect(java.util.stream.Collectors.toSet()),
                user.getActive(), user.getAccountStatus().name(), user.getCreatedAt());
    }
}
