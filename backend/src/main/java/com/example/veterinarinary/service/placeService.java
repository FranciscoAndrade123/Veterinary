package com.example.veterinarinary.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.veterinarinary.DTO.placeDTO;
import com.example.veterinarinary.model.place;
import com.example.veterinarinary.repository.iplace;


@Service
public class placeService {

    @Autowired
    private iplace data;

    // Método para guardar (Registrar y Actualizar)
    public place save(placeDTO placeDTO) {
        place placeRegister = converToModel(placeDTO);
        return data.save(placeRegister);
    }

       // Convertir de Entidad a DTO
    public  placeDTO convertToDTO(place place){
        return new placeDTO(
            place.getPlaceName()
        );
    }
// Convertir de DTO a entidad
    public place converToModel (placeDTO placeDTO){
        return new place(
            0,
            placeDTO.getPlaceName()
        );
    }
    
}
