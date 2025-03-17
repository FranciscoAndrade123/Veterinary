package com.example.veterinarinary.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity(name = "veterinarianSpecialty")
public class veterinarianSpecialty {

    // Clave primaria de la tabla pivote
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id") 
    private int id;

    @ManyToOne
    @JoinColumn(name = "veterinarianID", nullable = false)
    private veterinarian veterinarianID;

    @ManyToOne
    @JoinColumn(name = "specialtyID", nullable = false)
    private specialty specialtyID;

    //constructor vacio
    public veterinarianSpecialty(){

    }

    //constructor
    public veterinarianSpecialty (int id , veterinarian veterinarianID , specialty specialtyID ){
        this.id=id;
        this.veterinarianID= veterinarianID;
        this.specialtyID=specialtyID;
    }

    //setters y geters

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public veterinarian getVeterinarianID() {
        return veterinarianID;
    }

    public void setVeterinarianID(veterinarian veterinarianID) {
        this.veterinarianID = veterinarianID;
    }

    public specialty getSpecialtyID() {
        return specialtyID;
    }

    public void setSpecialtyID(specialty specialtyID) {
        this.specialtyID = specialtyID;
    }

    
}
