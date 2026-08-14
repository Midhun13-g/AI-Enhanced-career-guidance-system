package com.careerguidance.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.careerguidance.entity.Role;
import com.careerguidance.entity.RoleName;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(RoleName name);
}
