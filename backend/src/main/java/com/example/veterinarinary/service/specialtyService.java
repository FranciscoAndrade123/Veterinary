package com.example.veterinarinary.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.veterinarinary.DTO.specialtyDTO;
import com.example.veterinarinary.model.specialty;
import com.example.veterinarinary.repository.ispecialty;

@Service
public class specialtyService {

    @Autowired
    private ispecialty data;

    // Método para guardar (Registrar y Actualizar)
    public void save(specialtyDTO specialtyDTO) {
        specialty userRegister = converToModel(specialtyDTO);
        data.save(userRegister);
    }

    // Convertir de Entidad a DTO
    public specialtyDTO convertToDTO(specialty specialty) {
        return new specialtyDTO(
            specialty.get_specialtyName()  // 🔄 Corrección aquí
        );
    }

    // Convertir de DTO a Entidad
    public specialty converToModel(specialtyDTO specialtyDTO) {
        return new specialty(
            0,  // ID, se generará automáticamente
            specialtyDTO.getSpecialtyName() // 🔄 Corrección aquí
        );
    }
}
