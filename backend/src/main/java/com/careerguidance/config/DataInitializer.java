package com.careerguidance.config;

import com.careerguidance.entity.Role;
import com.careerguidance.entity.RoleName;
import com.careerguidance.repository.RoleRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
@org.springframework.core.annotation.Order(1)
public class DataInitializer implements ApplicationRunner {

    private final RoleRepository roleRepository;

    public DataInitializer(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(ApplicationArguments args) {
        for (RoleName name : RoleName.values()) {
            if (roleRepository.findByName(name).isEmpty()) {
                roleRepository.save(new Role(name));
            }
        }
    }
}
