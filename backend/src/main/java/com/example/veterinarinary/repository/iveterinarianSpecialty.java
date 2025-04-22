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
     "JOIN vs.specialtyID s " +
     "WHERE (:veterinarianName IS NULL OR v.veterinarianName LIKE %:veterinarianName%) " +
     "AND (:specialtyName IS NULL OR s.specialtyName LIKE %:specialtyName%)")
List<veterinarianSpecialty> findByFilters(
  @Param("veterinarianName") String veterinarianName,
  @Param("specialtyName") String specialtyName
);
    
}