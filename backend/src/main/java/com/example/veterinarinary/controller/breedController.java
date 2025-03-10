package com.example.veterinarinary.controller;

import org.springframework.web.bind.annotation.RestController;
import com.example.veterinarinary.DTO.breedDTO;
import com.example.veterinarinary.service.breedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/api/v1/breed")
public class breedController {

    @Autowired
    private breedService breedService;

    @PostMapping("/")
    public ResponseEntity<Object> createBreed(@RequestBody breedDTO breedDTO) {
        try {
            breedService.save(breedDTO); // Guarda la raza usando el servicio
            return new ResponseEntity<>("Breed created successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}