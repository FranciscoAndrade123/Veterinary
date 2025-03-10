package com.example.veterinarinary.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.veterinarinary.DTO.treatmentDTO;
import com.example.veterinarinary.model.treatment;
import com.example.veterinarinary.repository.itreatment;

@Service
public class treatmentService {

    @Autowired
    private itreatment data;

    // Método para guardar (Registrar y Actualizar)
    public void save(treatmentDTO treatmentDTO) {
        treatment treatmentEntity = convertToModel(treatmentDTO);
        data.save(treatmentEntity);
    }

    // Convertir de Entidad a DTO
    public treatmentDTO convertToDTO(treatment treatment) {
        return new treatmentDTO(
            treatment.getTreatmentName(),
            treatment.getTreatmentDescription()
        );
    }

    // Convertir de DTO a Entidad
    public treatment convertToModel(treatmentDTO treatmentDTO) {
        return new treatment(
            0,  // ID autogenerado
            treatmentDTO.getTreatmentName(),
            treatmentDTO.getTreatmentDescription()
        );
    }
}
