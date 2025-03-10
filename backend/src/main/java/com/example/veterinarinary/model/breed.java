package com.example.veterinarinary.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity(name = "breed")
public class breed {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_breed")
    private int breedID;

    @Column(name = "breedName", length = 50, nullable = false)
    private String breedName;

    @Column(name = "characteristic", length = 150, nullable = false)
    private String characteristic;

    // Constructor vacío (necesario para JPA)
    public breed() {}

    // Constructor con parámetros
    public breed(int breedID, String breedName, String characteristic) {
        this.breedID = breedID;
        this.breedName = breedName;
        this.characteristic = characteristic;
    }

    // Getters y Setters (camelCase)
    public int getBreedID() {
        return breedID;
    }

    public void setBreedID(int breedID) {
        this.breedID = breedID;
    }

    public String getBreedName() {
        return breedName;
    }

    public void setBreedName(String breedName) {
        this.breedName = breedName;
    }

    public String getCharacteristic() {
        return characteristic;
    }

    public void setCharacteristic(String characteristic) {
        this.characteristic = characteristic;
    }
}