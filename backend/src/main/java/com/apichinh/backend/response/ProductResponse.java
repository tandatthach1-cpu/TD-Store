package com.daohuybac.backend.response;

import com.daohuybac.backend.dto.ProductDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    private boolean success; // Trạng thái thành công
    private String message; // Thông điệp trả về
    private List<ProductDTO> products; // Danh sách sản phẩm (nếu cần)
    private ProductDTO product; // Sản phẩm cụ thể (nếu cần)
}
