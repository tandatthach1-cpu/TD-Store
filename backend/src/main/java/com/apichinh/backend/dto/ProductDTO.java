package com.apichinh.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Long id;
    private String name;
    private String price;
    private String img;
    private String category;
    private boolean featured;
    private boolean bestSeller;
    // Bạn có thể thêm các trường khác như oldPrice, description, gallery, variants nếu cần cho trang chi tiết sản phẩm
}