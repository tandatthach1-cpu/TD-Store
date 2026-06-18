package com.daohuybac.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Long productId; // ID của sản phẩm
    private String name; // Tên sản phẩm
    private String description; // Mô tả sản phẩm
    private Double price; // Giá sản phẩm
    private String imageUrl; // Đường dẫn hình ảnh sản phẩm
    private Long categoryId; // ID danh mục mà sản phẩm thuộc về
}
