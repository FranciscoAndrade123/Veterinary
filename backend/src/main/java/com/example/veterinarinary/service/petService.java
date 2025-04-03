package com.example.veterinarinary.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.veterinarinary.DTO.petDTO;
import com.example.veterinarinary.model.breed;
import com.example.veterinarinary.model.client;
import com.example.veterinarinary.model.pet;
import com.example.veterinarinary.repository.ibreed;
import com.example.veterinarinary.repository.iclient;
import com.example.veterinarinary.repository.ipet;
import java.util.List;
import java.util.Optional;

@Service
public class petService {
    @Autowired
    private ipet petRepository;
    
    @Autowired
    private iclient clientRepository;
    
    @Autowired
    private ibreed breedRepository;
    
    // Guardar mascota
    @Transactional
    public pet save(petDTO petDTO) {
        pet petEntity = convertToModel(petDTO);
        return petRepository.save(petEntity);
    }
    
    // Convertir de DTO a modelo
    public pet convertToModel(petDTO petDTO) {
        // Buscar client y breed en la base de datos
        client clientEntity = clientRepository.findById(petDTO.getClientID())
            .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        
        breed breedEntity = breedRepository.findById(petDTO.getBreedID())
            .orElseThrow(() -> new RuntimeException("Raza no encontrada"));
        
        return new pet(
            petDTO.getPetName(),
            clientEntity, // Asignar objeto completo de Client
            breedEntity   // Asignar objeto completo de Breed
        );
    }
    
    // Buscar mascota por ID
    public Optional<pet> findById(int id) {
        return petRepository.findById(id);
    }
    
    // Obtener todas las mascotas
    public List<pet> findAll() {
        return petRepository.findAll();
    }
    
    // Eliminar mascota por ID
    @Transactional
    public void deleteById(int id) {
        petRepository.deleteById(id);
    }
    
    // Verificar si una mascota existe por ID
    public boolean existsById(int id) {
        return petRepository.existsById(id);
    }
}