package com.example.veterinarinary.DTO;

public class placeDTO {
    private String placeName;

     // Constructor vacío (necesario para frameworks como Spring)
     public placeDTO() {}

      // Constructor con parámetros
     public placeDTO (String placeName){
      this.placeName = placeName;
    }

    //geter y seter
    public String getPlaceName() {
        return placeName;
    }

    public void setPlaceName(String placeName){
        this.placeName = placeName; 
    }


}
