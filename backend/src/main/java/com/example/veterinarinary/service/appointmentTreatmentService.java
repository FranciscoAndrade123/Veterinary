package com.example.veterinarinary.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import com.example.veterinarinary.DTO.appointmentTreatmentDTO;
import com.example.veterinarinary.DTO.responseDTO;
import com.example.veterinarinary.model.appointment;
import com.example.veterinarinary.model.treatment;
import com.example.veterinarinary.model.appointmentTreatment;
import com.example.veterinarinary.repository.iappointmentTreatment;
import com.example.veterinarinary.repository.iappointment;
import com.example.veterinarinary.repository.itreatment;


@Service
public class appointmentTreatmentService {
    
    @Autowired
    private iappointmentTreatment appointmentTreatmentRepository;
    
    @Autowired
    private iappointment appointmentRepository;
    
    @Autowired
    private itreatment treatmentRepository;
    
    // Guardar relación cita-tratamiento con validaciones
    @Transactional
    public responseDTO save(appointmentTreatmentDTO dto) {
        try {
            // 1. Validar existencia de cita y tratamiento
            appointment appointment = appointmentRepository.findById(dto.getAppointmentID())
                .orElseThrow(() -> new RuntimeException("Cita no encontrada con ID: " + dto.getAppointmentID()));
            
            treatment treatment = treatmentRepository.findById(dto.getTreatmentID())
                .orElseThrow(() -> new RuntimeException("Tratamiento no encontrado con ID: " + dto.getAppointmentID()));


               // 2. Crear y guardar la relación
               appointmentTreatment relation = new appointmentTreatment();
              relation.setAppointmentID(appointment);
                    relation.setTreatmentId(treatment);
                        appointmentTreatmentRepository.save(relation);                        
                        return new responseDTO(
                            HttpStatus.OK.toString(),  // Usamos el código numérico en lugar de la cadena
                            "Relación cita-tratamiento creada correctamente"
                        );
            
            
        } catch (Exception e) {
            return new responseDTO(
                HttpStatus.INTERNAL_SERVER_ERROR.toString(),
                "Error al guardar: " + e.getMessage()
            );
        }
    }
    
}