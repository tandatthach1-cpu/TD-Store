package com.daohuybac.backend.response;

import com.daohuybac.backend.dto.CategoryDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryResponse {
    private boolean success; // Trạng thái thành công
    private String message; // Thông điệp trả về
    private List<CategoryDTO> categories; // Danh sách danh mục (nếu cần)
    private CategoryDTO category; // Danh mục cụ thể (nếu cần)
}
