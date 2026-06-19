package com.apichinh.backend.service;

import com.apichinh.backend.entity.OrderDetail;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrderDetailService {
   OrderDetail createOrderDetail(OrderDetail orderDetail);

   OrderDetail getOrderDetailById(Long orderDetailId);

   Page<OrderDetail> getAll(Pageable pageable);

   List<OrderDetail> getOrderDetailByUser(Long orderId, Long userId);

   // Lấy chi tiết theo orderId
   List<OrderDetail> getOrderDetailsByOrderId(Long orderId);

   OrderDetail updateOrderDetail(OrderDetail orderDetail);

   void deleteOrderDetail(Long orderDetailId);
}

