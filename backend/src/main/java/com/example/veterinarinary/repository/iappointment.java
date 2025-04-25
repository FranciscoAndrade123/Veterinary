package com.example.veterinarinary.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.veterinarinary.model.appointment;

public interface iappointment  extends JpaRepository
<appointment,Integer>{
    /*
     * C
     * R
     * U
     * D
     */

     //esta funcion es para obtener todos los clientes que esten activos 
     @Query("SELECT a FROM appointment a WHERE a.status = true")
     List<appointment> getListAppointmenttActive();

          //Para filtrar el estatus
          @Query("SELECT app FROM appointment app WHERE app.status = :status")
          List<appointment> findByStatus(@Param("status") boolean status);

     //Cambia el estado de la cita a inactivo
     @Modifying
    @Query("UPDATE appointment app SET app.status = false WHERE app.id = :id")
    void deactivateAppointment(@Param("id") int id);


}
