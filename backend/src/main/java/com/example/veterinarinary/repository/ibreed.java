package com.example.veterinarinary.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


import java.util.List;

import com.example.veterinarinary.model.breed;


public interface  ibreed extends JpaRepository
<breed,Integer>{

     /*
     * C
     * R
     * U
     * D
     */
    
      //este funcion es para obtener mediante filtraciones el nombre del cliente
      /*
       @Query("SELECT cl FROM client cl WHERE cl.clientName LIKE %?1%")
       List<client> getListClientForName(String filter);
       */

       @Query ("SELECT br FROM breed br WHERE br.breedName  LIKE %?1% ")
       List<breed> getListBreedForName(String filter);
}