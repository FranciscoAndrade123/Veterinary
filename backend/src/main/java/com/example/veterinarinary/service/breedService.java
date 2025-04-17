package com.example.veterinarinary.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import com.example.veterinarinary.DTO.breedDTO;
import com.example.veterinarinary.DTO.responseBreedDTO;
import com.example.veterinarinary.DTO.responseDTO;
import com.example.veterinarinary.model.breed;
import com.example.veterinarinary.repository.ibreed;

@Service
public class breedService {

    @Autowired
    private ibreed data;

    // Guardar (Registrar y Actualizar)
    public responseDTO save(breedDTO breedDTO) {
        // Validaciones antes de guardar
        if (breedDTO.getBreedName() == null || breedDTO.getBreedName().trim().isEmpty()) {
            return new responseDTO(HttpStatus.BAD_REQUEST.toString(), "El nombre de la raza no puede estar vacío");
        }
        if (breedDTO.getCharacteristic() == null || breedDTO.getCharacteristic().trim().isEmpty()) {
            return new responseDTO(HttpStatus.BAD_REQUEST.toString(), "La característica no puede estar vacía");
        }

        // Guardar la raza en la base de datos
        breed breedRegister = converToModel(breedDTO);
        data.save(breedRegister);
        return new responseDTO(HttpStatus.OK.toString(), "Raza guardada correctamente");
    }

    // Listar todas las razas
    public List<responseBreedDTO> findAll() {
        List<breed> breeds = data.findAll();
        return breeds.stream()
                     .map(this::convertToResponseDTO)
                     .collect(Collectors.toList());
    }

    // Buscar por ID
    public Optional<breedDTO> findById(int id) {
        Optional<breed> breed = data.findById(id);
        return breed.map(this::convertToDTO);
    }

    // Eliminar por ID
    public responseDTO deleteBreed(int id) {
        Optional<breed> breed = data.findById(id);
        if (!breed.isPresent()) {
            return new responseDTO(HttpStatus.NOT_FOUND.toString(), "La raza no existe");
        }

        data.deleteById(id);
        return new responseDTO(HttpStatus.OK.toString(), "Raza eliminada correctamente");
    }

    // Actualizar por ID
    public responseDTO updateBreed(int id, breedDTO breedDTO) {
        Optional<breed> breed = data.findById(id);
        if (!breed.isPresent()) {
            return new responseDTO(HttpStatus.NOT_FOUND.toString(), "La raza no existe");
        }
        breed existingBreed = breed.get();
        existingBreed.setBreedName(breedDTO.getBreedName());
        existingBreed.setCharacteristic(breedDTO.getCharacteristic());
        data.save(existingBreed);

        return new responseDTO(HttpStatus.OK.toString(), "Raza actualizada correctamente");
    }

    //filtrar el nombre de la mascota
    public List<breed> getListBreedForName(String filter){
        return data.getListBreedForName(filter);
    }

    // Convertir de Entidad a DTO
    public breedDTO convertToDTO(breed breed) {
        return new breedDTO(
            breed.getBreedName(),
            breed.getCharacteristic()
        );
    }

    public responseBreedDTO convertToResponseDTO(breed breed) {
        return new responseBreedDTO(
            breed.getBreedID(),
            breed.getBreedName(),
            breed.getCharacteristic()
        );
    }

    // Convertir de DTO a Entidad
    public breed converToModel(breedDTO breedDTO) {
        return new breed(
            0,  
            breedDTO.getBreedName(),
            breedDTO.getCharacteristic()
        );
    }
}
