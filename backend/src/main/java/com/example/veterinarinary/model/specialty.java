package com.example.veterinarinary.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity (name="specialty")

public class specialty {
    /*
     * atributos o columnas de la entidad
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="specialtyID") 
    private int specialtyID;

    @Column(name="specialtyName",length = 100,nullable = false)
    private String specialtyName ;

    // constructo vacio

    public specialty() {}

     //constructor
     public specialty (int specialtyID,String specialtyName  ){
        this.specialtyID = specialtyID;
        this.specialtyName = specialtyName;
     }

      //get del ID  
      public int get_specialtyID() {
        return specialtyID;
     }

     //set del ID 
     public void set_specialtyID(int specialtyID){
        this.specialtyID=specialtyID;
     }

    //get del specialtyName  
    public String get_specialtyName() {
      return specialtyName;
     }
    
     //set del specialtyName 
    public void set_specialtyName(String specialtyName){
         this.specialtyName=specialtyName;
     }
}
