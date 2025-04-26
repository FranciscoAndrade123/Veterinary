package com.example.veterinarinary.service;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.veterinarinary.DTO.appointmentDTO;
import com.example.veterinarinary.DTO.responseDTO;
import com.example.veterinarinary.model.pet;
import com.example.veterinarinary.model.veterinarian;
import com.example.veterinarinary.model.place;
import com.example.veterinarinary.model.appointment;
import com.example.veterinarinary.repository.iappointment;
import com.example.veterinarinary.repository.iplace;
import com.example.veterinarinary.repository.ipet;
import com.example.veterinarinary.repository.iveterinarian;

import java.util.List;
import java.util.Optional;

@Service
public class appointmentService {
    
    @Autowired
    private iappointment appointmentRepository;
    
    @Autowired
    private iplace placeRepository;
    
    @Autowired
    private ipet petRepository;
    
    @Autowired
    private iveterinarian veterinarianRepository;
    
    // Guardar cita con validaciones
    @Transactional
    public responseDTO save(appointmentDTO appointmentDTO) {
        Optional<place> placeEntity = placeRepository.findById(appointmentDTO.getPlaceID());
        if (!placeEntity.isPresent()) {
            return new responseDTO("Lugar no encontrado", "error");
        }
        
        Optional<pet> petEntity = petRepository.findById(appointmentDTO.getPetID());
        if (!petEntity.isPresent()) {
            return new responseDTO("Mascota no encontrada", "error");
        }
        
        Optional<veterinarian> vetEntity = veterinarianRepository.findById(appointmentDTO.getVeterinarianID());
        if (!vetEntity.isPresent()) {
            return new responseDTO("Veterinario no encontrado", "error");
        }
        
        appointment appointmentEntity = new appointment();
        appointmentEntity.setAppointmentDate(appointmentDTO.getAppointmentDate());
        appointmentEntity.setPlace(placeEntity.get());
        appointmentEntity.setPet(petEntity.get());
        appointmentEntity.setVeterinarian(vetEntity.get());
        appointmentEntity.setStatus(true); // Asignar estado activo por defecto
        
        appointmentRepository.save(appointmentEntity);
        
        return new responseDTO("Cita registrada correctamente", "success");
    }
    
    // Buscar cita por ID
    public Optional<appointment> findById(int id) {
        return appointmentRepository.findById(id);
    }
    
    // Listar todas las citas
    public List<appointment> findAll() {
        return appointmentRepository.getListAppointmenttActive();
    }
    
    // Verificar si una cita existe
    public boolean existsById(int id) {
        return appointmentRepository.existsById(id);
    }
    

    // Eliminar cita por ID Funciona
    @Transactional
    public void deleteById(int id) {
        appointmentRepository.deactivateAppointment(id);
    }

    //Buscar las citas activas e inactivas
    public List<appointment> findByStatus(boolean status) {
         return appointmentRepository.findByStatus(status);
    }

      //Actilizar los datos de la entidad cita 
      @Transactional
      public responseDTO updateAppointment(int id, appointmentDTO appointmentDTO) {
        Optional<appointment> existingAppointment = appointmentRepository.findById(id);
      
        if (!existingAppointment.isPresent()) {
             return new responseDTO("Cita con ID " + id + " no encontrada", "error");
        }
      
          Optional<place> placeEntity = placeRepository.findById(appointmentDTO.getPlaceID());
          if (!placeEntity.isPresent()) {
              return new responseDTO("Lugar no encontrado", "error");
          }
      
          Optional<pet> petEntity = petRepository.findById(appointmentDTO.getPetID());
          if (!petEntity.isPresent()) {
              return new responseDTO("Mascota no encontrada", "error");
          }
      
          Optional<veterinarian> vetEntity = veterinarianRepository.findById(appointmentDTO.getVeterinarianID());
          if (!vetEntity.isPresent()) {
              return new responseDTO("Veterinario no encontrado", "error");
          }
      
          // Actualizar los datos de la cita existente
          appointment appointmentEntity = existingAppointment.get();
          appointmentEntity.setAppointmentDate(appointmentDTO.getAppointmentDate());
          appointmentEntity.setPlace(placeEntity.get());
          appointmentEntity.setPet(petEntity.get());
          appointmentEntity.setVeterinarian(vetEntity.get());
      
          appointmentRepository.save(appointmentEntity);
      
          return new responseDTO("Cita actualizada correctamente", "success");
      }

    
}