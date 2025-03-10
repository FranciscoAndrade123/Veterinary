package com.example.veterinarinary.DTO;

public class veterinarianDTO {
    private String veterinarianName;

    // Constructor vacío (necesario para JPA y frameworks)
    public veterinarianDTO() {}

    // Constructor con parámetros
    public veterinarianDTO(String veterinarianName) {
        this.veterinarianName = veterinarianName;
    }

    // Getter y Setter para specialtyName
    public String getVeterinarianName() {
        return veterinarianName;
    }

    public void setVeterinarianName(String veterinarianName) {
        this.veterinarianName = veterinarianName;
    }
}
