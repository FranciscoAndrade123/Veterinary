package com.example.veterinarinary.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.veterinarinary.DTO.veterinarianDTO;
import com.example.veterinarinary.model.veterinarian;
import com.example.veterinarinary.repository.iveterinarian;

@Service
public class veterinarianService {

    @Autowired
    private iveterinarian data;

    // Método para guardar (Registrar y Actualizar)
    public void save(veterinarianDTO veterinarianDTO) {
        veterinarian vet = convertToModel(veterinarianDTO);
        data.save(vet);
    }

    // Convertir de Entidad a DTO
    public veterinarianDTO convertToDTO(veterinarian veterinarian) {
        return new veterinarianDTO(
            veterinarian.get_veterinarianName()  
        );
    }

    // Convertir de DTO a Entidad
    public veterinarian convertToModel(veterinarianDTO veterinarianDTO) {
        return new veterinarian(
            0,  // ID, se generará automáticamente
            veterinarianDTO.getVeterinarianName() 
        );
    }
}
