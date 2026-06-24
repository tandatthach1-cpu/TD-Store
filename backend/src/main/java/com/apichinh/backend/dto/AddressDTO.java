package com.apichinh.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddressDTO {
    private Long id;
    private String street;
    private String ward;
    private String district;
    private String city;
    private String country;
    private String receiverName;
    private String receiverPhone;
    private Double latitude;
    private Double longitude;
    private Long userId;
}

