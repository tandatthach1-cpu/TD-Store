package com.daohuybac.backend.service.impl;

import com.daohuybac.backend.entity.Order;
import com.daohuybac.backend.entity.OrderDetail;
import com.daohuybac.backend.repository.OrderDetailRepository;
import com.daohuybac.backend.repository.OrderRepository;
import com.daohuybac.backend.service.OrderService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


@Service
public class OrderServiceImpl implements OrderService {
   private static final Logger logger = LoggerFactory.getLogger(OrderServiceImpl.class);

   private final OrderRepository orderRepository;
   private final OrderDetailRepository orderDetailRepository;


   public OrderServiceImpl(final OrderRepository orderRepository, final OrderDetailRepository orderDetailRepository) {
      this.orderRepository = orderRepository;
      this.orderDetailRepository = orderDetailRepository;
   }

   @Override
   public Order createOrder(Order order) {
      return this.orderRepository.save(order);
   }

   @Override
   public Order getOrderById(Long orderId) {
      Optional<Order> optionalOrder = this.orderRepository.findById(orderId);
      return optionalOrder.get();
   }

   @Override
   public Page<Order> getAll(Pageable pageable) {
      return this.orderRepository.findAll(pageable);
   }

   @Override
   public Order updateOrder(Order order) {
      Order existingOrder = this.orderRepository.findById(order.getId()).get();
      existingOrder.setDate(order.getDate());
      return this.orderRepository.save(existingOrder);
   }

   @Override
   public void deleteOrder(Long orderId) {
      logger.info("deleteOrder called with orderId={}", orderId);

      // Xóa order_details trước để tránh vi phạm khóa ngoại (FK) khi xóa orders
      List<OrderDetail> details = this.orderDetailRepository.findByOrderId(orderId);
      logger.info("Found orderDetails count={} for orderId={}", details == null ? 0 : details.size(), orderId);
      if (details != null && !details.isEmpty()) {
         this.orderDetailRepository.deleteAll(details);
      }

      boolean exists = this.orderRepository.existsById(orderId);
      logger.info("Order existsById={} for orderId={}", exists, orderId);
      if (!exists) {
         throw new com.daohuybac.backend.exceptions.ResourceNotFoundException(
               "Order",
               "id",
               orderId
         );
      }

      this.orderRepository.deleteById(orderId);
      logger.info("Order deleted successfully orderId={}", orderId);
   }


   @Override
   public List<Order> getOrdersByUserId(Long userId) {
      return this.orderRepository.findByUserId(userId);
   }
}


