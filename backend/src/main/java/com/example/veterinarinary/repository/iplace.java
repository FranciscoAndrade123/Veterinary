package com.example.veterinarinary.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.veterinarinary.model.place;


public interface iplace extends JpaRepository
<place,Integer>{
        /*
     * C
     * R
     * U
     * D
     */
    
       //este funcion es para obtener mediante filtraciones el nombre de la sede

    @Query("SELECT pl FROM place pl WHERE pl.placeName LIKE %?1%")
    List<place> getListPlaceForName(String filter);
}