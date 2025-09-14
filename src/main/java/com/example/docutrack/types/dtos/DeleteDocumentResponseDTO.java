package com.example.docutrack.types.dtos;

import org.springframework.beans.factory.annotation.Autowired;

import com.example.docutrack.types.entities.DocumentStatusType;

import lombok.Data;

@Data
public class DeleteDocumentResponseDTO {

    private Integer Id;
    private String  documentTitle;
    private DocumentStatusType documentStatus;

    @Autowired
    public DeleteDocumentResponseDTO(
        Integer Id, 
        String documentTitle
    ){
        this.Id = Id;
        this.documentTitle = documentTitle;
    }
}
