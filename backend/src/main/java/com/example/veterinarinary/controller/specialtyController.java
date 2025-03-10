package com.example.veterinarinary.controller;

import org.springframework.web.bind.annotation.RestController;
import com.example.veterinarinary.DTO.specialtyDTO;
import com.example.veterinarinary.service.specialtyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;


@RestController
@RequestMapping("/api/v1/specialty")
public class specialtyController {
     @Autowired
    private specialtyService specialtyService;
    @PostMapping("/")
    public ResponseEntity<Object> createBreed(@RequestBody specialtyDTO specialtyDTO) {
        try {
            specialtyService.save(specialtyDTO); // Guarda la raza usando el servicio
            return new ResponseEntity<>("Specialty created successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
