package com.example.docutrack.config;

import com.example.docutrack.repository.DocumentStatusTypeRepository;
import com.example.docutrack.types.entities.DocumentStatusType;
import com.example.docutrack.types.enums.EStatus;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class StatusTypeInitializer {

    @Bean
    CommandLineRunner initStatusTypes(DocumentStatusTypeRepository repository) {
        return args -> {
            for (EStatus status : EStatus.values()) {
                DocumentStatusType existing = repository.findByName(status)
                        .orElse(null);

                if (existing == null) {
                    DocumentStatusType newStatusType = new DocumentStatusType();
                    newStatusType.setName(status);
                    repository.save(newStatusType);
                }
            }
        };
    }
}