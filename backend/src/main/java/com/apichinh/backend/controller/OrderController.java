package com.daohuybac.backend.controller;

import com.daohuybac.backend.entity.Order;
import com.daohuybac.backend.service.OrderService;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Date;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

   @PostMapping
   public ResponseEntity<Order> createOrder(@RequestBody Order order) {
      LocalDateTime currentDateAndTime = LocalDateTime.now();
      Date currentDate = Timestamp.valueOf(currentDateAndTime);
      order.setDate(currentDate);
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
      Order updatedOrder = this.orderService.updateOrder(order);
      return new ResponseEntity<>(updatedOrder, HttpStatus.OK);
   }

   @DeleteMapping({ "{id}" })
   public ResponseEntity<String> deleteOrder(@PathVariable("id") Long orderId) {
      try {
         this.orderService.deleteOrder(orderId);
         return new ResponseEntity<>("Order successfully deleted!", HttpStatus.OK);
      } catch (com.daohuybac.backend.exceptions.ResourceNotFoundException ex) {
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
            item.put("orderDate", o.getDate());
            item.put("address", o.getAddress() != null ? o.getAddress() : "");
            item.put("status", o.getStatus() != null ? o.getStatus() : "");
            mapped.add(item);
         }
      }
      java.util.Map<String, Object> wrapper = new java.util.HashMap<>();
      wrapper.put("orders", mapped);
      return new ResponseEntity<>(wrapper, HttpStatus.OK);
   }

   public OrderController(final OrderService orderService) {
      this.orderService = orderService;
   }
}
