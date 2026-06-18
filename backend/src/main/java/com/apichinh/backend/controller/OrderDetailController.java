package com.daohuybac.backend.controller;

import com.daohuybac.backend.entity.OrderDetail;
import com.daohuybac.backend.service.OrderDetailService;
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
@RequestMapping({ "api/orderDetails" })
@CrossOrigin(origins = { "*" }, exposedHeaders = { "Content-Range" })
public class OrderDetailController {
   private OrderDetailService orderDetailService;

   @PostMapping
   public ResponseEntity<OrderDetail> createOrderDetail(@RequestBody OrderDetail orderDetail) {
      OrderDetail savedOrderDetail = this.orderDetailService.createOrderDetail(orderDetail);
      return new ResponseEntity<>(savedOrderDetail, HttpStatus.CREATED);
   }

   @GetMapping({ "{id}" })
   public ResponseEntity<OrderDetail> getOrderDetailById(@PathVariable("id") Long orderDetailId) {
      OrderDetail orderDetail = this.orderDetailService.getOrderDetailById(orderDetailId);
      return orderDetail != null ? new ResponseEntity<>(orderDetail, HttpStatus.OK)
            : new ResponseEntity<>(HttpStatus.NOT_FOUND);
   }

   @GetMapping
   public ResponseEntity<Page<OrderDetail>> getAllOrderDetails(
         @RequestParam(name = "page", defaultValue = "0") int page,
         @RequestParam(name = "size", defaultValue = "10") int size) {
      Pageable pageable = PageRequest.of(page, size);
      Page<OrderDetail> Categories = this.orderDetailService.getAll(pageable);
      return new ResponseEntity<>(Categories, HttpStatus.OK);
   }

   @PutMapping({ "{id}" })
   public ResponseEntity<?> updateOrderDetail(@PathVariable("id") Long orderDetailId,
         @RequestBody OrderDetail orderDetail) {
      orderDetail.setId(orderDetailId);
      OrderDetail updatedOrderDetail = this.orderDetailService.updateOrderDetail(orderDetail);
      return new ResponseEntity<>(updatedOrderDetail, HttpStatus.OK);
   }

   @DeleteMapping({ "{id}" })
   public ResponseEntity<String> deleteOrderDetail(@PathVariable("id") Long orderDetailId) {
      this.orderDetailService.deleteOrderDetail(orderDetailId);
      return new ResponseEntity<>("OrderDetail successfully deleted!", HttpStatus.OK);
   }

   // Lấy chi tiết đơn hàng theo orderId để hiển thị lịch sử đơn hàng
   @GetMapping({"/orders/{orderId}"})
   public ResponseEntity<?> getOrderDetailsByOrderId(@PathVariable("orderId") Long orderId) {
      java.util.List<OrderDetail> details = this.orderDetailService.getOrderDetailsByOrderId(orderId);
      java.util.List<java.util.Map<String, Object>> mapped = new java.util.ArrayList<>();
      if (details != null) {
         for (OrderDetail d : details) {
            java.util.Map<String, Object> item = new java.util.HashMap<>();
            item.put("quantity", d.getQuantity());
            item.put("productId", d.getProduct() != null ? d.getProduct().getId() : null);

            // HisFragment kỳ vọng: orderDetailObject.getJSONObject("product").optString("title")
            java.util.Map<String, Object> productMap = new java.util.HashMap<>();
            if (d.getProduct() != null) {
               productMap.put("id", d.getProduct().getId());
               productMap.put("title", d.getProduct().getTitle());
               productMap.put("price", d.getProduct().getPrice());
               productMap.put("photo", d.getProduct().getPhoto());
            }
            item.put("product", productMap);

            mapped.add(item);
         }
      }
      return new ResponseEntity<>(mapped, HttpStatus.OK);
   }

   public OrderDetailController(final OrderDetailService orderDetailService) {
      this.orderDetailService = orderDetailService;
   }

}
