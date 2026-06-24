package com.apichinh.backend.controller;

import com.apichinh.backend.entity.Cart;
import com.apichinh.backend.entity.User;
import com.apichinh.backend.service.CartService;
import com.apichinh.backend.service.UserService;
import java.util.List;
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
@RequestMapping({ "/api/carts" })
@CrossOrigin(origins = { "*" }, exposedHeaders = { "Content-Range" })
public class CartController {
   private final CartService cartService;
   private final UserService userService;

   @PostMapping
   public ResponseEntity<Cart> createCart(@RequestBody java.util.Map<String, Object> payload) {
      // Build a new Cart and optionally associate a user based on payload.userId
      Cart cart = new Cart();
      if (payload != null && payload.containsKey("userId")) {
         try {
            Long userId = ((Number) payload.get("userId")).longValue();
            User user = this.userService.getUserById(userId);
            if (user != null) {
               cart.setUser(user);
            }
         } catch (Exception e) {
            // malformed userId – ignore and create anonymous cart
         }
      }
      Cart savedCart = this.cartService.createCart(cart);
      return new ResponseEntity<>(savedCart, HttpStatus.CREATED);
   }

   @GetMapping({ "{id}" })
   public ResponseEntity<Cart> getCartById(@PathVariable("id") Long cartId) {
      Cart cart = this.cartService.getCartById(cartId);
      return cart != null ? new ResponseEntity<>(cart, HttpStatus.OK) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
   }

   @GetMapping({ "/user/{userId}" })
   public ResponseEntity<List<Cart>> getCartByUserId(@PathVariable("userId") Long userId) {
      List<Cart> cart = this.cartService.getCartByUserId(userId);
      return new ResponseEntity<>(cart, HttpStatus.OK);
   }

   @GetMapping
   public ResponseEntity<Page<Cart>> getAllCarts(@RequestParam(name = "page", defaultValue = "0") int page,
         @RequestParam(name = "size", defaultValue = "10") int size) {
      Pageable pageable = PageRequest.of(page, size);
      Page<Cart> categories = this.cartService.getAll(pageable);
      return new ResponseEntity<>(categories, HttpStatus.OK);
   }

   @PutMapping({ "{id}" })
   public ResponseEntity<?> updateCart(@PathVariable("id") Long cartId, @RequestBody Cart cart) {
      cart.setId(cartId);
      Cart updatedCart = this.cartService.updateCart(cart);
      return new ResponseEntity<>(updatedCart, HttpStatus.OK);
   }

   @DeleteMapping({ "{id}" })
   public ResponseEntity<String> deleteCart(@PathVariable("id") Long cartId) {
      this.cartService.deleteCart(cartId);
      return new ResponseEntity<>("Cart successfully deleted!", HttpStatus.OK);
   }

   public CartController(final CartService cartService, final UserService userService) {
      this.cartService = cartService;
      this.userService = userService;
   }
}
