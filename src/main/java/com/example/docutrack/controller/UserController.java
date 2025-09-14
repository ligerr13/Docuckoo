package com.example.docutrack.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.docutrack.services.AuthService;
import com.example.docutrack.types.dtos.UserResponseDTO;
import com.example.docutrack.types.entities.User;

@RestController
@RequestMapping("/api/user")
public class UserController {
    
    @Autowired
    private AuthService authService;

    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> getCurrentUser(){
        try {
            User currentUser = authService.getCurrentUser();
    
            UserResponseDTO userResponse = new UserResponseDTO(
                currentUser.getUserId(),
                currentUser.getUserEmail()
            );
    
            return ResponseEntity.ok(userResponse);
            
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
