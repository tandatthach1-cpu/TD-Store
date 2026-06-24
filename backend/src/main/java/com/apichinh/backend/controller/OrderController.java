package com.apichinh.backend.controller;

import com.apichinh.backend.entity.Order;
import com.apichinh.backend.entity.Coupon;
import com.apichinh.backend.entity.User;
import com.apichinh.backend.repository.CouponRepository;
import com.apichinh.backend.repository.UserRepository;
import com.apichinh.backend.service.OrderService;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Date;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({ "api/orders" })
@CrossOrigin(origins = { "*" }, exposedHeaders = { "Content-Range" })
public class OrderController {
   private OrderService orderService;
   private final UserRepository userRepository;
   private final CouponRepository couponRepository;

   @PostMapping
   @Transactional
   public ResponseEntity<Order> createOrder(@RequestBody Order order) {
      LocalDateTime currentDateAndTime = LocalDateTime.now();
      Date currentDate = Timestamp.valueOf(currentDateAndTime);
      order.setDate(currentDate);
      applyCoupon(order, currentDateAndTime);
      normalizeAmounts(order);
      hydrateUser(order);
      Order savedOrder = this.orderService.createOrder(order);
      return new ResponseEntity<>(savedOrder, HttpStatus.CREATED);
   }

   @GetMapping({ "{id}" })
   public ResponseEntity<Order> getOrderById(@PathVariable("id") Long orderId) {
      Order order = this.orderService.getOrderById(orderId);
      return order != null ? new ResponseEntity<>(order, HttpStatus.OK) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
   }

   @GetMapping
   public ResponseEntity<Page<Order>> getAllOrders(@RequestParam(name = "page", defaultValue = "0") int page,
         @RequestParam(name = "size", defaultValue = "10") int size) {
      Pageable pageable = PageRequest.of(page, size);
      Page<Order> Categories = this.orderService.getAll(pageable);
      return new ResponseEntity<>(Categories, HttpStatus.OK);
   }

   @PutMapping({ "{id}" })
   public ResponseEntity<?> updateOrder(@PathVariable("id") Long orderId, @RequestBody Order order) {
      order.setId(orderId);
      hydrateUser(order);
      Order updatedOrder = this.orderService.updateOrder(order);
      return new ResponseEntity<>(updatedOrder, HttpStatus.OK);
   }

   @PostMapping({ "{id}/payment-success" })
   public ResponseEntity<?> confirmPaymentSuccess(@PathVariable("id") Long orderId) {
      Order updatedOrder = this.orderService.confirmPayment(orderId);
      return updatedOrder != null
            ? new ResponseEntity<>(updatedOrder, HttpStatus.OK)
            : new ResponseEntity<>(HttpStatus.NOT_FOUND);
   }

