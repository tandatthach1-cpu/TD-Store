package com.apichinh.backend.service.impl;

import com.apichinh.backend.entity.Order;
import com.apichinh.backend.entity.OrderDetail;
import com.apichinh.backend.entity.Product;
import com.apichinh.backend.repository.OrderDetailRepository;
import com.apichinh.backend.repository.OrderRepository;
import com.apichinh.backend.repository.ProductRepository;
import com.apichinh.backend.service.OrderService;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderServiceImpl implements OrderService {
   private static final Logger logger = LoggerFactory.getLogger(OrderServiceImpl.class);

   private final OrderRepository orderRepository;
   private final OrderDetailRepository orderDetailRepository;
   private final ProductRepository productRepository;

   public OrderServiceImpl(
         final OrderRepository orderRepository,
         final OrderDetailRepository orderDetailRepository,
         final ProductRepository productRepository) {
      this.orderRepository = orderRepository;
      this.orderDetailRepository = orderDetailRepository;
      this.productRepository = productRepository;
   }

   @Override
   public Order createOrder(Order order) {
      return this.orderRepository.save(order);
   }

   @Override
   public Order getOrderById(Long orderId) {
      Optional<Order> optionalOrder = this.orderRepository.findById(orderId);
      return optionalOrder.orElse(null);
   }

   @Override
   public Page<Order> getAll(Pageable pageable) {
      return this.orderRepository.findAll(pageable);
   }

   @Override
   @Transactional
   public Order updateOrder(Order order) {
      Order existingOrder = this.orderRepository.findById(order.getId()).orElse(null);
      if (existingOrder == null) {
         return null;
      }

      boolean shouldDeductStock = shouldDeductStock(existingOrder, order);

      existingOrder.setDate(order.getDate());
      existingOrder.setAddress(order.getAddress());
      existingOrder.setStatus(order.getStatus());
      existingOrder.setPaymentStatus(order.getPaymentStatus());
      existingOrder.setTotalAmount(order.getTotalAmount());
      existingOrder.setCustomerName(order.getCustomerName());
      existingOrder.setCustomerPhone(order.getCustomerPhone());
      existingOrder.setNote(order.getNote());
      existingOrder.setOrderCode(order.getOrderCode());
      if (order.getUser() != null) {
         existingOrder.setUser(order.getUser());
      }

      Order savedOrder = this.orderRepository.save(existingOrder);
      if (shouldDeductStock) {
         deductStockForOrder(savedOrder);
      }
      return savedOrder;
   }

   @Override
   @Transactional
   public Order confirmPayment(Long orderId) {
      Order existingOrder = this.orderRepository.findById(orderId).orElse(null);
      if (existingOrder == null) {
         return null;
      }

      existingOrder.setPaymentStatus("PAID");
      if (existingOrder.getStatus() == null || existingOrder.getStatus().isBlank()) {
         existingOrder.setStatus("COMPLETED");
      }

      Order savedOrder = this.orderRepository.save(existingOrder);
      if (!savedOrder.isStockDeducted()) {
         deductStockForOrder(savedOrder);
      }
      return savedOrder;
   }

   @Override
   public void deleteOrder(Long orderId) {
      logger.info("deleteOrder called with orderId={}", orderId);

      List<OrderDetail> details = this.orderDetailRepository.findByOrderId(orderId);
      logger.info("Found orderDetails count={} for orderId={}", details == null ? 0 : details.size(), orderId);
      if (details != null && !details.isEmpty()) {
         this.orderDetailRepository.deleteAll(details);
      }

      boolean exists = this.orderRepository.existsById(orderId);
      logger.info("Order existsById={} for orderId={}", exists, orderId);
      if (!exists) {
         throw new com.apichinh.backend.exceptions.ResourceNotFoundException("Order", "id", orderId);
      }

      this.orderRepository.deleteById(orderId);
      logger.info("Order deleted successfully orderId={}", orderId);
   }

   @Override
   public List<Order> getOrdersByUserId(Long userId) {
      return this.orderRepository.findByUserId(userId);
   }

   private boolean shouldDeductStock(Order existingOrder, Order incomingOrder) {
      if (existingOrder == null || incomingOrder == null || existingOrder.isStockDeducted()) {
         return false;
      }

      return isPaymentComplete(incomingOrder.getPaymentStatus()) || isOrderComplete(incomingOrder.getStatus());
   }

   private boolean isPaymentComplete(String value) {
      String normalized = normalize(value);
      return normalized.contains("paid") || normalized.contains("success") || normalized.contains("completed");
   }

   private boolean isOrderComplete(String value) {
      String normalized = normalize(value);
      return normalized.contains("completed")
            || normalized.contains("delivered")
            || normalized.contains("da_giao")
            || normalized.contains("giao_hang");
   }

   private void deductStockForOrder(Order order) {
      if (order == null || order.isStockDeducted()) {
         return;
      }

      List<OrderDetail> details = this.orderDetailRepository.findByOrderId(order.getId());
      if (details == null || details.isEmpty()) {
         logger.warn("No order details found when deducting stock for orderId={}", order.getId());
         order.setStockDeducted(true);
         this.orderRepository.save(order);
         return;
      }

      for (OrderDetail detail : details) {
         if (detail == null || detail.getProduct() == null) {
            continue;
         }

         Product product = detail.getProduct();
         int orderedQuantity = Math.max(detail.getQuantity(), 0);
         int currentStock = product.getStockQuantity() != null ? product.getStockQuantity() : 0;
         if (orderedQuantity > currentStock) {
            throw new IllegalStateException(
                  "Tồn kho không đủ cho sản phẩm " + product.getTitle() + ": cần " + orderedQuantity + ", còn " + currentStock);
         }
         int nextStock = Math.max(currentStock - orderedQuantity, 0);
         product.setStockQuantity(nextStock);
         this.productRepository.save(product);
      }

      order.setStockDeducted(true);
      this.orderRepository.save(order);
   }

   private String normalize(String value) {
      if (value == null) {
         return "";
      }

      return value.trim().toLowerCase(Locale.ROOT)
            .replace('đ', 'd')
            .replace('á', 'a')
            .replace('à', 'a')
            .replace('ả', 'a')
            .replace('ã', 'a')
            .replace('ạ', 'a')
            .replace('ă', 'a')
            .replace('â', 'a')
            .replace('ê', 'e')
            .replace('é', 'e')
            .replace('è', 'e')
            .replace('ẻ', 'e')
            .replace('ẽ', 'e')
            .replace('ẹ', 'e')
            .replace('ô', 'o')
            .replace('ơ', 'o')
            .replace('ó', 'o')
            .replace('ò', 'o')
            .replace('ỏ', 'o')
            .replace('õ', 'o')
            .replace('ọ', 'o')
            .replace('ư', 'u')
            .replace('ú', 'u')
            .replace('ù', 'u')
            .replace('ủ', 'u')
            .replace('ũ', 'u')
            .replace('ụ', 'u')
            .replaceAll("\\s+", "_");
   }
}
