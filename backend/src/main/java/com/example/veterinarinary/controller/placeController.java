package com.example.veterinarinary.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.RestController;
import com.example.veterinarinary.DTO.placeDTO;
import com.example.veterinarinary.DTO.responsePlaceDTO;
import com.example.veterinarinary.DTO.responseDTO;
import com.example.veterinarinary.service.placeService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/place")
public class placeController {

    @Autowired
    private placeService placeService;

    @PostMapping("/")
    public ResponseEntity<Object> createPlace(@RequestBody placeDTO placeDTO) {
        responseDTO response = placeService.save(placeDTO);
        HttpStatus status = response.getStatus().equals(HttpStatus.OK.toString()) ? HttpStatus.OK : HttpStatus.OK;
        return new ResponseEntity<>(response, status);
    }

    @GetMapping("/")
    public ResponseEntity<List<responsePlaceDTO>> getAllPlaces() {
        List<responsePlaceDTO> places = placeService.findAll();
        return new ResponseEntity<List<responsePlaceDTO>>(places, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getPlaceById(@PathVariable int id) {
        Optional<placeDTO> place = placeService.findById(id);
        return place.isPresent()
            ? new ResponseEntity<>(place.get(), HttpStatus.OK)
            : new ResponseEntity<>(new responseDTO(HttpStatus.NOT_FOUND.toString(), "El lugar no existe"), HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> updatePlace(@PathVariable int id, @RequestBody placeDTO placeDTO) {
        responseDTO response = placeService.updatePlace(id,placeDTO);
        HttpStatus status = response.getStatus().equals(HttpStatus.OK.toString()) ? HttpStatus.OK : HttpStatus.OK;
        return new ResponseEntity<>(response, status);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deletePlace(@PathVariable int id) {
        responseDTO response = placeService.deletePlace(id);
        HttpStatus status = response.getStatus().equals(HttpStatus.OK.toString()) ? HttpStatus.OK : HttpStatus.OK;
        return new ResponseEntity<>(response, status);
    }

    @GetMapping("/filter/{filter}")
    public ResponseEntity<Object> getListPlaceForName(@PathVariable String filter) {
        var listaLugar = placeService.filterByName(filter);
        return new ResponseEntity<>(listaLugar, HttpStatus.OK);
    }
    
}
