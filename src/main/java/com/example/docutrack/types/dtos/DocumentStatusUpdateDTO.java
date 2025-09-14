package com.example.docutrack.types.dtos;

import com.example.docutrack.types.enums.EStatus;

import lombok.Data;

@Data
public class DocumentStatusUpdateDTO {
    private EStatus statusName;
    private String comment;
}
