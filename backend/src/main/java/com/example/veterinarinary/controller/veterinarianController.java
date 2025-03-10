package com.example.veterinarinary.controller;

import org.springframework.web.bind.annotation.RestController;


import com.example.veterinarinary.DTO.veterinarianDTO;
import com.example.veterinarinary.service.veterinarianService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;


@RestController
@RequestMapping("/api/v1/veterinarian")
public class veterinarianController {
      @Autowired
    private veterinarianService veterinarianService;
    @PostMapping("/")
    public ResponseEntity<Object> createVeterinarian(@RequestBody veterinarianDTO veterinarianDTO) {
        try {
            veterinarianService.save(veterinarianDTO); // Guarda el veterinario usando el servicio
            return new ResponseEntity<>("Veterinarian created successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
}
