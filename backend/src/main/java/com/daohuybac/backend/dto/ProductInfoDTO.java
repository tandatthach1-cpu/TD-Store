package com.daohuybac.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductInfoDTO {
    private Long id;
    private Long productId; 
    private Long userId;    
    private String comment;
    private boolean favorite;
}
