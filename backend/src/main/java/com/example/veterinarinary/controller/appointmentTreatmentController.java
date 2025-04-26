package com.example.veterinarinary.controller;


import org.springframework.web.bind.annotation.RestController;
import com.example.veterinarinary.service.appointmentTreatmentService;
import com.example.veterinarinary.DTO.appointmentTreatmentDTO;
import com.example.veterinarinary.DTO.responseDTO;

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
import org.springframework.web.bind.annotation.PutMapping;


@RestController
@RequestMapping("/api/v1/appointmentTreatment")
public class appointmentTreatmentController {
 @Autowired
    private appointmentTreatmentService appointmentTreatmentService;
    
    @PostMapping("/")
    public ResponseEntity<responseDTO> registerAppointmentTreatment(@RequestBody appointmentTreatmentDTO appointmentTreatmentDTO) {
        try {
            responseDTO response = appointmentTreatmentService.save(appointmentTreatmentDTO);

            // Convertir el código de estado a HttpStatus
            HttpStatus status = HttpStatus.resolve(Integer.parseInt(response.getMessage()));
            if (status == null) {
                status = HttpStatus.INTERNAL_SERVER_ERROR; // Valor predeterminado si el código no es válido
            }

            return new ResponseEntity<>(response, status);
        } catch (Exception e) {
            responseDTO response = new responseDTO(
                HttpStatus.INTERNAL_SERVER_ERROR.toString(),
                "Error: " + e.getMessage()
            );
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/")
    public ResponseEntity<List<appointmentTreatmentDTO>> getAllAppointmentTreatment() {
        List<appointmentTreatmentDTO> list = appointmentTreatmentService.getAll();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    //Eliminar relacion por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteById(@PathVariable int id) {
        responseDTO response = appointmentTreatmentService.deleteById(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    //Actualizar relacion por ID
    @PutMapping("/{id}")
    public ResponseEntity<Object> updateById(@PathVariable int id, @RequestBody appointmentTreatmentDTO appointmentTreatmentDTO) {
        responseDTO response = appointmentTreatmentService.updateById(id, appointmentTreatmentDTO);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }


}
