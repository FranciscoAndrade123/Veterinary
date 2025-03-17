package com.example.veterinarinary.controller;

import org.springframework.web.bind.annotation.RestController;
import com.example.veterinarinary.DTO.veterinarianSpecialtyDTO;
import com.example.veterinarinary.service.veterinarianSpecialtyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/api/v1/veterinarianSpecialty")
public class veterinarianSpecialtyController {
    @Autowired
    private veterinarianSpecialtyService veterinarianSpecialtyService;
    @PostMapping("/")
    public ResponseEntity<Object>veterinarianSpecialtyRegister(@RequestBody veterinarianSpecialtyDTO veterinarianSpecialtyDTO){
        try {
            veterinarianSpecialtyService.save(veterinarianSpecialtyDTO);
            return new ResponseEntity<>("veterinarianSpecialty OK", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
