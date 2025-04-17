package com.example.veterinarinary.controller;

import org.springframework.web.bind.annotation.RestController;
import com.example.veterinarinary.DTO.veterinarianDTO;
import com.example.veterinarinary.service.veterinarianService;
import com.example.veterinarinary.DTO.responseDTO;


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
@RequestMapping("/api/v1/veterinarian")
public class veterinarianController {

    @Autowired
    private veterinarianService veterinarianService;

    // Endpoint para crear un veterinario
    @PostMapping("/")
    public ResponseEntity<Object> createVeterinarian(@RequestBody veterinarianDTO veterinarianDTO) {
        try {
            // Utiliza el método save modificado que devuelve responseDTO
            responseDTO response = veterinarianService.save(veterinarianDTO);
            
            // Determina el HttpStatus basado en el status del responseDTO
            HttpStatus httpStatus = response.getStatus().equals(HttpStatus.OK.toString()) 
                ? HttpStatus.OK 
                : HttpStatus.OK;
            
            // Devuelve el responseDTO completo con el status HTTP apropiado
            return new ResponseEntity<>(response, httpStatus);
        } catch (Exception e) {
            // En caso de excepción, crea un responseDTO de error
            responseDTO errorResponse = new responseDTO(
                "Error: " + e.getMessage(),
                HttpStatus.INTERNAL_SERVER_ERROR.toString());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Endpoint para obtener todos los veterinarios
    @GetMapping("/")
    public ResponseEntity<Object> getAllVeterinarians() {
        var listaVeterinarios = veterinarianService.findAll();
        return new ResponseEntity<>(listaVeterinarios, HttpStatus.OK);
    }

    // Endpoint para obtener un veterinario por ID
    @GetMapping("/{id}")
    public ResponseEntity<Object> getVeterinarianById(@PathVariable int id) {
        var veterinario = veterinarianService.findById(id);
        if (veterinario.isPresent()) {
            return new ResponseEntity<>(veterinario.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>(new responseDTO(
            HttpStatus.OK.toString(),
            "El veterinario no existe"
        ), HttpStatus.OK);
    }

    // Endpoint para eliminar un veterinario por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteVeterinarian(@PathVariable int id) {
        var message = veterinarianService.deleteVeterinarian(id);
        return new ResponseEntity<>(message, HttpStatus.OK);
    }

    // Endpoint para actualizar un veterinario por ID
    @PutMapping("/{id}")
    public ResponseEntity<Object> updateVeterinarian(@PathVariable int id, @RequestBody veterinarianDTO verVeterinarianDTO){
        responseDTO response = veterinarianService.updateVeterinarian(id, verVeterinarianDTO);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    


}