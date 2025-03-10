package com.example.veterinarinary.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.veterinarinary.DTO.breedDTO;
import com.example.veterinarinary.model.breed;
import com.example.veterinarinary.repository.ibreed;

@Service
public class breedService {

    @Autowired
    private ibreed data;

    // Método para guardar (Registrar y Actualizar)
    public void save(breedDTO breedDTO) {
        breed userRegister = converToModel(breedDTO);
        data.save(userRegister);
    }

    // Convertir de Entidad a DTO
    public breedDTO convertToDTO(breed breed) {
        return new breedDTO(
            breed.getBreedName(),  // Método corregido
            breed.getCharacteristic()  // Método corregido
        );
    }

    // Convertir de DTO a Entidad
    public breed converToModel(breedDTO breedDTO) {
        return new breed(
            0,  // ID, se generará automáticamente
            breedDTO.getBreedName(),  // Método corregido
            breedDTO.getCharacteristic()  // Método corregido
        );
    }
}