package com.example.veterinarinary.controller;

import org.springframework.web.bind.annotation.RestController;
import com.example.veterinarinary.DTO.petDTO;
import com.example.veterinarinary.DTO.responseDTO;
import com.example.veterinarinary.model.pet;
import com.example.veterinarinary.service.petService;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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

     @GetMapping("/{id}")
    public ResponseEntity<?> getPetById(@PathVariable int id) {
        try {
            Optional<pet> petOptional = petService.findById(id);
            if (petOptional.isPresent()) {
                return new ResponseEntity<>(petOptional.get(), HttpStatus.OK);
            } else {
                responseDTO response = new responseDTO("Mascota no encontrada", "error");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            responseDTO response = new responseDTO("Error al buscar mascota: " + e.getMessage(), "error");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/")
    public ResponseEntity<?> getAllPets() {
        try {
            List<pet> pets = petService.findAll();
            return new ResponseEntity<>(pets, HttpStatus.OK);
        } catch (Exception e) {
            responseDTO response = new responseDTO("Error al obtener mascotas: " + e.getMessage(), "error");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<responseDTO> deletePet(@PathVariable int id) {
        try {
            if (petService.existsById(id)) {
                petService.deleteById(id);
                responseDTO response = new responseDTO("Mascota eliminada correctamente", "success");
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                responseDTO response = new responseDTO("Mascota no encontrada", "error");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            responseDTO response = new responseDTO("Error al eliminar mascota: " + e.getMessage(), "error");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Actualizar mascota
    @PutMapping("/{id}")
    public ResponseEntity<responseDTO> updatePet(@PathVariable int id, @RequestBody petDTO petDTO) {
        try {
            if (petService.existsById(id)) {
                petService.updatePet(id, petDTO);
                responseDTO response = new responseDTO("Mascota actualizada correctamente", "success");
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                responseDTO response = new responseDTO("Mascota no encontrada", "error");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            responseDTO response = new responseDTO("Error al actualizar mascota: " + e.getMessage(), "error");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
}
