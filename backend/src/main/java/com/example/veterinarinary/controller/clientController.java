package com.example.veterinarinary.controller;

import org.springframework.web.bind.annotation.RestController;
import com.example.veterinarinary.DTO.clientDTO;
import com.example.veterinarinary.service.clientService;
import com.example.veterinarinary.DTO.responseDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/api/v1/client")
public class clientController {



    @Autowired
    private clientService clientService;

    @PostMapping("/")
    public ResponseEntity<Object> registerUser(@RequestBody clientDTO clientDTO) {
        try {
            // Utiliza el método save modificado que devuelve responseDTO
            responseDTO response = clientService.save(clientDTO);
            
            // Determina el HttpStatus basado en el status del responseDTO
            HttpStatus httpStatus = response.getStatus().equals(HttpStatus.OK.toString()) 
                ? HttpStatus.OK 
                : HttpStatus.BAD_REQUEST;
            
            // Devuelve el responseDTO completo con el status HTTP apropiado
            return new ResponseEntity<>(response, httpStatus);
        } catch (Exception e) {
            // En caso de excepción, crea un responseDTO de error
            responseDTO errorResponse = new responseDTO(
                "Error: " + e.getMessage(),
                HttpStatus.INTERNAL_SERVER_ERROR.toString());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/")
    public ResponseEntity<Object> getAllClient() {
        var listaCliente = clientService.findAll();
        return  new  ResponseEntity <>(listaCliente,HttpStatus.OK);
       // return new ResponseEntity<>(listaCliente.findAll(), HttpStatus.OK);
    }

     /*
     * Se requiere un dato, el ID
     * PathVariable=captura de información por la URL
     */

     @GetMapping("/{id}")
     public ResponseEntity<Object> getClientById(@PathVariable int id) {
        var cliente = clientService.findById(id);
        if (cliente.isPresent())
        return new ResponseEntity<>(cliente.get(), HttpStatus.OK);
        return new ResponseEntity<>(cliente, HttpStatus.OK);

     }

     @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteUser(@PathVariable int id) {
        var message= clientService.deleteClient(id);
        
        return new ResponseEntity<>(message, HttpStatus.OK);
    }
}