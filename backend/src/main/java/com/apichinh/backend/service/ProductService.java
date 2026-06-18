package com.apichinh.backend.service;

import com.apichinh.backend.entity.Product;
import java.io.IOException;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

public interface ProductService {
    String uploadDir = "image/products";

    Product createProduct(Product product);

    Product getProductById(Long productId);

    Page<Product> getAllProducts(Pageable pageable);

    Product updateProduct(Product product);

    void deleteProduct(Long productId);

    Product uploadProduct(Product product, MultipartFile file) throws IOException;

    Product updateProductWithFile(Long productId, Product product, MultipartFile file) throws IOException;

    Page<Product> searchProductByKeyword(String keyword, Long categoryId, Integer pageNumber, Integer pageSize);

    Page<Product> getProductsByCategoryTitle(String categoryTitle, Pageable pageable);

    Page<Product> getProductsByCategoryId(Long categoryId, Pageable pageable);

    List<Product> getSuggestionsByCategory(Long categoryId, Long excludeProductId, int limit);

}
