package com.example.veterinarinary.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity(name = "pet")
public class pet {

    // Clave primaria
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "petld") // Asegúrate de que el nombre coincida con la base de datos
    private int petID;

    // Nombre de la mascota
    @Column(name = "pet_name", length = 150, nullable = false) // Asegúrate de que el nombre coincida con la base de datos
    private String petName;

    // Relación ManyToOne con Client
    @ManyToOne
    @JoinColumn(name = "clientld", nullable = false) // Asegúrate de que el nombre coincida con la base de datos
    private client client;

    // Relación ManyToOne con Breed
    @ManyToOne
    @JoinColumn(name = "breedld", nullable = false) // Asegúrate de que el nombre coincida con la base de datos
    private breed breed;

    // Constructor vacío (necesario para JPA)
    public pet() {}

    // Constructor con parámetros
    public pet(String petName, client client, breed breed) {
        this.petName = petName;
        this.client = client;
        this.breed = breed;
    }

    // Getters y Setters
    public int getPetID() {
        return petID;
    }

    public void setPetID(int petID) {
        this.petID = petID;
    }

    public String getPetName() {
        return petName;
    }

    public void setPetName(String petName) {
        this.petName = petName;
    }

    public client getClient() {
        return client;
    }

    public void setClient(client client) {
        this.client = client;
    }

    public breed getBreed() {
        return breed;
    }

    public void setBreed(breed breed) {
        this.breed = breed;
    }
}