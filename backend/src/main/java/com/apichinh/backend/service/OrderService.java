package com.apichinh.backend.service;

import com.apichinh.backend.entity.Order;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrderService {
   Order createOrder(Order order);

   Order getOrderById(Long orderId);

   Page<Order> getAll(Pageable pageable);

   Order updateOrder(Order order);

   void deleteOrder(Long orderId);

   // Lấy danh sách order theo userId
   List<Order> getOrdersByUserId(Long userId);
}

