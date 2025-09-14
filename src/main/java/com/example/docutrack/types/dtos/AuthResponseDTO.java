package com.example.docutrack.types.dtos;

import lombok.Data;

@Data
public class AuthResponseDTO {
    private String accessToken;
    private String refreshToken;
    private String tokenType = "";

    public AuthResponseDTO(String accessToken,  String refreshToken, String tokenType){
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.tokenType = tokenType;
    }
}