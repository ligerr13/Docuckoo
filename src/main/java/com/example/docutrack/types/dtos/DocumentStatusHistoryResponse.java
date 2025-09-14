package com.example.docutrack.types.dtos;

import java.time.LocalDateTime;

import com.example.docutrack.types.entities.DocumentStatusHistory;
import com.example.docutrack.types.enums.EStatus;

import lombok.Data;

@Data
public class DocumentStatusHistoryResponse {
    private EStatus statusName;
    private LocalDateTime statusChangedAt;
    private String comment;

    public DocumentStatusHistoryResponse(DocumentStatusHistory history) {
        this.statusName = history.getStatusType().getName();
        this.statusChangedAt = history.getStatusChangedAt();
        this.comment = history.getComment();
    }
}
