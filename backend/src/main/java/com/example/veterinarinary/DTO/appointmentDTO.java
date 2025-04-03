package com.example.veterinarinary.DTO;


import java.time.LocalDate;

public class appointmentDTO {

    private  LocalDate appointmentDate; // la fecha de la cita
    private int petID; // el id de la mascota
    private int veterinarianID; // el id del veterinario
    private int placeID; // el id del lugar

    public appointmentDTO() {} //Constructor vacio 

    //constructor con parametros
    public appointmentDTO (LocalDate appointmentDate, int petID, int veterinarianID, int placeID) {
        this.appointmentDate = appointmentDate;
        this.petID = petID;
        this.veterinarianID = veterinarianID;
        this.placeID = placeID;
    }

    // Getters y Setters
    public LocalDate getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(LocalDate appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public int getPetID() {
        return petID;
    }

    public void setPetID(int petID) {
        this.petID = petID;
    }

    public int getVeterinarianID() {
        return veterinarianID;
    }

    public int getPlaceID() {
        return placeID;
    }

    public void setVeterinarianID(int veterinarianID) {
        this.veterinarianID = veterinarianID;
    }
    
}
