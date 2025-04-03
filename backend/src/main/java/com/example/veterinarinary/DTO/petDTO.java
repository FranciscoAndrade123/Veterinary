package com.example.veterinarinary.DTO;



//import com.example.veterinarinary.model.breed;
//import com.example.veterinarinary.model.client;

public class petDTO {
    
    private String petName;
    private int clientID;  // Solo el ID del cliente
    private int breedID;   // Solo el ID de la raza

    // Constructor vacío (necesario para frameworks como Spring)
    public petDTO() {}

    // Constructor con parámetros
    public petDTO(String petName, int clientID, int breedID) {
        this.petName = petName;
        this.clientID = clientID;
        this.breedID = breedID;
    }

    // Getters y Setters
    public String getPetName() {
        return petName;
    }

    public void setPetName(String petName) {
        this.petName = petName;
    }

    public int getClientID() {
        return clientID;
    }

    public void setClientID(int clientID) {
        this.clientID = clientID;
    }

    public int getBreedID() {
        return breedID;
    }

    public void setBreedID(int breedID) {
        this.breedID = breedID;
    }
}
