package com.apichinh.backend.response;

import com.apichinh.backend.dto.OrderDetailDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetailResponse {
    private boolean success; // Trạng thái thành công
    private String message; // Thông điệp trả về
    private List<OrderDetailDTO> orderDetails; // Danh sách chi tiết đơn hàng (nếu cần)
    private OrderDetailDTO orderDetail; // Chi tiết đơn hàng cụ thể (nếu cần)
}
