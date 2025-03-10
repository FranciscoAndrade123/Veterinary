package com.example.veterinarinary.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity(name = "appointment")
public class appointment {
    // Clave primaria
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "appointmentld") // Asegúrate de que el nombre coincida con la base de datos
    private int appointmentld;

    
    // Fecha de la cita
    @Column(name = "appointmentDate", nullable = false) //
    private LocalDate  appointmentDate;
}
