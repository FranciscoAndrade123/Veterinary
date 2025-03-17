package com.example.veterinarinary.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.RestController;
import com.example.veterinarinary.DTO.placeDTO;
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
        HttpStatus status = response.getStatus().equals(HttpStatus.OK.toString()) ? HttpStatus.OK : HttpStatus.BAD_REQUEST;
        return new ResponseEntity<>(response, status);
    }

    @GetMapping("/")
    public ResponseEntity<List<placeDTO>> getAllPlaces() {
        return new ResponseEntity<>(placeService.findAll(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getPlaceById(@PathVariable int id) {
        Optional<placeDTO> place = placeService.findById(id);
        return place.isPresent()
            ? new ResponseEntity<>(place.get(), HttpStatus.OK)
            : new ResponseEntity<>(new responseDTO(HttpStatus.NOT_FOUND.toString(), "El lugar no existe"), HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deletePlace(@PathVariable int id) {
        responseDTO response = placeService.deletePlace(id);
        HttpStatus status = response.getStatus().equals(HttpStatus.OK.toString()) ? HttpStatus.OK : HttpStatus.NOT_FOUND;
        return new ResponseEntity<>(response, status);
    }
}
