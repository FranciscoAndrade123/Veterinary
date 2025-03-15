package com.example.veterinarinary.DTO;



import com.example.veterinarinary.model.breed;
import com.example.veterinarinary.model.client;

public class petDTO {
    
    private String petName;
    private client clientID;
    private breed breedID;

    // Constructor vacío (necesario para frameworks como Spring)
    public petDTO() {}

    // Constructor con parámetros
    public petDTO(String petName, client clientID, breed breedID) {
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

    public client getClientID() {
        return  clientID;
    }

    public void setClientID(client clientID) {
        this.clientID = clientID;
    }

    public breed getBreedID() {
        return breedID;
    }

    public void setBreedID(breed breedID) {
        this.breedID = breedID;
    }
}
