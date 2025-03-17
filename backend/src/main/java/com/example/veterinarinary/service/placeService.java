package com.example.veterinarinary.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import com.example.veterinarinary.DTO.placeDTO;
import com.example.veterinarinary.DTO.responseDTO;
import com.example.veterinarinary.model.place;
import com.example.veterinarinary.repository.iplace;

@Service
public class placeService {

    @Autowired
    private iplace data;

    // Guardar (Registrar y Actualizar)
    public responseDTO save(placeDTO placeDTO) {
        // Validación antes de guardar
        if (placeDTO.getPlaceName() == null || placeDTO.getPlaceName().trim().isEmpty()) {
            return new responseDTO(HttpStatus.BAD_REQUEST.toString(), "El nombre del lugar no puede estar vacío");
        }

        // Guardar en la base de datos
        place placeRegister = converToModel(placeDTO);
        data.save(placeRegister);
        return new responseDTO(HttpStatus.OK.toString(), "Lugar guardado correctamente");
    }

    // Listar todos los lugares
    public List<placeDTO> findAll() {
        List<place> places = data.findAll();
        return places.stream()
                     .map(this::convertToDTO)
                     .collect(Collectors.toList());
    }

    // Buscar por ID
    public Optional<placeDTO> findById(int id) {
        Optional<place> place = data.findById(id);
        return place.map(this::convertToDTO);
    }

    // Eliminar por ID
    public responseDTO deletePlace(int id) {
        Optional<place> place = data.findById(id);
        if (!place.isPresent()) {
            return new responseDTO(HttpStatus.NOT_FOUND.toString(), "El lugar no existe");
        }

        data.deleteById(id);
        return new responseDTO(HttpStatus.OK.toString(), "Lugar eliminado correctamente");
    }

    // Convertir de Entidad a DTO
    public placeDTO convertToDTO(place place) {
        return new placeDTO(place.getPlaceName());
    }

    // Convertir de DTO a Entidad
    public place converToModel(placeDTO placeDTO) {
        return new place(
            0,  
            placeDTO.getPlaceName()
        );
    }
}
