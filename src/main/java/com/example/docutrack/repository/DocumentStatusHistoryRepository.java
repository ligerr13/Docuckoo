package com.example.docutrack.repository;

import com.example.docutrack.types.entities.DocumentStatusHistory;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface DocumentStatusHistoryRepository extends JpaRepository<DocumentStatusHistory, Long> {

    Optional<DocumentStatusHistory> findByDocumentId(Integer documentId);

    @Query("""
        SELECT h FROM DocumentStatusHistory h 
        WHERE h.document.id = :documentId 
        ORDER BY h.statusChangedAt DESC
    """)
    Optional<DocumentStatusHistory> findTopByDocumentIdOrderByChangedAtDesc(Integer documentId);

    @Query("""
        SELECT h 
        FROM DocumentStatusHistory h
        WHERE h.document.id = :documentId
        AND h.statusType.name <> com.example.docutrack.types.enums.EStatus.EXPIRED
    """)
    Optional<DocumentStatusHistory> findByDocumentIdAndNotExpired(Integer documentId);

}
