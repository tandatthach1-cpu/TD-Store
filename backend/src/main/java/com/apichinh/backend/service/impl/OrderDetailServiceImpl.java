package com.apichinh.backend.service.impl;

import com.apichinh.backend.entity.OrderDetail;
import com.apichinh.backend.repository.OrderDetailRepository;
import com.apichinh.backend.service.OrderDetailService;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class OrderDetailServiceImpl implements OrderDetailService {
   private OrderDetailRepository orderDetailRepository;

   public OrderDetail createOrderDetail(OrderDetail orderDetail) {
      return (OrderDetail) this.orderDetailRepository.save(orderDetail);
   }

   public OrderDetail getOrderDetailById(Long orderDetailId) {
      Optional<OrderDetail> optionalOrderDetail = this.orderDetailRepository.findById(orderDetailId);
      return (OrderDetail) optionalOrderDetail.get();
   }

   public Page<OrderDetail> getAll(Pageable pageable) {
      return this.orderDetailRepository.findAll(pageable);
   }

   public List<OrderDetail> getOrderDetailByUser(Long orderId, Long userId) {
      return this.orderDetailRepository.findByOrderIdAndOrderUserId(orderId, userId);
   }

   public List<OrderDetail> getOrderDetailsByOrderId(Long orderId) {
      return this.orderDetailRepository.findByOrderId(orderId);
   }

   public OrderDetail updateOrderDetail(OrderDetail orderDetail) {
      OrderDetail existingOrderDetail = (OrderDetail) this.orderDetailRepository.findById(orderDetail.getId()).get();
      existingOrderDetail.setProduct(orderDetail.getProduct());
      existingOrderDetail.setQuantity(orderDetail.getQuantity());
      existingOrderDetail.setProduct(orderDetail.getProduct());
      OrderDetail updatedOrderDetail = (OrderDetail) this.orderDetailRepository.save(existingOrderDetail);
      return updatedOrderDetail;
   }

   public void deleteOrderDetail(Long orderDetailId) {
      this.orderDetailRepository.deleteById(orderDetailId);
   }

   public OrderDetailServiceImpl(final OrderDetailRepository orderDetailRepository) {
      this.orderDetailRepository = orderDetailRepository;
   }
}

