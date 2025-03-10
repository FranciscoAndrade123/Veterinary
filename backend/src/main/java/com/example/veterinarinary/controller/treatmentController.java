package com.example.veterinarinary.controller;

import org.springframework.web.bind.annotation.RestController;

import com.example.veterinarinary.DTO.treatmentDTO;
import com.example.veterinarinary.service.treatmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/api/v1/treatment")
public class treatmentController {
       @Autowired
    private treatmentService treatmentService;
    @PostMapping("/")
    public ResponseEntity<Object> createtreatment(@RequestBody treatmentDTO treatmentDTO) {
        try {
            treatmentService.save(treatmentDTO); // Guarda la raza usando el servicio
            return new ResponseEntity<>("Treatment created successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
