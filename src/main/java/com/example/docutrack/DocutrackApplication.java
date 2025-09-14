package com.example.docutrack;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class DocutrackApplication {

	public static void main(String[] args) {
		SpringApplication.run(DocutrackApplication.class, args);
		
	}

}
