package com.example.docutrack.controller;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;

public class DocumentRequest {
    @NotBlank
    private Integer id;

    @NotBlank
    private String title;

    @NotBlank
    private LocalDateTime expiresAt;

    public Integer getId(){
        return this.id;
    }
    
    public void setId(final Integer id){
        this.id = id;
    }
    
    public LocalDateTime getExpiresAt(){
        return this.expiresAt;
    }
    
    public void setExpiresAt(final LocalDateTime expiresAt){
        this.expiresAt = expiresAt;
    }

    public String getTitle(){
        return this.title;
    }

    public void setTitle(final String title){
        this.title = title;
    }
}