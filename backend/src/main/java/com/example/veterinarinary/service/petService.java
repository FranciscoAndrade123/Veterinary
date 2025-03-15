package com.example.veterinarinary.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.veterinarinary.DTO.petDTO;
import com.example.veterinarinary.model.pet;
import com.example.veterinarinary.repository.ipet;

@Service
public class petService {
    
    @Autowired
    private ipet data;

    // Método para guardar (Registrar y Actualizar)
    public void save (petDTO petDTO){
        pet petRegister = convertToModel(petDTO);
        data.save(petRegister);
    }

       // Convertir de Entidad a DTO
    public pet convertToModel(petDTO petDTO) {
        return new pet(
            petDTO.getPetName(),
            petDTO.getClientID(), // Obtener el ID del cliente
            petDTO.getBreedID()   // Obtener el ID de la raza
        );
    }
    // Convertir de DTO a entidad
    public petDTO convertToDTO(pet pet) {
        return new petDTO(
            pet.getPetName(),
            pet.getClient(),// Obtener el ID del cliente
            pet.getBreed()// Obtener el ID de la raza
        );
    }

}
