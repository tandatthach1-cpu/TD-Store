package com.daohuybac.backend.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long userId; 
    private String username;
    private String numphone; 
    private String email; 
    private String photo; 
}
