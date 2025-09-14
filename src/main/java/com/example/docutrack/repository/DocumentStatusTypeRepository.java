package com.example.docutrack.repository;

import com.example.docutrack.types.entities.DocumentStatusType;
import com.example.docutrack.types.enums.EStatus;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentStatusTypeRepository extends JpaRepository<DocumentStatusType, Integer> {
    Optional<DocumentStatusType> findByName(EStatus name);
}