   @DeleteMapping({ "{id}" })
   public ResponseEntity<String> deleteOrder(@PathVariable("id") Long orderId) {
      try {
         this.orderService.deleteOrder(orderId);
         return new ResponseEntity<>("Order successfully deleted!", HttpStatus.OK);
      } catch (com.apichinh.backend.exceptions.ResourceNotFoundException ex) {
         return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
      } catch (Exception ex) {
         return new ResponseEntity<>("Failed to delete order: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

   // Lấy lịch sử đơn hàng theo userId đang đăng nhập
   @GetMapping({"/user/{userId}"})
   public ResponseEntity<?> getOrdersByUser(@PathVariable("userId") Long userId) {
      java.util.List<Order> orders = this.orderService.getOrdersByUserId(userId);

      // Map nhẹ để Android HisFragment parse được key: orders[], orderId, orderDate
      java.util.List<java.util.Map<String, Object>> mapped = new java.util.ArrayList<>();
      if (orders != null) {
         for (Order o : orders) {
            java.util.Map<String, Object> item = new java.util.HashMap<>();
            item.put("orderId", o.getId());
            item.put("orderCode", o.getOrderCode());
            item.put("orderDate", o.getDate());
            item.put("address", o.getAddress() != null ? o.getAddress() : "");
            item.put("status", o.getStatus() != null ? o.getStatus() : "");
            item.put("paymentStatus", o.getPaymentStatus() != null ? o.getPaymentStatus() : "");
            item.put("totalAmount", o.getTotalAmount() != null ? o.getTotalAmount() : 0d);
            item.put("originalAmount", o.getOriginalAmount() != null ? o.getOriginalAmount() : 0d);
            item.put("discountAmount", o.getDiscountAmount() != null ? o.getDiscountAmount() : 0d);
            item.put("couponCode", o.getCouponCode() != null ? o.getCouponCode() : "");
            item.put("couponTitle", o.getCouponTitle() != null ? o.getCouponTitle() : "");
            item.put("customerName", o.getCustomerName() != null ? o.getCustomerName() : "");
            item.put("customerPhone", o.getCustomerPhone() != null ? o.getCustomerPhone() : "");
            mapped.add(item);
         }
      }
      java.util.Map<String, Object> wrapper = new java.util.HashMap<>();
      wrapper.put("orders", mapped);
      return new ResponseEntity<>(wrapper, HttpStatus.OK);
   }

   private void hydrateUser(Order order) {
      if (order.getUser() != null || order.getUserId() == null) {
         return;
      }
      User user = userRepository.findById(order.getUserId()).orElse(null);
      order.setUser(user);
   }

   private void normalizeAmounts(Order order) {
      double originalAmount = order.getOriginalAmount() != null ? order.getOriginalAmount() : 0d;
      double finalAmount = order.getTotalAmount() != null ? order.getTotalAmount() : originalAmount;

      order.setOriginalAmount(originalAmount > 0 ? originalAmount : finalAmount);
      order.setDiscountAmount(Math.max(order.getOriginalAmount() - finalAmount, 0d));
      order.setTotalAmount(Math.max(finalAmount, 0d));
   }

   private void applyCoupon(Order order, LocalDateTime now) {
      String couponCode = trimToNull(order.getCouponCode());
      if (couponCode == null) {
         if (order.getOriginalAmount() == null && order.getTotalAmount() != null) {
            order.setOriginalAmount(order.getTotalAmount());
         }
         order.setDiscountAmount(order.getDiscountAmount() != null ? order.getDiscountAmount() : 0d);
         return;
      }

      Coupon coupon = couponRepository.findByCodeIgnoreCase(couponCode)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã giảm giá không hợp lệ."));

      validateCoupon(coupon, now);

      double originalAmount = order.getOriginalAmount() != null ? order.getOriginalAmount()
            : (order.getTotalAmount() != null ? order.getTotalAmount() : 0d);
      if (originalAmount <= 0d) {
         throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thiếu giá trị đơn hàng gốc để áp mã.");
      }

      double discountAmount = calculateDiscountAmount(coupon, originalAmount);
      double totalAmount = Math.max(originalAmount - discountAmount, 0d);

      order.setCouponCode(coupon.getCode());
      order.setCouponTitle(coupon.getTitle());
      order.setOriginalAmount(originalAmount);
      order.setDiscountAmount(discountAmount);
      order.setTotalAmount(totalAmount);

      if (coupon.getQuantity() != null) {
         int nextQuantity = coupon.getQuantity() - 1;
         if (nextQuantity < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã giảm giá đã hết lượt dùng.");
         }
         coupon.setQuantity(nextQuantity);
         couponRepository.save(coupon);
      }
   }

   private void validateCoupon(Coupon coupon, LocalDateTime now) {
      if (!coupon.isActive()) {
         throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã giảm giá hiện đang ngưng sử dụng.");
      }

      if (coupon.getStartAt() != null && now.isBefore(coupon.getStartAt())) {
         throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã giảm giá chưa đến thời gian áp dụng.");
      }

      if (coupon.getEndAt() != null && now.isAfter(coupon.getEndAt())) {
         throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã giảm giá đã hết hạn.");
      }

      if (coupon.getQuantity() != null && coupon.getQuantity() <= 0) {
         throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã giảm giá đã hết lượt dùng.");
      }
   }

   private double calculateDiscountAmount(Coupon coupon, double originalAmount) {
      if (coupon.getMinOrderValue() != null && originalAmount < coupon.getMinOrderValue()) {
         throw new ResponseStatusException(
               HttpStatus.BAD_REQUEST,
               "Đơn tối thiểu phải từ " + coupon.getMinOrderValue().longValue()
         );
      }

      double discountAmount;
      if (isFixedAmountCoupon(coupon)) {
         discountAmount = coupon.getDiscountValue() != null ? coupon.getDiscountValue() : 0d;
      } else {
         discountAmount = originalAmount * ((coupon.getDiscountValue() != null ? coupon.getDiscountValue() : 0d) / 100d);
      }

      if (coupon.getMaxDiscountValue() != null) {
         discountAmount = Math.min(discountAmount, coupon.getMaxDiscountValue());
      }

      return Math.min(Math.max(discountAmount, 0d), originalAmount);
   }

   private boolean isFixedAmountCoupon(Coupon coupon) {
      String discountType = coupon.getDiscountType();
      return discountType != null
            && ("AMOUNT".equalsIgnoreCase(discountType) || "FIXED".equalsIgnoreCase(discountType));
   }

   private String trimToNull(String value) {
      if (value == null) {
         return null;
      }
      String trimmed = value.trim();
      return trimmed.isEmpty() ? null : trimmed;
   }

   public OrderController(final OrderService orderService, final UserRepository userRepository,
         final CouponRepository couponRepository) {
      this.orderService = orderService;
      this.userRepository = userRepository;
      this.couponRepository = couponRepository;
   }
}
