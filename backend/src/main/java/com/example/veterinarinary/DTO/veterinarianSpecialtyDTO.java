package com.example.veterinarinary.DTO;

public class veterinarianSpecialtyDTO {

    private int id;
    private int veterinarianID;  // Solo almacenar el ID
    private int specialtyID;     // Solo almacenar el ID

    // Constructor vacío
    public veterinarianSpecialtyDTO() {}

    // Constructor
    public veterinarianSpecialtyDTO(int id, int veterinarianID, int specialtyID) {
        this.id = id;
        this.veterinarianID = veterinarianID;
        this.specialtyID = specialtyID;
    }

    // Getters y Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getVeterinarianID() {
        return veterinarianID;
    }

    public void setVeterinarianID(int veterinarianID) {
        this.veterinarianID = veterinarianID;
    }

    public int getSpecialtyID() {
        return specialtyID;
    }

    public void setSpecialtyID(int specialtyID) {
        this.specialtyID = specialtyID;
    }
}
