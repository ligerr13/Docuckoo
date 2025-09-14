package com.example.docutrack.types.dtos;

import com.example.docutrack.types.enums.EStatus;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DocumentStatusChangeResponseDTO {
    private Integer documentId;
    private EStatus statusName;
}
