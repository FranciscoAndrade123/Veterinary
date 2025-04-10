package com.example.veterinarinary.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.veterinarinary.model.specialty;

import java.util.List;



public interface ispecialty extends JpaRepository<specialty, Integer> {
       /*
     * C
     * R
     * U
     * D
     */

       //este funcion es para obtener mediante filtraciones el nombre de la especialidad

    @Query("SELECT es FROM specialty es WHERE es.specialtyName LIKE %?1%")
    List<specialty> getListSpecialtyForName(String filter);
}