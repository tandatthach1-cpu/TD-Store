package com.daohuybac.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDTO {
    private Long categoryId; // ID của danh mục
    private String name; // Tên danh mục
    private String description; // Mô tả danh mục (nếu cần)
}
