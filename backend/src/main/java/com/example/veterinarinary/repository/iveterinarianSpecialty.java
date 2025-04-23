package com.example.veterinarinary.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.veterinarinary.model.veterinarianSpecialty;

public interface  iveterinarianSpecialty extends JpaRepository
<veterinarianSpecialty,Integer>{

     /*
     * C
     * R
     * U
     * D
     */

     @Query("SELECT vs FROM veterinarianSpecialty vs " +
       "JOIN vs.veterinarianID v " +
       "WHERE v.veterinarianName LIKE %?1%")
List<veterinarianSpecialty> findByVeterinarianName(
    @Param("veterinarianName") String veterinarianName
);
    
}