package com.example.veterinarinary.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import com.example.veterinarinary.DTO.treatmentDTO;
import com.example.veterinarinary.model.treatment;
import com.example.veterinarinary.DTO.responseDTO;
import com.example.veterinarinary.repository.itreatment;

import java.util.List;
import java.util.Optional;

@Service
public class treatmentService {

    @Autowired
    private itreatment data;

    // Método para guardar (Registrar y Actualizar) con validaciones
    public responseDTO save(treatmentDTO treatmentDTO) {
        // Validación de nombre (no vacío y longitud máxima)
        if (treatmentDTO.getTreatmentName() == null || 
                treatmentDTO.getTreatmentName().trim().isEmpty() ||
                treatmentDTO.getTreatmentName().length() > 100) {
            return new responseDTO(
                HttpStatus.BAD_REQUEST.toString(),
                "El nombre del tratamiento no puede estar vacío y debe tener máximo 100 caracteres"
            );
        }

        // Validación de descripción (no vacía y longitud máxima)
        if (treatmentDTO.getTreatmentDescription() == null || 
                treatmentDTO.getTreatmentDescription().trim().isEmpty() ||
                treatmentDTO.getTreatmentDescription().length() > 500) {
            return new responseDTO(
                HttpStatus.BAD_REQUEST.toString(),
                "La descripción del tratamiento no puede estar vacía y debe tener máximo 500 caracteres"
            );
        }

        // Si las validaciones pasan, proceder a guardar
        treatment treatmentEntity = convertToModel(treatmentDTO);
        data.save(treatmentEntity);

        // Respuesta exitosa
        return new responseDTO(
            HttpStatus.OK.toString(),
            "Tratamiento guardado correctamente"
        );
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
            0,  // ID, se generará automáticamente
            treatmentDTO.getTreatmentName(),
            treatmentDTO.getTreatmentDescription()
        );
    }

    // Buscar todos los tratamientos
    public List<treatment> findAll() {
        return data.findAll();
    }

    // Buscar un tratamiento por ID
    public Optional<treatment> findById(int id) {
        return data.findById(id);
    }

    // Eliminar un tratamiento por ID
    public responseDTO deleteTreatment(int id) {
        if (!findById(id).isPresent()) {
            return new responseDTO(
                HttpStatus.OK.toString(),
                "El registro no existe"
            );
        }
        data.deleteById(id);
        return new responseDTO(
            HttpStatus.OK.toString(),
            "Tratamiento eliminado correctamente"
        );
    }
}