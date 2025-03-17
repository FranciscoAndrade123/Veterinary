package com.example.veterinarinary.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.RestController;
import com.example.veterinarinary.DTO.specialtyDTO;
import com.example.veterinarinary.DTO.responseDTO;
import com.example.veterinarinary.service.specialtyService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/specialty")
public class specialtyController {

    @Autowired
    private specialtyService specialtyService;

    @PostMapping("/")
    public ResponseEntity<Object> createSpecialty(@RequestBody specialtyDTO specialtyDTO) {
        responseDTO response = specialtyService.save(specialtyDTO);
        HttpStatus status = response.getStatus().equals(HttpStatus.OK.toString()) ? HttpStatus.OK : HttpStatus.BAD_REQUEST;
        return new ResponseEntity<>(response, status);
    }

    @GetMapping("/")
    public ResponseEntity<List<specialtyDTO>> getAllSpecialties() {
        return new ResponseEntity<>(specialtyService.findAll(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getSpecialtyById(@PathVariable int id) {
        Optional<specialtyDTO> specialty = specialtyService.findById(id);
        return specialty.isPresent()
            ? new ResponseEntity<>(specialty.get(), HttpStatus.OK)
            : new ResponseEntity<>(new responseDTO(HttpStatus.NOT_FOUND.toString(), "La especialidad no existe"), HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteSpecialty(@PathVariable int id) {
        responseDTO response = specialtyService.deleteSpecialty(id);
        HttpStatus status = response.getStatus().equals(HttpStatus.OK.toString()) ? HttpStatus.OK : HttpStatus.NOT_FOUND;
        return new ResponseEntity<>(response, status);
    }
}
