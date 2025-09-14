package com.example.docutrack.config;

import com.example.docutrack.repository.RoleRepository;
import com.example.docutrack.types.entities.Role;
import com.example.docutrack.types.enums.ERole;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RoleInitializer {

    @Bean
    CommandLineRunner initRoles(RoleRepository repository) {
        return args -> {
            for (ERole role : ERole.values()) {
                Role existing = repository.findByName(role).orElse(null);

                if (existing == null) {
                    Role newRole = new Role();
                    newRole.setName(role);
                    repository.save(newRole);
                }
            }
        };
    }
}
