package com.example.veterinarinary.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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


    //este funcion es para obtener mediante filtraciones el nombre del cliente
    @Query("SELECT cl FROM client cl WHERE cl.clientName LIKE %?1%")
    List<client> getListClientForName(String filter);

    @Modifying
        @Query("UPDATE client c SET c.status = false WHERE c.id = :id")
        void deactivateClient(@Param("id") int id);
     
    @Query("SELECT c FROM client c WHERE c.status = :status")
    List<client> findByStatus(@Param("status") boolean status);

    
}
