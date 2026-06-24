package com.apichinh.backend.controller;

import com.apichinh.backend.entity.Coupon;
import com.apichinh.backend.repository.CouponRepository;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/coupons")
@CrossOrigin(origins = "*", exposedHeaders = { "Content-Range" })
public class CouponController extends AdminCrudController<Coupon, Long> {
   private final CouponRepository couponRepository;

   public CouponController(CouponRepository couponRepository) {
      this.couponRepository = couponRepository;
   }

   @GetMapping
   public ResponseEntity<Page<Coupon>> getAll(
         @RequestParam(name = "page", defaultValue = "0") int page,
         @RequestParam(name = "size", defaultValue = "10") int size) {
      return ResponseEntity.ok(couponRepository.findAll(PageRequest.of(page, size)));
   }

   @GetMapping("{id}")
   public ResponseEntity<Coupon> getById(@PathVariable Long id) {
      return getOne(couponRepository, id);
   }

   @GetMapping("/validate")
   public ResponseEntity<Map<String, Object>> validate(
         @RequestParam("code") String code,
         @RequestParam(name = "amount", defaultValue = "0") Double amount) {
      Coupon coupon = couponRepository.findByCodeIgnoreCase(code.trim())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã giảm giá không hợp lệ."));

      LocalDateTime now = LocalDateTime.now();
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
      if (coupon.getMinOrderValue() != null && amount < coupon.getMinOrderValue()) {
         throw new ResponseStatusException(
               HttpStatus.BAD_REQUEST,
               "Đơn tối thiểu phải từ " + coupon.getMinOrderValue().longValue()
         );
      }

      double discountAmount;
      if (isFixedAmountCoupon(coupon)) {
         discountAmount = coupon.getDiscountValue() != null ? coupon.getDiscountValue() : 0d;
      } else {
         discountAmount = amount * ((coupon.getDiscountValue() != null ? coupon.getDiscountValue() : 0d) / 100d);
      }
      if (coupon.getMaxDiscountValue() != null) {
         discountAmount = Math.min(discountAmount, coupon.getMaxDiscountValue());
      }
      discountAmount = Math.min(Math.max(discountAmount, 0d), amount);

      Map<String, Object> response = new HashMap<>();
      response.put("valid", true);
      response.put("coupon", coupon);
      response.put("discountAmount", discountAmount);
      response.put("originalAmount", amount);
      response.put("totalAmount", Math.max(amount - discountAmount, 0d));
      response.put("message", "Mã giảm giá hợp lệ.");
      return ResponseEntity.ok(response);
   }

   private boolean isFixedAmountCoupon(Coupon coupon) {
      String discountType = coupon.getDiscountType();
      return discountType != null
            && ("AMOUNT".equalsIgnoreCase(discountType) || "FIXED".equalsIgnoreCase(discountType));
   }

   @PostMapping
   public ResponseEntity<Coupon> createItem(@RequestBody Coupon coupon) {
      return create(couponRepository, coupon);
   }

   @PutMapping("{id}")
   public ResponseEntity<Coupon> updateItem(@PathVariable Long id, @RequestBody Coupon coupon) {
      coupon.setId(id);
      return update(couponRepository, id, coupon);
   }

   @DeleteMapping("{id}")
   public ResponseEntity<String> deleteItem(@PathVariable Long id) {
      return delete(couponRepository, id);
   }
}
