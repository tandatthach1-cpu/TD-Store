package com.daohuybac.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SlideShowDTO {
    private Long slideId; // ID của slideshow
    private String title; // Tiêu đề slideshow
    private String imageUrl; // Đường dẫn hình ảnh slideshow
    private String description; // Mô tả slideshow (nếu cần)
}
