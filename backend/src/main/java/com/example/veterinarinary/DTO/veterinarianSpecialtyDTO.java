package com.example.veterinarinary.DTO;

import com.example.veterinarinary.model.veterinarian;
import com.example.veterinarinary.model.specialty;

public class veterinarianSpecialtyDTO {

    private int id;
    private veterinarian veterinarianID;
    private specialty specialtyID;

    // constructo vacio 
    public veterinarianSpecialtyDTO (){}

    // constructor
    public veterinarianSpecialtyDTO(int id, veterinarian veterinarianID, specialty specialtyID) {
        this.id = id;
        this.veterinarianID = veterinarianID;
        this.specialtyID= specialtyID;
    }

    //getters y setters 

    public int getId() {
        return id;
    }

    public void setId(int id) {
       this.id = id;
    }

    public veterinarian getVeterinarianID() {
        return veterinarianID;
    }

    public void setVeterinarianID(veterinarian veterinarianID) {
        this.veterinarianID = veterinarianID;
    }

    public specialty getSpecialtyID() {
        return specialtyID;
    }

    public void setSpecialtyID(specialty specialtyID) {
        this.specialtyID = specialtyID;
    }


    
    
}
