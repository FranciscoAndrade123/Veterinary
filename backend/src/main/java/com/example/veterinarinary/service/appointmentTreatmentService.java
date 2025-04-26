package com.example.veterinarinary.service;

import java.util.List;

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
                .orElseThrow(() -> new RuntimeException("Tratamiento no encontrado con ID: " + dto.getTreatmentID()));

            // 2. Crear y guardar la relación
            appointmentTreatment relation = new appointmentTreatment();
            relation.setAppointmentID(appointment);
            relation.setTreatmentId(treatment);
            appointmentTreatmentRepository.save(relation);

            // Retornar respuesta exitosa
            return new responseDTO(
                HttpStatus.OK.value() + "", // Convertimos el valor numérico a cadena
                "Relación cita-tratamiento creada correctamente"
            );

        } catch (Exception e) {
            // Retornar respuesta de error
            return new responseDTO(
                HttpStatus.INTERNAL_SERVER_ERROR.value() + "", // Convertimos el valor numérico a cadena
                "Error al guardar: " + e.getMessage()
            );
        }
    }

    // Obtener todas las relaciones cita-tratamiento
    @Transactional
    public List<appointmentTreatmentDTO> getAll() {
        List<appointmentTreatment> relations = appointmentTreatmentRepository.findAll();
        return relations.stream().map(relation -> {
            appointmentTreatmentDTO dto = new appointmentTreatmentDTO();
            dto.setAppointmentID(relation.getAppointmentID().getAppointmentID());
            dto.setTreatmentID(relation.getTreatmentId().getTreatmentId());
            return dto;
        }).toList();
    }

    //Eliminar relación por ID
    @Transactional
    public responseDTO deleteById(int id) {
        try {
            appointmentTreatment relation = appointmentTreatmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Relación no encontrada con ID: " + id));
            appointmentTreatmentRepository.delete(relation);
            return new responseDTO(
                HttpStatus.OK.value() + "", // Convertimos el valor numérico a cadena
                "Relación eliminada correctamente"
            );
        } catch (Exception e) {
            return new responseDTO(
                HttpStatus.INTERNAL_SERVER_ERROR.value() + "", // Convertimos el valor numérico a cadena
                "Error al eliminar: " + e.getMessage()
            );
        }
    }

    // Actualizar relación por ID
    @Transactional
    public responseDTO updateById(int id, appointmentTreatmentDTO dto) {
    try {
        // Validar si la relación existe
        appointmentTreatment existingRelation = appointmentTreatmentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Relación no encontrada con ID: " + id));

        // Validar existencia de la cita
        appointment appointment = appointmentRepository.findById(dto.getAppointmentID())
            .orElseThrow(() -> new RuntimeException("Cita no encontrada con ID: " + dto.getAppointmentID()));

        // Validar existencia del tratamiento
        treatment treatment = treatmentRepository.findById(dto.getTreatmentID())
            .orElseThrow(() -> new RuntimeException("Tratamiento no encontrado con ID: " + dto.getTreatmentID()));

        // Actualizar la relación
        existingRelation.setAppointmentID(appointment);
        existingRelation.setTreatmentId(treatment);

        // Guardar los cambios
        appointmentTreatmentRepository.save(existingRelation);

        return new responseDTO(
            HttpStatus.OK.value() + "", // Convertimos el valor numérico a cadena
            "Relación actualizada correctamente"
        );

    } catch (Exception e) {
        return new responseDTO(
            HttpStatus.INTERNAL_SERVER_ERROR.value() + "", // Convertimos el valor numérico a cadena
            "Error al actualizar: " + e.getMessage()
        );
    }
}
}
    