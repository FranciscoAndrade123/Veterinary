package com.example.veterinarinary.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity(name = "treatment")
public class treatment {

    // Clave primaria
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "treatmentId") 
    private int treatmentId;

    // Nombre del tratamiento
    @Column(name = "treatmentName", length = 150, nullable = false)
    private String treatmentName;

    // Descripción del tratamiento
    @Column(name = "treatmentDescription", length = 250, nullable = false)
    private String treatmentDescription;

    // Constructor vacío (necesario para JPA)
    public treatment() {}

    // Constructor con parámetros
    public treatment(int treatmentId, String treatmentName, String treatmentDescription) {
        this.treatmentId = treatmentId;
        this.treatmentName = treatmentName;
        this.treatmentDescription = treatmentDescription;
    }

    // Getters y Setters
    public int getTreatmentId() {
        return treatmentId;
    }

    public void setTreatmentId(int treatmentId) {
        this.treatmentId = treatmentId;
    }

    public String getTreatmentName() {
        return treatmentName;
    }

    public void setTreatmentName(String treatmentName) {
        this.treatmentName = treatmentName;
    }

    public String getTreatmentDescription() {
        return treatmentDescription;
    }

    public void setTreatmentDescription(String treatmentDescription) {
        this.treatmentDescription = treatmentDescription;
    }
}
