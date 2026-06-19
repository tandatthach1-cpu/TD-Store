package com.apichinh.backend.response;


import com.apichinh.backend.dto.CartDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartResponse {
    private boolean success; // Trạng thái thành công
    private String message; // Thông điệp trả về
    private List<CartDTO> carts; // Danh sách giỏ hàng (nếu cần)
    private CartDTO cart; // Giỏ hàng cụ thể (nếu cần)
}
