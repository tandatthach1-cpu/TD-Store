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
        // Lấy tất cả địa chỉ từ cơ sở dữ liệu và chuyển đổi thành AddressDTO
        List<Address> addresses = addressRepository.findAll();
        return addresses.stream()
                .map(address -> modelMapper.map(address, AddressDTO.class)) // Sử dụng ModelMapper
                .collect(Collectors.toList());
    }

    @Override
    public AddressDTO getAddress(Long id) {
        // Lấy địa chỉ theo id và chuyển đổi thành AddressDTO
        Optional<Address> address = addressRepository.findById(id);
        return address.map(a -> modelMapper.map(a, AddressDTO.class)).orElse(null);
    }

    @Override
    @Transactional
    public AddressDTO createAddress(AddressDTO addressDTO) {
        // Tạo địa chỉ mới từ AddressDTO
        Address address = modelMapper.map(addressDTO, Address.class);
        address.setUser(userRepository.findById(addressDTO.getUserId()).orElse(null)); // Gán user cho địa chỉ

        // Lưu địa chỉ vào cơ sở dữ liệu
        Address savedAddress = addressRepository.save(address);
        return modelMapper.map(savedAddress, AddressDTO.class); // Chuyển Address entity sang AddressDTO
    }

    @Override
    @Transactional
    public AddressDTO updateAddress(AddressDTO addressDTO) {
        // Tìm địa chỉ theo id từ DTO
        Optional<Address> addressOptional = addressRepository.findById(addressDTO.getId());
        if (addressOptional.isPresent()) {
            Address address = addressOptional.get();
            // Cập nhật thông tin địa chỉ từ AddressDTO
            modelMapper.map(addressDTO, address); // Chuyển từ AddressDTO sang Address để cập nhật

            // Lưu lại địa chỉ đã cập nhật
            Address updatedAddress = addressRepository.save(address);
            return modelMapper.map(updatedAddress, AddressDTO.class); // Trả về AddressDTO đã cập nhật
        }
        return null; // Nếu không tìm thấy địa chỉ, trả về null
    }

    @Override
    @Transactional
    public String deleteAddress(Long id) {
        // Kiểm tra địa chỉ tồn tại theo id
        Optional<Address> addressOptional = addressRepository.findById(id);
        if (addressOptional.isPresent()) {
            addressRepository.delete(addressOptional.get()); // Xóa địa chỉ khỏi cơ sở dữ liệu
            return "Address deleted successfully"; // Trả về thông báo xóa thành công
        }
        return "Address not found"; // Trả về thông báo nếu không tìm thấy địa chỉ
    }

    @Override
    public List<AddressDTO> getAddressesByUserId(Long userId) {
        // Lấy danh sách các địa chỉ của người dùng theo userId và chuyển đổi thành AddressDTO
        List<Address> addresses = addressRepository.findByUserId(userId);
        return addresses.stream()
                .map(address -> modelMapper.map(address, AddressDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AddressDTO addAddressToUser(AddressDTO addressDTO) {
        // Lấy người dùng từ userId trong DTO
        Optional<User> userOptional = userRepository.findById(addressDTO.getUserId());
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            // Tạo địa chỉ mới từ AddressDTO và gán người dùng vào
            Address address = modelMapper.map(addressDTO, Address.class);
            address.setUser(user); // Gán user vào địa chỉ

            // Lưu địa chỉ vào cơ sở dữ liệu
            Address savedAddress = addressRepository.save(address);
            return modelMapper.map(savedAddress, AddressDTO.class); // Trả về AddressDTO đã lưu
        }
        return null; // Trả về null nếu không tìm thấy người dùng
    }

    @Override
    @Transactional
    public void deleteAddressByUserId(Long userId, Long id) {
        // Kiểm tra và xóa địa chỉ theo userId và id
        Optional<Address> addressOptional = addressRepository.findByIdAndUserId(id, userId);
        addressOptional.ifPresent(addressRepository::delete); // Xóa nếu tồn tại
    }
}
