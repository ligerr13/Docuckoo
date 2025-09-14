package com.example.docutrack.types.entities;

import com.example.docutrack.types.enums.EStatus;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "document_status_types")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DocumentStatusType {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @Column(name = "name", nullable = false, unique = true, length = 50)
    private EStatus name;
}

