package com.example.veterinarinary.DTO;

public class responseSpecialtyDTO {

    private int id;
    private String specialtyName;

    public responseSpecialtyDTO() {
    }

    public responseSpecialtyDTO(int id, String specialtyName) {
        this.id = id;
        this.specialtyName = specialtyName;
    }

    // Getter y Setter para specialtyName
    public String getSpecialtyName() {
        return specialtyName;
    }

    public void setSpecialtyName(String specialtyName) {
        this.specialtyName = specialtyName;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }
}