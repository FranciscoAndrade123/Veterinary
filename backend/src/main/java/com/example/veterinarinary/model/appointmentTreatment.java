package com.example.veterinarinary.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;


@Entity(name = "appointmentTreatment")
public class appointmentTreatment {

    // Clave primaria de la tabla pivote
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id") 
    private int id;

    @ManyToOne
    @JoinColumn(name = "appointmentID", nullable = false)
    private appointment appointmentID;

    @ManyToOne
    @JoinColumn(name = "treatmentId", nullable = false)
    private treatment treatmentId;

    // constructo vacio
    public appointmentTreatment (){}

    //constructor

    public appointmentTreatment (int id, appointment appointmentID, treatment treatmentId) {
        this.id= id;
        this.appointmentID = appointmentID;
        this.treatmentId = treatmentId;
    }

      //setters y geters

      public int getId(){
        return this.id;
      }

      public void setId(int id){
        this.id = id;
      }

      public appointment getAppointmentID(){
        return this.appointmentID;
      }

      public void setAppointmentID(appointment appointmentID){
        this.appointmentID = appointmentID;
      }

      public treatment getTreatmentId(){
        return this.treatmentId;
      }

      public void setTreatmentId(treatment treatmentId){
        this.treatmentId = treatmentId;
      }

      
}
