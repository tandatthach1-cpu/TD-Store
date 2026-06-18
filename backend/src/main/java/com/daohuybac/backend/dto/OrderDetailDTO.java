package com.daohuybac.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetailDTO {
    private Long orderDetailId; // ID của chi tiết đơn hàng
    private Long orderId; // ID của đơn hàng
    private Long productId; // ID của sản phẩm
    private int quantity; // Số lượng sản phẩm
    private double price; // Giá của sản phẩm
}
