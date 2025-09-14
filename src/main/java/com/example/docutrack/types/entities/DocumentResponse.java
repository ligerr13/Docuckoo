package com.example.docutrack.types.entities;

import java.time.LocalDateTime;

import com.example.docutrack.types.dtos.DocumentStatusHistoryResponse;

import lombok.Data;

@Data
public class DocumentResponse {
    private String                  documentTitle;
    private LocalDateTime           documentCreatedAt;
    private LocalDateTime           documentExpireAt;
    private DocumentStatusHistoryResponse   documentHistory;

    public DocumentResponse(
        String                  documentTitle, 
        LocalDateTime           documentCreatedAt, 
        LocalDateTime           documentExpireAt,
        DocumentStatusHistoryResponse   documentHistory
    ){
        this.documentTitle = documentTitle;
        this.documentCreatedAt = documentCreatedAt;
        this.documentExpireAt = documentExpireAt;
        this.documentHistory = documentHistory;
    }
}