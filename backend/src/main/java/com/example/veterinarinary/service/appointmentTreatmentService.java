package com.example.veterinarinary.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.veterinarinary.DTO.appointmentTreatmentDTO;
import com.example.veterinarinary.model.appointmentTreatment;
import com.example.veterinarinary.repository.iappointmentTreatment;

@Service
public class appointmentTreatmentService {
    
    @Autowired 
    private iappointmentTreatment data;

      // Método para guardar (Registrar y Actualizar)
      public void save (appointmentTreatmentDTO appointmentTreatmentDTO) {
        appointmentTreatment appointmentTreatmentRegister = convertToModel(appointmentTreatmentDTO);
        data.save(appointmentTreatmentRegister);
      }

      // Convertir de Entidad a DTO
      public appointmentTreatment convertToModel(appointmentTreatmentDTO appointmentTreatmentDTO) {
        return new appointmentTreatment(
            appointmentTreatmentDTO.getId(),
            appointmentTreatmentDTO.getAppointmentID(),
            appointmentTreatmentDTO.getTreatmentId()
        );
      }

       // Convertir de DTO a entidad

       public appointmentTreatmentDTO convertToDTO(appointmentTreatment appointmentTreatment) {
        return new appointmentTreatmentDTO(
            appointmentTreatment.getId(),
            appointmentTreatment.getAppointmentID(),
            appointmentTreatment.getTreatmentId()
        );
       }
    
}
