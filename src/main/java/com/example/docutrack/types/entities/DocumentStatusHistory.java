package com.example.docutrack.types.entities;

import java.time.LocalDateTime;

import com.example.docutrack.types.enums.EStatus;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "document_status_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DocumentStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id", nullable = false)
    private Document document;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "status_type_id", nullable = false)
    private DocumentStatusType statusType;

    @Column(name = "status_changed_at", nullable = false)
    private LocalDateTime statusChangedAt;

    @Column(name = "comment", nullable = true)
    private String comment;

    @PrePersist
    public void prePersist() {
        this.statusChangedAt = LocalDateTime.now();
    }

    public static boolean isEqual(EStatus a, EStatus b) {
        if (a == null && b == null) return true;
        if (a == null || b == null) return false;

        return a == b;
    }

    public static DocumentStatusHistory fromData(
        Document document,
        DocumentStatusType statusType,
        String comment
    ) {
        return fromData(document, statusType, comment, LocalDateTime.now());
    }

    public static DocumentStatusHistory fromData(
            Document document,
            DocumentStatusType statusType,
            String comment,
            LocalDateTime changedAt
    ) {
        DocumentStatusHistory history = new DocumentStatusHistory();
        
        history.setDocument(document);
        history.setStatusType(statusType);
        history.setStatusChangedAt(changedAt);
        history.setComment(comment);

        return history;
    }


}
