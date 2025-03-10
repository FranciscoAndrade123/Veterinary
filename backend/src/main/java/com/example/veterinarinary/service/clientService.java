package com.example.veterinarinary.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.veterinarinary.DTO.clientDTO;
import com.example.veterinarinary.model.client;
import com.example.veterinarinary.repository.iclient;

@Service
public class clientService {

    @Autowired
    private iclient data;

    // Método para guardar (Registrar y Actualizar)
    public void save(clientDTO clientDTO) {
        client userRegister = converToModel(clientDTO);
        data.save(userRegister);
    }

    // Convertir de Entidad a DTO
    public clientDTO convertToDTO(client client) {
        return new clientDTO(
            client.getClientName(),  // Método corregido
            client.getPhone()        // Método corregido
        );
    }

    // Convertir de DTO a Entidad
    public client converToModel(clientDTO clientDTO) {
        return new client(
            0,  // ID, se generará automáticamente
            clientDTO.getclientName(),  // Método corregido
            clientDTO.getphone()        // Método corregido
        );
    }
}