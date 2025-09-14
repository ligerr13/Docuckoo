package com.example.docutrack.controller;

import jakarta.validation.constraints.NotBlank;

public class SignInRequest {
	@NotBlank
  	private String userEmail;

	@NotBlank
	private String userPassword;

	public String getUserEmail() {
		return userEmail;
	}

	public void setUserEmail(String userEmail) {
		this.userEmail = userEmail;
	}

	public String getUserPassword() {
		return userPassword;
	}

	public void setUserPassword(String userPassword) {
		this.userPassword = userPassword;
	}
}