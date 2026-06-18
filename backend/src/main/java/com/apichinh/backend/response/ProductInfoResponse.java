package com.daohuybac.backend.response;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductInfoResponse {
    private Long id;
    private Long productId; 
    private Long userId;
    private String username;   
    private String comment;
    private boolean favorite;
}
