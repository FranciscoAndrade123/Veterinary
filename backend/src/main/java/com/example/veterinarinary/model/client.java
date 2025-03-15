package com.example.veterinarinary.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity (name="client")

public class client {
    /*
     * atributos o columnas de la entidad
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="clientID ") 
    private int clientID ;

    @Column(name="clientName",length = 200,nullable = false)
    private String clientName;

    @Column(name="phone ",length = 15,nullable = false)
    private String phone ;

    public client () {};
    //constructor
    public client (int clientID,String clientName ,String phone ){
        this.clientID = clientID;
        this.clientName = clientName;
        this.phone = phone;
     }

    //set del ID 
      public void setId_client(int clientID){
        this.clientID=clientID;
     }

    //get del ID   
    public int getId_client() {
        return clientID;
    }

     // Getter y Setter para clientName
     public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    // Getter y Setter para phone
    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    
      

     
}
