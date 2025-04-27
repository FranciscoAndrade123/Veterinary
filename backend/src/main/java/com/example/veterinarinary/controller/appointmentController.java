package com.example.veterinarinary.controller;

import com.example.veterinarinary.DTO.responseDTO;
import com.example.veterinarinary.DTO.appointmentDTO;
import com.example.veterinarinary.service.appointmentService;
import com.example.veterinarinary.model.appointment;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/appointment")
public class appointmentController {
    
    @Autowired
    private appointmentService appointmentService;
    
    @PostMapping("/")
    public ResponseEntity<responseDTO> registerAppointment(@RequestBody appointmentDTO appointmentDTO) {
        try {
            responseDTO response = appointmentService.save(appointmentDTO);
            
            if (response.getStatus().equals("success")) {
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            responseDTO response = new responseDTO("Error: " + e.getMessage(), "error");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Obtener una cita por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getAppointmentById(@PathVariable int id) {
        try {
            Optional<appointment> appointmentOptional = appointmentService.findById(id);
            
            if (appointmentOptional.isPresent()) {
                return new ResponseEntity<>(appointmentOptional.get(), HttpStatus.OK);
            } else {
                responseDTO response = new responseDTO("Cita con ID " + id + " no encontrada", "error");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            responseDTO response = new responseDTO("Error al buscar cita: " + e.getMessage(), "error");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Listar todas las citas
    @GetMapping("/")
    public ResponseEntity<?> getAllAppointments() {
        try {
            List<appointment> appointments = appointmentService.findAll();
            return new ResponseEntity<>(appointments, HttpStatus.OK);
        } catch (Exception e) {
            responseDTO response = new responseDTO("Error al obtener citas: " + e.getMessage(), "error");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Eliminar una cita por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<responseDTO> deleteAppointment(@PathVariable int id) {
        try {
            if (appointmentService.existsById(id)) {
                appointmentService.deleteById(id);
                responseDTO response = new responseDTO("Cita eliminada correctamente", "success");
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                responseDTO response = new responseDTO("Cita con ID " + id + " no encontrada", "error");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            responseDTO response = new responseDTO("Error al eliminar cita: " + e.getMessage(), "error");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

        //Buscar el estados de las citas que esten activas e inactivas
        @GetMapping("/filter/{status}")
        public ResponseEntity<List<appointment>> filterByStatus(@PathVariable String status) {
            boolean isActive = status.equalsIgnoreCase("activo");
            List<appointment> appointments = appointmentService.findByStatus(isActive);
            return ResponseEntity.ok(appointments);
        }
          
    //Filtrar por el nombre de la mascota de la cita
     @GetMapping("/filterPetName/{petName}")
    public ResponseEntity<List<appointment>> filterByPetName(@PathVariable String petName) {
        List<appointment> appointments = appointmentService.findByPetName(petName);
        return ResponseEntity.ok(appointments);
    }


        //Actualizar la cita 
    @PutMapping("/{id}")
    public ResponseEntity<responseDTO> updateAppointment(@PathVariable int id,@RequestBody appointmentDTO appointmentDTO) {
    responseDTO response = appointmentService.updateAppointment(id, appointmentDTO);
    if (response.getStatus().equals("error")) {
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
    return new ResponseEntity<>(response, HttpStatus.OK);
}

}