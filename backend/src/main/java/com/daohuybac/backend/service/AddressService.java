package com.daohuybac.backend.service;

import java.util.List;

import com.daohuybac.backend.dto.AddressDTO;

import jakarta.validation.Valid;

public interface AddressService {

    AddressDTO createAddress(AddressDTO addressDTO);

    List<AddressDTO> getAddresses();

    AddressDTO getAddress(Long id);

    AddressDTO updateAddress(AddressDTO addressDTO);

    String deleteAddress(Long id);

    List<AddressDTO> getAddressesByUserId(Long userId);

    AddressDTO addAddressToUser(AddressDTO addressDTO);

    void deleteAddressByUserId(Long userId, Long id);

  


    

    
}
