package com.example.veterinarinary.controller;

import org.springframework.web.bind.annotation.RestController;
import com.example.veterinarinary.DTO.treatmentDTO;
import com.example.veterinarinary.service.treatmentService;
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
@RequestMapping("/api/v1/treatment")
public class treatmentController {

    @Autowired
    private treatmentService treatmentService;

    // Endpoint para crear un tratamiento
    @PostMapping("/")
    public ResponseEntity<Object> createTreatment(@RequestBody treatmentDTO treatmentDTO) {
        try {
            // Utiliza el método save modificado que devuelve responseDTO
            responseDTO response = treatmentService.save(treatmentDTO);
            
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

    // Endpoint para obtener todos los tratamientos
    @GetMapping("/")
    public ResponseEntity<Object> getAllTreatments() {
        var listaTratamientos = treatmentService.findAll();
        return new ResponseEntity<>(listaTratamientos, HttpStatus.OK);
    }

    // Endpoint para obtener un tratamiento por ID
    @GetMapping("/{id}")
    public ResponseEntity<Object> getTreatmentById(@PathVariable int id) {
        var tratamiento = treatmentService.findById(id);
        if (tratamiento.isPresent()) {
            return new ResponseEntity<>(tratamiento.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>(new responseDTO(
            HttpStatus.OK.toString(),
            "El tratamiento no existe"
        ), HttpStatus.OK);
    }

    // Endpoint para eliminar un tratamiento por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteTreatment(@PathVariable int id) {
        var message = treatmentService.deleteTreatment(id);
        return new ResponseEntity<>(message, HttpStatus.OK);
    }

    // Endpoint para actualizar un tratamiento
 @PutMapping("/{id}")
    public ResponseEntity<Object> updateTreatment(@PathVariable int id, @RequestBody treatmentDTO treatmentDTO) {
        responseDTO response = treatmentService.updateTreatment(id, treatmentDTO);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Endpoint para filtrar tratamientos por nombre
    @GetMapping("/filter/{filter}")
    public ResponseEntity<Object> filterTreatments(@PathVariable String filter) {
        var listaTratamientos = treatmentService.getListTreatmentForName(filter);
        return new ResponseEntity<>(listaTratamientos, HttpStatus.OK);
    }
}