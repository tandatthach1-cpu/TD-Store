package com.apichinh.backend.dto;



import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartDetailDTO {
    private Long cartDetailId; // ID của chi tiết giỏ hàng
    private Long productId; // ID của sản phẩm
    private Long cartId; // ID của giỏ hàng
    private Integer quantity; // Số lượng sản phẩm
    private Double price; // Giá sản phẩm
}
