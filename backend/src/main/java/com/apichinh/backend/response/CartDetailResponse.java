package com.apichinh.backend.response;



import com.apichinh.backend.dto.CartDetailDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartDetailResponse {
    private boolean success; // Trạng thái thành công
    private String message; // Thông điệp trả về
    private List<CartDetailDTO> cartDetails; // Danh sách chi tiết giỏ hàng (nếu cần)
    private CartDetailDTO cartDetail; // Chi tiết giỏ hàng cụ thể (nếu cần)
}
