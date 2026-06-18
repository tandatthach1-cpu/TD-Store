package com.daohuybac.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private Long orderId; // ID của đơn hàng
    private Long userId; // ID của người dùng
    private LocalDateTime orderDate; // Ngày đặt hàng
    private Double totalAmount; // Tổng số tiền
    private String status; // Trạng thái đơn hàng
}
