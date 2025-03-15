package com.example.veterinarinary.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity(name = "place")
public class place {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "placeID")
    private int placeID; 
    
    @Column(name = "placeName", length = 50, nullable = false)
    private String placeName;

     // Constructor vacío (necesario para JPA)
     public place() {}

    // Constructor con parámetros
    public place(int placeID, String placeName) {
    this.placeID = placeID;
    this.placeName = placeName;
    }

      // Getters y Setters
      public int getPlaceID() {
        return placeID;
      }

      public void setPlaceID(int placeID) {
        this.placeID = placeID;
      }

      public String getPlaceName() {
        return placeName;
      }

      public void setPlaceName(String placeName) {
        this.placeName = placeName;
      }

    
}
