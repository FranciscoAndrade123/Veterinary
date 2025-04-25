package com.example.veterinarinary.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity(name = "appointment")
public class appointment {
    // Clave primaria
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "appointmentID") // Asegúrate de que el nombre coincida con la base de datos
    private int appointmentID;

    // Fecha de la cita
    @Column(name = "appointmentDate", nullable = false)
    private LocalDate appointmentDate;

    // Relación ManyToOne con pet
    @ManyToOne
    @JoinColumn(name = "petID", nullable = false) // Asegúrate de que el nombre coincida con la base de datos
    private pet pet;

    // Relación ManyToOne con veterinarian
    @ManyToOne
    @JoinColumn(name = "veterinarianID", nullable = false) // Asegúrate de que el nombre coincida con la base de datos
    private veterinarian veterinarian;

    // Relacion con place
    @ManyToOne 
    @JoinColumn (name = "placeID" , nullable = false )
    private place place;

    //estado de la cita
    @Column(name="status",nullable = false,  columnDefinition = "boolean default true ")
    private boolean status ;
    

    // Constructor vacío (necesario para JPA)
    public appointment() {}

    // Constructor con parámetros
    public appointment(LocalDate appointmentDate, pet pet, veterinarian veterinarian, place place ,boolean status) {
        this.appointmentDate = appointmentDate;
        this.pet = pet;
        this.veterinarian = veterinarian;
        this.place = place;
        this.status = status;
    }

    // Getters y Setters
    public int getAppointmentID() {
        return appointmentID;
    }

    public void setAppointmentID(int appointmentID) {
        this.appointmentID = appointmentID;
    }

    public LocalDate getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(LocalDate appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public pet getPet() {
        return pet;
    }

    public void setPet(pet pet) {
        this.pet = pet;
    }

    public veterinarian getVeterinarian() {
        return veterinarian;
    }

    public void setVeterinarian(veterinarian veterinarian) {
        this.veterinarian = veterinarian;
    }

    public place getPlace(){
        return place;
    }

    public void setPlace(place place){
        this.place = place;
    }

    public boolean getStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }    



    
}
