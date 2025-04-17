package com.example.veterinarinary.controller;

import java.util.List;
import java.util.Optional;

import com.example.veterinarinary.DTO.breedDTO;
import com.example.veterinarinary.DTO.responseBreedDTO;
import com.example.veterinarinary.DTO.responseDTO;
import com.example.veterinarinary.service.breedService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/breed")
public class breedController {

    @Autowired
    private breedService breedService;

    @PostMapping("/")
    public ResponseEntity<Object> createBreed(@RequestBody breedDTO breedDTO) {
        responseDTO response = breedService.save(breedDTO);
        HttpStatus status = response.getStatus().equals(HttpStatus.OK.toString()) ? HttpStatus.OK : HttpStatus.OK;
        return new ResponseEntity<>(response, status);
    }

    @GetMapping("/")
    public ResponseEntity<List<responseBreedDTO>> getAllBreeds() {
        return new ResponseEntity<>(breedService.findAll(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getBreedById(@PathVariable int id) {
        Optional<breedDTO> breed = breedService.findById(id);
        return breed.isPresent()
            ? new ResponseEntity<>(breed.get(), HttpStatus.OK)
            : new ResponseEntity<>(new responseDTO(HttpStatus.NOT_FOUND.toString(), "La raza no existe"), HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteBreed(@PathVariable int id) {
        responseDTO response = breedService.deleteBreed(id);
        HttpStatus status = response.getStatus().equals(HttpStatus.OK.toString()) ? HttpStatus.OK : HttpStatus.OK;
        return new ResponseEntity<>(response, status);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> updateBreed(@PathVariable int id, @RequestBody breedDTO breedDTO) {
        responseDTO response = breedService.updateBreed(id, breedDTO);
        HttpStatus status = response.getStatus().equals(HttpStatus.OK.toString()) ? HttpStatus.OK : HttpStatus.OK;
        return new ResponseEntity<>(response, status);
    }

      @GetMapping("/filter/{filter}")
      public ResponseEntity<Object> getListClientForName(@PathVariable String filter) {
        var listaRaza = breedService.getListBreedForName(filter);
        return new ResponseEntity<>(listaRaza, HttpStatus.OK);
      }


}
