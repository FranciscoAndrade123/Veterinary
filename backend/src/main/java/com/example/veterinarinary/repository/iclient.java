package com.example.veterinarinary.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

import com.example.veterinarinary.model.client;

public interface  iclient extends JpaRepository
<client,Integer>{

     /*
     * C
     * R
     * U
     * D
     */
     //esta funcion es para obtener todos los clientes que esten activos 
     @Query("SELECT cl FROM client cl WHERE cl.status != false")
     List<client> getListClientActive();


    
    @Query("SELECT cl FROM client cl WHERE cl.clientName LIKE %?1%")
    List<client> getListClientForName(String filter);
     


    
}
