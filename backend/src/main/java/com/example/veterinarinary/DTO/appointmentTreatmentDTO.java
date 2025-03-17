package com.example.veterinarinary.DTO;

import com.example.veterinarinary.model.appointment;
import com.example.veterinarinary.model.treatment;


public class appointmentTreatmentDTO {

    private int id;
    private appointment appointmentID;
    private treatment treatmentId;

    //constructor vacio
    public appointmentTreatmentDTO() {}
    

    //constructor 
    public appointmentTreatmentDTO(int id, appointment appointmentID, treatment treatmentId) {
        this.id = id;
        this.appointmentID = appointmentID;
        this.treatmentId = treatmentId;
    }

    //setters y getters

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public appointment getAppointmentID() {
        return appointmentID;
    }

    public void setAppointmentID(appointment appointmentID) {
        this.appointmentID = appointmentID;
    }

    public treatment getTreatmentId() {
        return treatmentId;
    }

    public void setTreatmentId(treatment treatmentId) {
        this.treatmentId = treatmentId;
    }

}
