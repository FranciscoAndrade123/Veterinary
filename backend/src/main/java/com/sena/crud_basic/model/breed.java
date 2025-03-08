package com.sena.crud_basic.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;


@Entity (name="breed")

public class breed {
    /*
     * atributos o columnas de la entidad
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id_breed") 
    private int breedID;

    @Column(name="breedName",length = 50,nullable = false)
    private String breedName;

    @Column(name="characteristic",length = 150,nullable = false)
    private String characteristic;

    //constructor
    public breed (int breedID,String breedName ,String characteristic ){
        this.breedID = breedID;
        this.breedName = breedName;
        this.characteristic = characteristic;
     }

     //get del ID  
     public int getId_breed() {
        return breedID;
     }

     //set del ID 
     public void setId_breed(int breedID){
        this.breedID=breedID;
     }

    //get del firstName  
    public String get_breedName() {
      return breedName;
     }
    
     //set del firstName 
    public void set_breedName(String breedName){
         this.breedName=breedName;
     }

      //get del phone  
    public String get_characteristic() {
        return characteristic;
       }
      
     //set del phone 
    public void set_characteristic(String characteristic){
       this.characteristic=characteristic;
    }


}
