package com.example.veterinarinary.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import com.example.veterinarinary.DTO.veterinarianSpecialtyDTO;
import jakarta.transaction.Transactional;

import com.example.veterinarinary.DTO.responseDTO;
import com.example.veterinarinary.model.veterinarian;
import com.example.veterinarinary.model.specialty;
import com.example.veterinarinary.model.veterinarianSpecialty; // IMPORTANTE: Agregar la entidad pivote
import com.example.veterinarinary.repository.iveterinarian;
import com.example.veterinarinary.repository.ispecialty;
import com.example.veterinarinary.repository.iveterinarianSpecialty;

import java.util.List;
import java.util.Optional;

@Service
public class veterinarianSpecialtyService {

    @Autowired
    private iveterinarian veterinarianRepository;

    @Autowired
    private ispecialty specialtyRepository;

    @Autowired
    private iveterinarianSpecialty veterinarianSpecialtyRepository; // Repositorio de la tabla pivote

    // Guardar veterinario-especialidad con validaciones
    @Transactional
    public responseDTO save(veterinarianSpecialtyDTO veterinarianSpecialtyDTO) {
        Optional<veterinarian> vet = veterinarianRepository.findById(veterinarianSpecialtyDTO.getVeterinarianID());
        if (!vet.isPresent()) {
            return new responseDTO(HttpStatus.NOT_FOUND.toString(), "Veterinario con ID " + veterinarianSpecialtyDTO.getVeterinarianID() + " no encontrado.");
        }

        Optional<specialty> spec = specialtyRepository.findById(veterinarianSpecialtyDTO.getSpecialtyID());
        if (!spec.isPresent()) {
            return new responseDTO(HttpStatus.NOT_FOUND.toString(), "Especialidad con ID " + veterinarianSpecialtyDTO.getSpecialtyID() + " no encontrada.");
        }

        // Guardamos en la tabla pivote
        veterinarianSpecialty veterinarianSpecialtyRegister = new veterinarianSpecialty();
        veterinarianSpecialtyRegister.setVeterinarianID(vet.get());
        veterinarianSpecialtyRegister.setSpecialtyID(spec.get());

        veterinarianSpecialtyRepository.save(veterinarianSpecialtyRegister);

        return new responseDTO(HttpStatus.OK.toString(), "Veterinario-Especialidad registrada correctamente.");
    }



    public veterinarianSpecialty findById(int id) {
        return veterinarianSpecialtyRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Veterinario-Especialidad con ID " + id + " no encontrada."));
    }

    // Listar todas las relaciones
    public List<veterinarianSpecialty> findAll() {
        return veterinarianSpecialtyRepository.findAll();
    }

    // Actualizar relación por ID
    public responseDTO update(int id, veterinarianSpecialtyDTO veterinarianSpecialtyDTO) {
        Optional <veterinarianSpecialty> existingVeterinarianSpecialty = veterinarianSpecialtyRepository.findById(id);
        if (!existingVeterinarianSpecialty.isPresent()) {
            return new responseDTO(HttpStatus.NOT_FOUND.toString(), "Veterinario-Especialidad con ID " + id + " no encontrada.");
        }
        Optional<veterinarian> vet = veterinarianRepository.findById(veterinarianSpecialtyDTO.getVeterinarianID());
        if (!vet.isPresent()) {
            return new responseDTO(HttpStatus.NOT_FOUND.toString(), "Veterinario con ID " + veterinarianSpecialtyDTO.getVeterinarianID() + " no encontrado.");
        }
        Optional<specialty> spec = specialtyRepository.findById(veterinarianSpecialtyDTO.getSpecialtyID());
        if (!spec.isPresent()) {
            return new responseDTO(HttpStatus.NOT_FOUND.toString(), "Especialidad con ID " + veterinarianSpecialtyDTO.getSpecialtyID() + " no encontrada.");
        }
    ;
        // Actualizamos la relación en la tabla pivote
        veterinarianSpecialty veterinarianSpecialtyUpdate = existingVeterinarianSpecialty.get();
        veterinarianSpecialtyUpdate.setVeterinarianID(vet.get());
        veterinarianSpecialtyUpdate.setSpecialtyID(spec.get());

        veterinarianSpecialtyRepository.save(veterinarianSpecialtyUpdate);

        return new responseDTO(HttpStatus.OK.toString(), "Veterinario-Especialidad actualizada correctamente.");
    }


    // Eliminar relación por ID
    @Transactional
    public responseDTO deleteById(int id) {
        if (!veterinarianSpecialtyRepository.existsById(id)) {
            return new responseDTO(HttpStatus.NOT_FOUND.toString(), "Veterinario-Especialidad con ID " + id + " no encontrada.");
        }

        veterinarianSpecialtyRepository.deleteById(id);
        return new responseDTO(HttpStatus.OK.toString(), "Veterinario-Especialidad eliminada correctamente.");
    }
}
