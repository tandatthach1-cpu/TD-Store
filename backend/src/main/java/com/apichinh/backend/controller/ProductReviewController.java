package com.apichinh.backend.controller;

import com.apichinh.backend.entity.Order;
import com.apichinh.backend.entity.OrderDetail;
import com.apichinh.backend.entity.Product;
import com.apichinh.backend.entity.ProductReview;
import com.apichinh.backend.entity.User;
import com.apichinh.backend.repository.OrderDetailRepository;
import com.apichinh.backend.repository.OrderRepository;
import com.apichinh.backend.repository.ProductRepository;
import com.apichinh.backend.repository.ProductReviewRepository;
import com.apichinh.backend.repository.UserRepository;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
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
@RequestMapping("/api/productReviews")
@CrossOrigin(origins = "*", exposedHeaders = { "Content-Range" })
public class ProductReviewController extends AdminCrudController<ProductReview, Long> {
   private final ProductReviewRepository productReviewRepository;
   private final ProductRepository productRepository;
   private final UserRepository userRepository;
   private final OrderRepository orderRepository;
   private final OrderDetailRepository orderDetailRepository;

   public ProductReviewController(
         ProductReviewRepository productReviewRepository,
         ProductRepository productRepository,
         UserRepository userRepository,
         OrderRepository orderRepository,
         OrderDetailRepository orderDetailRepository) {
      this.productReviewRepository = productReviewRepository;
      this.productRepository = productRepository;
      this.userRepository = userRepository;
      this.orderRepository = orderRepository;
      this.orderDetailRepository = orderDetailRepository;
   }

   @GetMapping
   public ResponseEntity<Page<ProductReview>> getAll(
         @RequestParam(name = "page", defaultValue = "0") int page,
         @RequestParam(name = "size", defaultValue = "10") int size) {
      return ResponseEntity.ok(productReviewRepository.findAll(PageRequest.of(page, size)));
   }

   @GetMapping("{id}")
   public ResponseEntity<ProductReview> getById(@PathVariable Long id) {
      return getOne(productReviewRepository, id);
   }

   @GetMapping("product/{productId}")
   public ResponseEntity<List<ProductReview>> getByProductId(@PathVariable Long productId) {
      return ResponseEntity.ok(productReviewRepository.findByProductIdAndApprovedTrueOrderByCreatedAtDesc(productId));
   }

   @GetMapping("product/{productId}/eligibility")
   public ResponseEntity<Map<String, Object>> getEligibility(
         @PathVariable Long productId,
         @RequestParam(name = "userId", required = false) Long userId) {
      Map<String, Object> response = new HashMap<>();
      if (userId == null) {
         response.put("canReview", false);
         response.put("eligible", false);
         response.put("message", "Bạn chỉ có thể đánh giá sản phẩm sau khi đơn hàng được giao thành công.");
         response.put("review", null);
         return ResponseEntity.ok(response);
      }

      if (!userRepository.existsById(userId)) {
         response.put("canReview", false);
         response.put("eligible", false);
         response.put("message", "Không tìm thấy tài khoản của bạn.");
         response.put("review", null);
         return ResponseEntity.ok(response);
      }

      EligibilityResult eligibility = resolveEligibility(userId, productId);
      response.put("canReview", eligibility.canReview);
      response.put("eligible", eligibility.canReview);
      response.put("message", eligibility.message);
      response.put("orderId", eligibility.orderId);
      response.put("review", eligibility.review);
      return ResponseEntity.ok(response);
   }

   @PostMapping
   public ResponseEntity<ProductReview> createItem(@RequestBody ProductReview review) {
      hydrateRelations(review);
      ProductReview saved = saveReview(review, false);
      return ResponseEntity.status(HttpStatus.CREATED).body(saved);
   }

   @PutMapping("{id}")
   public ResponseEntity<ProductReview> updateItem(@PathVariable Long id, @RequestBody ProductReview review) {
      review.setId(id);
      hydrateRelations(review);
      ProductReview saved = saveReview(review, true);
      return ResponseEntity.ok(saved);
   }

   @DeleteMapping("{id}")
   public ResponseEntity<String> deleteItem(@PathVariable Long id) {
      return delete(productReviewRepository, id);
   }

