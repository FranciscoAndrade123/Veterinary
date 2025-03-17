package com.example.veterinarinary.controller;


import org.springframework.web.bind.annotation.RestController;
import com.example.veterinarinary.service.appointmentTreatmentService;
import com.example.veterinarinary.DTO.appointmentTreatmentDTO;
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
    public ResponseEntity<Object> appointmentTreatmentRegister(@RequestBody appointmentTreatmentDTO appointmentTreatmentDTO){
        try{
           appointmentTreatmentService.save(appointmentTreatmentDTO);
           return new ResponseEntity<>("appointmentTreatment OK",HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>("Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
