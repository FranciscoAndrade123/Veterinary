package com.example.veterinarinary.DTO;

import com.example.veterinarinary.model.veterinarianSpecialty;

public class responseDTO {
    private String message;
    private String status;

    public responseDTO(String message, String status) {
        this.message = message;
        this.status = status;
    }

    public responseDTO(){}

    public responseDTO(String string, veterinarianSpecialty veterinarianSpecialty) {
        //TODO Auto-generated constructor stub
    }

    // getters and setters
    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }

    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
}
