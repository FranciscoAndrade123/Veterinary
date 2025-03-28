package com.example.veterinarinary.controller;

import org.springframework.web.bind.annotation.RestController;
import com.example.veterinarinary.DTO.petDTO;
import com.example.veterinarinary.service.petService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/api/v1/pet")
public class petController {
    @Autowired
    private petService petService;
    @PostMapping("/")
    public ResponseEntity<Object> registerUser(@RequestBody petDTO petDTO) {
        try{
            petService.save(petDTO);
            return new ResponseEntity<>("Pet OK", HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>("Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
}
