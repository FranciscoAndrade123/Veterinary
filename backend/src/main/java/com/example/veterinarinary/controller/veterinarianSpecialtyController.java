package com.example.veterinarinary.controller;

import org.springframework.web.bind.annotation.RestController;

import com.example.veterinarinary.DTO.responseDTO;
import com.example.veterinarinary.DTO.veterinarianSpecialtyDTO;
import com.example.veterinarinary.model.veterinarianSpecialty;
import com.example.veterinarinary.service.veterinarianSpecialtyService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
            return new ResponseEntity<>("veterinarianSpecialty OK", HttpStatus.OK); // Acá se devuelve un mensaje en texto
        } catch (Exception e) {
            return new ResponseEntity<>("Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Buscar relación por ID
    @GetMapping("/{id}")
    public ResponseEntity<Object> findById(@PathVariable int id) {
        veterinarianSpecialty response = veterinarianSpecialtyService.findById(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Listar todas las relaciones
    @GetMapping("/")
    public ResponseEntity<List<veterinarianSpecialty>> findAll() {
        List<veterinarianSpecialty> list = veterinarianSpecialtyService.findAll();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    // Eliminar relación por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteById(@PathVariable int id) {
        responseDTO response = veterinarianSpecialtyService.deleteById(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
