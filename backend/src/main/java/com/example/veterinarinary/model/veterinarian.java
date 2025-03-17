package com.example.veterinarinary.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;


@Entity (name="veterinian")

public class veterinarian {
    /*
     * atributos o columnas de la entidad
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="veterinarianID") 
    private int veterinarianID;

    @Column(name="veterinarianName",length = 200,nullable = false)
    private String veterinarianName ;

    //constructor vacio
    public veterinarian () {}

       //constructor
       public veterinarian (int veterinarianID,String veterinarianName  ){
        this.veterinarianID = veterinarianID;
        this.veterinarianName = veterinarianName;
     }

    //get del ID  
       public int get_veterinarianID() {
        return veterinarianID;
     }

     //set del ID 
     public void set_veterinarianID(int veterinarianID){
        this.veterinarianID=veterinarianID;
     }

     //get del veterinarianName  
    public String get_veterinarianName() {
        return veterinarianName;
       }
      
       //set del veterinarianName 
      public void set_veterinarianName(String veterinarianName){
           this.veterinarianName=veterinarianName;
       }


}
