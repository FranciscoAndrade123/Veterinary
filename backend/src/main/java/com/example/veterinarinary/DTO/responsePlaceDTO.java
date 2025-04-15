package com.example.veterinarinary.DTO;

public class responsePlaceDTO {

    private int id;
    private String placeName;

    public responsePlaceDTO() {
    }

    public responsePlaceDTO(int id, String placeName) {
        this.id = id;
        this.placeName = placeName;
    }

    // Getter y Setter para placeName
    public String getPlaceName() {
        return placeName;
    }

    public void setPlaceName(String placeName) {
        this.placeName = placeName;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }
    
}
