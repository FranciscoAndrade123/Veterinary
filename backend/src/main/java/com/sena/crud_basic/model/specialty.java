package com.sena.crud_basic.model;

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
    @Column(name="id_specialty") 
    private int id_specialty;

    @Column(name="specialtyName",length = 100,nullable = false)
    private String specialtyName;

    //constructor
    public specialty (int id_specialty,String specialtyName ){
        this.id_specialty = id_specialty;
        this.specialtyName = specialtyName;
       
     }

     //get del ID  
     public int getId_specialty() {
        return id_specialty;
     }

     //set del ID 
     public void setId_specialty(int id_specialty){
        this.id_specialty=id_specialty;
     }

    //get del firstName  
    public String get_specialtyName () {
      return specialtyName;
     }
    
     //set del firstName 
    public void set_specialtyName (String specialtyName ){
         this.specialtyName =specialtyName ;
     }

}
