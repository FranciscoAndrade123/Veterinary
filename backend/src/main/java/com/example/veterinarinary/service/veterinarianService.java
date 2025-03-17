package com.example.veterinarinary.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import com.example.veterinarinary.DTO.veterinarianDTO;
import com.example.veterinarinary.model.veterinarian;
import com.example.veterinarinary.DTO.responseDTO;
import com.example.veterinarinary.repository.iveterinarian;

import java.util.List;
import java.util.Optional;

@Service
public class veterinarianService {

    @Autowired
    private iveterinarian data;

    // Método para guardar (Registrar y Actualizar) con validaciones
    public responseDTO save(veterinarianDTO veterinarianDTO) {
        // Validación de nombre (no vacío y longitud máxima)
        if (veterinarianDTO.getVeterinarianName() == null || 
                veterinarianDTO.getVeterinarianName().trim().isEmpty() ||
                veterinarianDTO.getVeterinarianName().length() > 200) {
            return new responseDTO(
                HttpStatus.BAD_REQUEST.toString(),
                "El nombre del veterinario no puede estar vacío y debe tener máximo 200 caracteres"
            );
        }

        // Si las validaciones pasan, proceder a guardar
        veterinarian vet = convertToModel(veterinarianDTO);
        data.save(vet);

        // Respuesta exitosa
        return new responseDTO(
            HttpStatus.OK.toString(),
            "Veterinario guardado correctamente"
        );
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

    // Buscar todos los veterinarios
    public List<veterinarian> findAll() {
        return data.findAll();
    }

    // Buscar un veterinario por ID
    public Optional<veterinarian> findById(int id) {
        return data.findById(id);
    }

    // Eliminar un veterinario por ID
    public responseDTO deleteVeterinarian(int id) {
        if (!findById(id).isPresent()) {
            return new responseDTO(
                HttpStatus.OK.toString(),
                "El registro no existe"
            );
        }
        data.deleteById(id);
        return new responseDTO(
            HttpStatus.OK.toString(),
            "Veterinario eliminado correctamente"
        );
    }
}