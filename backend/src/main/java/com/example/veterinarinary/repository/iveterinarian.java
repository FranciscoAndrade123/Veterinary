package com.example.veterinarinary.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.veterinarinary.model.veterinarian;


public interface  iveterinarian extends JpaRepository
<veterinarian,Integer>{

     /*
     * C
     * R
     * U
     * D
     */

     
     //este funcion es para obtener mediante filtraciones el nombre del tratamiento 
     @Query("SELECT vet FROM veterinian vet WHERE vet.veterinarianName LIKE %?1%")
    List<veterinarian> getListVeterinarianForName(String filter);
    
}