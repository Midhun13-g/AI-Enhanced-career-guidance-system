package com.careerguidance.repository;

import com.careerguidance.entity.User;
import com.careerguidance.entity.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Page<User> findByRoles_NameAndEmailContainingIgnoreCase(RoleName name, String email, Pageable pageable);
    Page<User> findByEmailContainingIgnoreCaseOrFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String email, String firstName, String lastName, Pageable pageable);
    long countByRoles_Name(RoleName name);
}
