package com.example.veterinarinary.DTO;




public class appointmentTreatmentDTO {

    private int id;
    private int appointmentID;
    private int treatmentID;

    //constructor vacio
    public appointmentTreatmentDTO() {}
    

    //constructor 
    public appointmentTreatmentDTO(int id, int appointmentID, int treatmentID) {
        this.id = id;
        this.appointmentID = appointmentID;
        this.treatmentID = treatmentID;
    }

    //setters y getters

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getAppointmentID() {
        return appointmentID;
    }

    public void setAppointmentID(int appointmentID) {
        this.appointmentID = appointmentID;
    }

    public int getTreatmentID() {
        return treatmentID;
    }

    public void setTreatmentID(int treatmentID) {
        this.treatmentID = treatmentID;
    }

}
