package com.example.veterinarinary.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import com.example.veterinarinary.DTO.specialtyDTO;
import com.example.veterinarinary.DTO.responseDTO;
import com.example.veterinarinary.model.specialty;
import com.example.veterinarinary.repository.ispecialty;

@Service
public class specialtyService {

    @Autowired
    private ispecialty data;

    // Guardar (Registrar y Actualizar)
    public responseDTO save(specialtyDTO specialtyDTO) {
        // Validación antes de guardar
        if (specialtyDTO.getSpecialtyName() == null || specialtyDTO.getSpecialtyName().trim().isEmpty()) {
            return new responseDTO(HttpStatus.BAD_REQUEST.toString(), "El nombre de la especialidad no puede estar vacío");
        }

        // Guardar en la base de datos
        specialty specialtyRegister = convertToModel(specialtyDTO);
        data.save(specialtyRegister);
        return new responseDTO(HttpStatus.OK.toString(), "Especialidad guardada correctamente");
    }

    // Listar todas las especialidades
    public List<specialtyDTO> findAll() {
        List<specialty> specialties = data.findAll();
        return specialties.stream()
                     .map(this::convertToDTO)
                     .collect(Collectors.toList());
    }

    // Buscar por ID
    public Optional<specialtyDTO> findById(int id) {
        Optional<specialty> specialty = data.findById(id);
        return specialty.map(this::convertToDTO);
    }

    // Eliminar por ID
    public responseDTO deleteSpecialty(int id) {
        Optional<specialty> specialty = data.findById(id);
        if (!specialty.isPresent()) {
            return new responseDTO(HttpStatus.NOT_FOUND.toString(), "La especialidad no existe");
        }

        data.deleteById(id);
        return new responseDTO(HttpStatus.OK.toString(), "Especialidad eliminada correctamente");
    }

    // Convertir de Entidad a DTO
    public specialtyDTO convertToDTO(specialty specialty) {
        return new specialtyDTO(specialty.get_specialtyName());
    }

    // Convertir de DTO a Entidad
    public specialty convertToModel(specialtyDTO specialtyDTO) {
        return new specialty(
            0,  
            specialtyDTO.getSpecialtyName()
        );
    }
}
