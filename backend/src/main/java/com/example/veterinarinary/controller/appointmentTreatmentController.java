package com.example.veterinarinary.controller;


import org.springframework.web.bind.annotation.RestController;
import com.example.veterinarinary.service.appointmentTreatmentService;
import com.example.veterinarinary.DTO.appointmentTreatmentDTO;
import com.example.veterinarinary.DTO.responseDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/api/v1/appointmentTreatment")
public class appointmentTreatmentController {
 @Autowired
    private appointmentTreatmentService appointmentTreatmentService;
    
    @PostMapping("/")
    public ResponseEntity<responseDTO> registerAppointmentTreatment(@RequestBody appointmentTreatmentDTO appointmentTreatmentDTO) {
        try {
            responseDTO response = appointmentTreatmentService.save(appointmentTreatmentDTO);
            return new ResponseEntity<>(response, HttpStatus.valueOf(response.getStatus()));
        } catch (Exception e) {
            responseDTO response = new responseDTO(HttpStatus.INTERNAL_SERVER_ERROR.toString(), 
                                                 "Error: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
