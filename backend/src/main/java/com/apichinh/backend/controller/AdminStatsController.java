package com.apichinh.backend.controller;

import com.apichinh.backend.repository.AdminAccountRepository;
import com.apichinh.backend.repository.BrandRepository;
import com.apichinh.backend.repository.CategoryRepository;
import com.apichinh.backend.repository.ContactMessageRepository;
import com.apichinh.backend.repository.CouponRepository;
import com.apichinh.backend.repository.OrderRepository;
import com.apichinh.backend.repository.ProductRepository;
import com.apichinh.backend.repository.ProductReviewRepository;
import com.apichinh.backend.repository.SlideShowRepository;
import com.apichinh.backend.repository.UserRepository;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/adminStats")
@CrossOrigin(origins = "*")
public class AdminStatsController {
   private final ProductRepository productRepository;
   private final CategoryRepository categoryRepository;
   private final BrandRepository brandRepository;
   private final OrderRepository orderRepository;
   private final UserRepository userRepository;
   private final ProductReviewRepository productReviewRepository;
   private final SlideShowRepository slideShowRepository;
   private final ContactMessageRepository contactMessageRepository;
   private final CouponRepository couponRepository;
   private final AdminAccountRepository adminAccountRepository;

   public AdminStatsController(
         ProductRepository productRepository,
         CategoryRepository categoryRepository,
         BrandRepository brandRepository,
         OrderRepository orderRepository,
         UserRepository userRepository,
         ProductReviewRepository productReviewRepository,
         SlideShowRepository slideShowRepository,
         ContactMessageRepository contactMessageRepository,
         CouponRepository couponRepository,
         AdminAccountRepository adminAccountRepository) {
      this.productRepository = productRepository;
      this.categoryRepository = categoryRepository;
      this.brandRepository = brandRepository;
      this.orderRepository = orderRepository;
      this.userRepository = userRepository;
      this.productReviewRepository = productReviewRepository;
      this.slideShowRepository = slideShowRepository;
      this.contactMessageRepository = contactMessageRepository;
      this.couponRepository = couponRepository;
      this.adminAccountRepository = adminAccountRepository;
   }

   @GetMapping
   public ResponseEntity<Map<String, Object>> getStats() {
      Map<String, Object> stats = new LinkedHashMap<>();
      stats.put("products", productRepository.count());
      stats.put("categories", categoryRepository.count());
      stats.put("brands", brandRepository.count());
      stats.put("orders", orderRepository.count());
      stats.put("customers", userRepository.count());
      stats.put("reviews", productReviewRepository.count());
      stats.put("slideShows", slideShowRepository.count());
      stats.put("contacts", contactMessageRepository.count());
      stats.put("coupons", couponRepository.count());
      stats.put("adminAccounts", adminAccountRepository.count());
      double revenue = orderRepository.findAll().stream()
            .map(item -> item.getTotalAmount() == null ? 0d : item.getTotalAmount())
            .reduce(0d, Double::sum);
      stats.put("revenue", revenue);
      return ResponseEntity.ok(stats);
   }
}
