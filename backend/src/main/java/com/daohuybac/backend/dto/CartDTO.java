package com.daohuybac.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartDTO {
    private Long cartId; // ID của giỏ hàng
    private Long userId; // ID của người dùng
    private List<Long> cartDetailIds; // Danh sách ID chi tiết giỏ hàng
}
