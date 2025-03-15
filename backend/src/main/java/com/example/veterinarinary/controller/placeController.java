package com.example.veterinarinary.controller;

import org.springframework.web.bind.annotation.RestController;
import com.example.veterinarinary.DTO.placeDTO;
import com.example.veterinarinary.service.placeService; 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/api/v1/place")
public class placeController {
    @Autowired
    private placeService placeService;

    //Para enviar y registrar datos 
    @PostMapping("/")
    public ResponseEntity<Object> createBreed(@RequestBody placeDTO placeDTO){
        try{
            placeService.save(placeDTO); // Guarda el lugar usando el servicio
            return new ResponseEntity<>("Place created successfully", HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>("Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    
}
