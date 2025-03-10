package com.example.veterinarinary.DTO;

public class breedDTO {
    private String breedName;
    private String characteristic;

    public breedDTO(String breedName, String characteristic) {
        this.breedName = breedName;
        this.characteristic = characteristic;
    }

    // Getters y Setters (camelCase)
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