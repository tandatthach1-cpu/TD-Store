package com.daohuybac.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.daohuybac.backend.dto.AddressDTO;
import com.daohuybac.backend.service.AddressService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
@SecurityRequirement(name = "E-Commerce Application")
public class AddressController {

    @Autowired
    private AddressService addressService;

    @PostMapping("/address")
public ResponseEntity<AddressDTO> createAddress(@Valid @RequestBody AddressDTO addressDTO) {
    AddressDTO savedAddressDTO = addressService.createAddress(addressDTO);
    return new ResponseEntity<>(savedAddressDTO, HttpStatus.CREATED);
}

    @GetMapping("/addresses")
    public ResponseEntity<List<AddressDTO>> getAddresses() {
        List<AddressDTO> addressDTOs = addressService.getAddresses();
        return new ResponseEntity<>(addressDTOs, HttpStatus.OK); 
    }

    @GetMapping("/addresses/{id}")
    public ResponseEntity<AddressDTO> getAddress(@PathVariable Long id) {
        AddressDTO addressDTO = addressService.getAddress(id);
        return new ResponseEntity<>(addressDTO, HttpStatus.OK);
    }

    @PutMapping("/addresses/{id}")
    public ResponseEntity<AddressDTO> updateAddress(@PathVariable Long id, @RequestBody AddressDTO addressDTO) {
        addressDTO.setId(id); // Set the id from the path variable
        AddressDTO updatedAddressDTO = addressService.updateAddress(addressDTO);
        return new ResponseEntity<>(updatedAddressDTO, HttpStatus.OK);
    }

    @DeleteMapping("/addresses/{id}")
    public ResponseEntity<String> deleteAddress(@PathVariable Long id) {
        String status = addressService.deleteAddress(id);
        return new ResponseEntity<>(status, HttpStatus.OK);
    }

    // Các phương thức liên quan đến userId

    @GetMapping("/users/{userId}/addresses")
    public ResponseEntity<List<AddressDTO>> getAddressesByUserId(@PathVariable Long userId) {
        List<AddressDTO> addressDTOs = addressService.getAddressesByUserId(userId);
        return new ResponseEntity<>(addressDTOs, HttpStatus.OK);
    }

    @PostMapping("/users/{userId}/addresses")
public ResponseEntity<AddressDTO> addAddressToUser(@PathVariable Long userId, @Valid @RequestBody AddressDTO addressDTO) {
    addressDTO.setUserId(userId);  // Đảm bảo userId được gán chính xác
    AddressDTO savedAddressDTO = addressService.addAddressToUser(addressDTO);
    return new ResponseEntity<>(savedAddressDTO, HttpStatus.CREATED);
}

    @PutMapping("/users/{userId}/addresses/{id}")
    public ResponseEntity<AddressDTO> updateAddressByUserId(@PathVariable Long userId, @PathVariable Long id, @RequestBody AddressDTO addressDTO) {
        addressDTO.setUserId(userId); // Set the userId from the path variable
        addressDTO.setId(id); // Set the address id from the path variable
        AddressDTO updatedAddressDTO = addressService.updateAddress(addressDTO);
        return new ResponseEntity<>(updatedAddressDTO, HttpStatus.OK);
    }

    @DeleteMapping("/users/{userId}/addresses/{id}")
    public ResponseEntity<String> deleteAddressByUserId(@PathVariable Long userId, @PathVariable Long id) {
        addressService.deleteAddressByUserId(userId, id);
        return new ResponseEntity<>("Address deleted successfully", HttpStatus.OK);
    }
}
