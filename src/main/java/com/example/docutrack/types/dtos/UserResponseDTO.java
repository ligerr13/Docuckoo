package com.example.docutrack.types.dtos;

import lombok.Data;

@Data
public class UserResponseDTO {
    private Integer userId;
    private String email;

    public UserResponseDTO(Integer userId, String email){
        this.userId = userId;
        this.email = email;
    }
}