   private ProductReview saveReview(ProductReview review, boolean isUpdate) {
      validateReview(review);

      Long productId = review.getProductId();
      Long userId = review.getUserId();
      Long orderId = review.getOrderId();

      Product product = productRepository.findById(productId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm."));
      User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy khách hàng."));

      if (orderId == null) {
         orderId = resolveEligibleOrderId(userId, productId);
      }

      if (orderId == null) {
         throw new ResponseStatusException(
               HttpStatus.FORBIDDEN,
               "Bạn chỉ có thể đánh giá sản phẩm sau khi đơn hàng được giao thành công."
         );
      }

      Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng."));

      if (!isDeliveredStatus(order.getStatus())) {
         throw new ResponseStatusException(
               HttpStatus.FORBIDDEN,
               "Bạn chỉ có thể đánh giá sản phẩm sau khi đơn hàng được giao thành công."
         );
      }

      if (!userId.equals(order.getUserId())) {
         throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Đơn hàng không thuộc về khách hàng này.");
      }

      List<OrderDetail> orderDetails = orderDetailRepository.findByOrderIdAndProductId(orderId, productId);
      if (orderDetails == null || orderDetails.isEmpty()) {
         throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Đơn hàng này không chứa sản phẩm cần đánh giá.");
      }

      Optional<ProductReview> existingReview = productReviewRepository.findByProductIdAndUserIdAndOrderId(
            productId,
            userId,
            orderId
      );

      ProductReview target = review;
      if (existingReview.isPresent() && (!isUpdate || !existingReview.get().getId().equals(review.getId()))) {
         target = existingReview.get();
      } else if (isUpdate) {
         target = productReviewRepository.findById(review.getId())
               .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy đánh giá."));
      }

      target.setProduct(product);
      target.setUser(user);
      target.setOrder(order);
      target.setRating(review.getRating());
      target.setComment(review.getComment());
      target.setApproved(review.isApproved());

      return productReviewRepository.save(target);
   }

   private EligibilityResult resolveEligibility(Long userId, Long productId) {
      List<Order> orders = orderRepository.findByUserIdOrderByDateDesc(userId);
      for (Order order : orders) {
         if (!isDeliveredStatus(order.getStatus())) {
            continue;
         }

         List<OrderDetail> orderDetails = orderDetailRepository.findByOrderIdAndProductId(order.getId(), productId);
         if (orderDetails == null || orderDetails.isEmpty()) {
            continue;
         }

         Optional<ProductReview> review = productReviewRepository.findByProductIdAndUserIdAndOrderId(
               productId,
               userId,
               order.getId()
         );
         return new EligibilityResult(
               true,
               order.getId(),
               review.orElse(null),
               review.isPresent()
                     ? "Bạn đã gửi đánh giá cho đơn hàng này. Bạn có thể cập nhật lại nội dung."
                     : "Bạn có thể gửi đánh giá cho sản phẩm này."
         );
      }

      return new EligibilityResult(
            false,
            null,
            null,
            "Bạn chỉ có thể đánh giá sản phẩm sau khi đơn hàng được giao thành công."
      );
   }

   private Long resolveEligibleOrderId(Long userId, Long productId) {
      return resolveEligibility(userId, productId).orderId;
   }

   private void validateReview(ProductReview review) {
      if (review.getProductId() == null) {
         throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thiếu sản phẩm đánh giá.");
      }
      if (review.getUserId() == null) {
         throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thiếu khách hàng đánh giá.");
      }
      if (review.getRating() == null || review.getRating() < 1 || review.getRating() > 5) {
         throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Số sao phải từ 1 đến 5.");
      }
      if (review.getComment() == null || review.getComment().trim().isEmpty()) {
         throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vui lòng nhập nội dung bình luận.");
      }
   }

   private void hydrateRelations(ProductReview review) {
      if (review.getProduct() == null && review.getProductId() != null) {
         Product product = productRepository.findById(review.getProductId()).orElse(null);
         review.setProduct(product);
      }
      if (review.getUser() == null && review.getUserId() != null) {
         User user = userRepository.findById(review.getUserId()).orElse(null);
         review.setUser(user);
      }
      if (review.getOrder() == null && review.getOrderId() != null) {
         Order order = orderRepository.findById(review.getOrderId()).orElse(null);
         review.setOrder(order);
      }
   }

   private boolean isDeliveredStatus(String status) {
      if (status == null) {
         return false;
      }

      String normalized = status.trim().toUpperCase();
      return "DELIVERED".equals(normalized) || "COMPLETED".equals(normalized);
   }

   private static final class EligibilityResult {
      private final boolean canReview;
      private final Long orderId;
      private final ProductReview review;
      private final String message;

      private EligibilityResult(boolean canReview, Long orderId, ProductReview review, String message) {
         this.canReview = canReview;
         this.orderId = orderId;
         this.review = review;
         this.message = message;
      }
   }
}
