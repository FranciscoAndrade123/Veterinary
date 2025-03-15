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

        //buscar todos los registros

        public List <client> findAll(){ 
            return data.findAll();
        }

        //busca mediante el id
        public Optional<client> findById(int id) {
            return data.findById(id);
        }

        public responseDTO deleteClient(int id) {
            if (!findById(id).isPresent()) {
                responseDTO respuesta = new responseDTO(
                        HttpStatus.OK.toString(),
                        "The register does not exist");
                return respuesta;
            }
            data.deleteById(id);
            responseDTO respuesta = new responseDTO(
                    HttpStatus.OK.toString(),
                    "Se eliminó correctamente");
            return respuesta;
        }
    

        


    }   