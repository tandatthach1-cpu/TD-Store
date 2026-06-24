package com.apichinh.backend.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.apichinh.backend.dto.AddressDTO;
import com.apichinh.backend.entity.Address;
import com.apichinh.backend.entity.User;
import com.apichinh.backend.repository.AddressRepository;
import com.apichinh.backend.repository.UserRepository;
import com.apichinh.backend.service.AddressService;

import jakarta.transaction.Transactional;

@Service
public class AddressServiceImpl implements AddressService {

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<AddressDTO> getAddresses() {
        List<Address> addresses = addressRepository.findAll();
        return addresses.stream()
                .map(address -> modelMapper.map(address, AddressDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public AddressDTO getAddress(Long id) {
        Optional<Address> address = addressRepository.findById(id);
        return address.map(a -> modelMapper.map(a, AddressDTO.class)).orElse(null);
    }

    @Override
    @Transactional
    public AddressDTO createAddress(AddressDTO addressDTO) {
        Address address = modelMapper.map(addressDTO, Address.class);
        address.setUser(userRepository.findById(addressDTO.getUserId()).orElse(null));
        address.setReceiverName(addressDTO.getReceiverName());
        address.setReceiverPhone(addressDTO.getReceiverPhone());

        Address savedAddress = addressRepository.save(address);
        return modelMapper.map(savedAddress, AddressDTO.class);
    }

    @Override
    @Transactional
    public AddressDTO updateAddress(AddressDTO addressDTO) {
        Optional<Address> addressOptional = addressRepository.findById(addressDTO.getId());
        if (addressOptional.isPresent()) {
            Address address = addressOptional.get();
            modelMapper.map(addressDTO, address);
            address.setReceiverName(addressDTO.getReceiverName());
            address.setReceiverPhone(addressDTO.getReceiverPhone());

            Address updatedAddress = addressRepository.save(address);
            return modelMapper.map(updatedAddress, AddressDTO.class);
        }
        return null;
    }

    @Override
    @Transactional
    public String deleteAddress(Long id) {
        Optional<Address> addressOptional = addressRepository.findById(id);
        if (addressOptional.isPresent()) {
            addressRepository.delete(addressOptional.get());
            return "Address deleted successfully";
        }
        return "Address not found";
    }

    @Override
    public List<AddressDTO> getAddressesByUserId(Long userId) {
        List<Address> addresses = addressRepository.findByUserId(userId);
        return addresses.stream()
                .map(address -> modelMapper.map(address, AddressDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AddressDTO addAddressToUser(AddressDTO addressDTO) {
        Optional<User> userOptional = userRepository.findById(addressDTO.getUserId());
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            Address address = modelMapper.map(addressDTO, Address.class);
            address.setUser(user);
            address.setReceiverName(addressDTO.getReceiverName());
            address.setReceiverPhone(addressDTO.getReceiverPhone());

            Address savedAddress = addressRepository.save(address);
            return modelMapper.map(savedAddress, AddressDTO.class);
        }
        return null;
    }

    @Override
    @Transactional
    public void deleteAddressByUserId(Long userId, Long id) {
        Optional<Address> addressOptional = addressRepository.findByIdAndUserId(id, userId);
        addressOptional.ifPresent(addressRepository::delete);
    }
}
