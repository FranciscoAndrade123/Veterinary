package com.example.veterinarinary.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.veterinarinary.DTO.veterinarianSpecialtyDTO;
import com.example.veterinarinary.model.veterinarianSpecialty;
import com.example.veterinarinary.repository.iveterinarianSpecialty;

@Service
public class veterinarianSpecialtyService {

    @Autowired
    private iveterinarianSpecialty data;

      // Método para guardar (Registrar y Actualizar)
      public void  save(veterinarianSpecialtyDTO veterinarianSpecialtyDTO) {
        veterinarianSpecialty veterinarianSpecialtyRegister = convertToModel(veterinarianSpecialtyDTO);
        data.save(veterinarianSpecialtyRegister);
      }

      // Convertir de Entidad a DTO
      public veterinarianSpecialty convertToModel(veterinarianSpecialtyDTO veterinarianSpecialtyDTO) {
        return new veterinarianSpecialty(
             veterinarianSpecialtyDTO.getId(),
             veterinarianSpecialtyDTO.getVeterinarianID(),
             veterinarianSpecialtyDTO.getSpecialtyID()
        );
      }

     // Convertir de DTO a entidad
     public veterinarianSpecialtyDTO convertToModel (veterinarianSpecialty veterinarianSpecialty){
        return new veterinarianSpecialtyDTO(
            veterinarianSpecialty.getId(),
            veterinarianSpecialty.getVeterinarianID(),
            veterinarianSpecialty.getSpecialtyID()
        );
     }
    
}
