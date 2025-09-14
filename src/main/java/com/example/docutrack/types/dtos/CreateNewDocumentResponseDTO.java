package com.example.docutrack.types.dtos;

import org.springframework.beans.factory.annotation.Autowired;

import com.example.docutrack.types.entities.DocumentStatusType;

import lombok.Data;

@Data
public class CreateNewDocumentResponseDTO {

    private Integer Id;
    private String documentTitle;
    private DocumentStatusType documentStatus;
    private String expiresAt;

    @Autowired
    public CreateNewDocumentResponseDTO(
        Integer Id, 
        String documentTitle,
        DocumentStatusType documentStatus,
        String expiresAt
    ){
        this.Id = Id;
        this.documentTitle = documentTitle;
        this.documentStatus = documentStatus;
        this.expiresAt = expiresAt;
    }
}

