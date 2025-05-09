package com.example.veterinarinary.service;

    import java.util.List;
    import java.util.Optional;

    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.HttpStatus;
    import org.springframework.stereotype.Service;
    import com.example.veterinarinary.DTO.clientDTO;
    import com.example.veterinarinary.model.client;
    import com.example.veterinarinary.DTO.responseDTO; // importacion del Response DTO
    import com.example.veterinarinary.repository.iclient; // importacion de la interfaz

import jakarta.transaction.Transactional;
    

    @Service
    public class clientService {


        /*
        * save
        * findAll
        * findById
        * Delete
        */
        /* establish connection with the interface */

        @Autowired
        private iclient data;


 // register and update
 public responseDTO save(clientDTO clientDTO) {
    // Validation for client name (empty or exceeds length)
    if (clientDTO.getclientName() == null || 
            clientDTO.getclientName().trim().isEmpty() ||
            clientDTO.getclientName().length() > 150) {
        responseDTO respuesta = new responseDTO(
                HttpStatus.BAD_REQUEST.toString(),
                "El nombre del cliente no puede estar vacío y debe tener máximo 150 caracteres");
        return respuesta;
    }

    // Validation for phone number (must be numeric only)
    String phone = clientDTO.getphone();
    if (phone == null || !phone.matches("\\d+")) {
        responseDTO respuesta = new responseDTO(
                HttpStatus.BAD_REQUEST.toString(),
                "El número de teléfono debe contener solo dígitos numéricos");
        return respuesta;
    }
    
    // If validations pass, proceed with saving
    client clientRegister = converToModel(clientDTO);
    data.save(clientRegister);
    responseDTO respuesta = new responseDTO(
            HttpStatus.OK.toString(),
            "Se guardó correctamente");
    return respuesta;
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
                clientDTO.getphone()  ,      // Método corregido
                true // se agregó el status del cliente 
            );
        }

        //buscar todos los registros
        public List <client> findAll(){ 
            return data.getListClientActive();
        }

        //función de filtrar
        public List <client> getListClientForName(String filter){
             return data.getListClientForName(filter);
        }

        //busca mediante el id
        public Optional<client> findById(int id) {
            return data.findById(id);
        }

        //Actualizar el registro mediante el id
        @Transactional
        public responseDTO updateClient(int id, clientDTO clientDTO) {
            client clientUpdate = data.findById(id).orElse(null);
            if (clientUpdate == null) {
                return new responseDTO(
                        HttpStatus.NOT_FOUND.toString(),
                        "El registro no existe");
            }
            clientUpdate.setClientName(clientDTO.getclientName());
            clientUpdate.setPhone(clientDTO.getphone());
            data.save(clientUpdate);
            return new responseDTO(
                    HttpStatus.OK.toString(),
                    "El cliente se actualizó correctamente");
                    
        }





        //Eliminar el registro mediante el id
        @Transactional
        public responseDTO deleteClient(int id) {
            Optional<client> cliente = findById(id);
            if (!cliente.isPresent()) {
                return new responseDTO(
                        HttpStatus.NOT_FOUND.toString(),
                        "El registro no existe");
            }
        
            // Cambiar el estado del cliente a inactivo
            data.deactivateClient(id);
        
            return new responseDTO(
                    HttpStatus.OK.toString(),
                    "El cliente se desactivó correctamente");
        }

        public List<client> getClientsByStatus(boolean status) {
            return data.findByStatus(status);
        }

    }