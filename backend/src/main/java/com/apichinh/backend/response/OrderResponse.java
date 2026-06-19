package com.apichinh.backend.response;

import com.apichinh.backend.dto.OrderDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private boolean success; // Trạng thái thành công
    private String message; // Thông điệp trả về
    private List<OrderDTO> orders; // Danh sách đơn hàng (nếu cần)
    private OrderDTO order; // Đơn hàng cụ thể (nếu cần)
}
