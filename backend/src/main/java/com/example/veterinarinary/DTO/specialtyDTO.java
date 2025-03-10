package com.example.veterinarinary.DTO;

public class specialtyDTO {

    private String specialtyName;

    // Constructor vacío (necesario para JPA y frameworks)
    public specialtyDTO() {}

    // Constructor con parámetros
    public specialtyDTO(String specialtyName) {
        this.specialtyName = specialtyName;
    }

    // Getter y Setter para specialtyName
    public String getSpecialtyName() {
        return specialtyName;
    }

    public void setSpecialtyName(String specialtyName) {
        this.specialtyName = specialtyName;
    }
}