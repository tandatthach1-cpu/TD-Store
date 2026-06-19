package com.apichinh.backend.controller;



import com.apichinh.backend.dto.ProductInfoDTO;
import java.util.List;
import com.apichinh.backend.response.ProductInfoResponse;
import com.apichinh.backend.service.ProductInfoService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;





@RestController
@RequestMapping("/api/productinfo")
@CrossOrigin(origins = "*", exposedHeaders = "Content-Range")
public class ProductInfoController {
    private final ProductInfoService productInfoService;

    public ProductInfoController(ProductInfoService productInfoService) {
        this.productInfoService = productInfoService;
    }

    @PostMapping("/favorites")
    public ResponseEntity<ProductInfoResponse> addFavorite(@RequestBody ProductInfoDTO productInfoDTO) {
        // Gọi service để thêm sản phẩm yêu thích
        ProductInfoResponse response = productInfoService.addFavorite(productInfoDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
 
    @GetMapping("/favorites/user/{userId}")
    public ResponseEntity<List<ProductInfoResponse>> getFavorites(@PathVariable Long userId) {
        // Gọi service để lấy danh sách sản phẩm yêu thích cho người dùng
        List<ProductInfoResponse> response = productInfoService.getFavoritesByUserId(userId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/favorites/{id}")
    public ResponseEntity<Void> deleteFavorite(@PathVariable Long id) {
        productInfoService.deleteFavorite(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    @GetMapping("/favorites/check/{userId}/{productId}")
public ResponseEntity<Boolean> checkIfFavorite(@PathVariable Long userId, @PathVariable Long productId) {
    boolean isFavorite = productInfoService.isFavorite(userId, productId);
    return new ResponseEntity<>(isFavorite, HttpStatus.OK);
}
@PostMapping("/comments")
public ResponseEntity<ProductInfoResponse> addComment(@RequestBody ProductInfoDTO productInfoDTO) {
    ProductInfoResponse response = productInfoService.addComment(productInfoDTO);
    return new ResponseEntity<>(response, HttpStatus.CREATED);
}

// New endpoint to get comments for a product
@GetMapping("/comments/{productId}")
public ResponseEntity<List<ProductInfoResponse>> getCommentsByProductId(@PathVariable Long productId) {
    List<ProductInfoResponse> response = productInfoService.getCommentsByProductId(productId);
    return new ResponseEntity<>(response, HttpStatus.OK);
}

}
