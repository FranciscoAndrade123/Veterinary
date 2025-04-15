package com.example.veterinarinary.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


import com.example.veterinarinary.model.treatment ;


public interface itreatment  extends JpaRepository
<treatment,Integer >{
    /*
     * C
     * R
     * U
     * D
     */

     //este funcion es para obtener mediante filtraciones el nombre del tratamiento 
     @Query("SELECT tre FROM treatment tre WHERE tre.treatmentName LIKE %?1%")
    List<treatment> getListTreatmentForName(String filter);
}
