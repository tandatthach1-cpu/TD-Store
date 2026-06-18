package com.apichinh.backend.service.impl;

import com.apichinh.backend.entity.Product;
import com.apichinh.backend.repository.ProductRepository;
import com.apichinh.backend.service.ProductService;
import jakarta.persistence.EntityNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ProductServiceImpl implements ProductService {
   private ProductRepository productRepository;

   @Override
   public Product createProduct(Product product) {
      // Lưu categoryId khi tạo sản phẩm mới
      if (product.getCategory() != null) {
         product.setCategoryId(product.getCategory().getId());
      }
      return productRepository.save(product);
   }

   public Product getProductById(Long productId) {
      Optional<Product> optionalProduct = this.productRepository.findById(productId);
      return (Product) optionalProduct.get();
   }

   public Page<Product> getAllProducts(Pageable pageable) {
      return this.productRepository.findAll(pageable);
   }

   @Override
   public Product updateProduct(Product product) {
      Product existingProduct = productRepository.findById(product.getId())
            .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + product.getId()));

      existingProduct.setTitle(product.getTitle());
      existingProduct.setDescription(product.getDescription());
      existingProduct.setPrice(product.getPrice());

      // Cập nhật categoryId và category
      if (product.getCategory() != null) {
         existingProduct.setCategory(product.getCategory());
         existingProduct.setCategoryId(product.getCategory().getId()); // Cập nhật categoryId
      }

      return productRepository.save(existingProduct);
   }

   @Override
   public Product updateProductWithFile(Long productId, Product product, MultipartFile file) throws IOException {
      Product existingProduct = productRepository.findById(productId)
            .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + productId));

      if (file != null && !file.isEmpty()) {
         String fileName = StringUtils.cleanPath(file.getOriginalFilename());
         String fileExtension = fileName.substring(fileName.lastIndexOf("."));
         String storedFileName = UUID.randomUUID().toString() + fileExtension;
         Path uploadPath = Paths.get("image/products");
         Files.createDirectories(uploadPath);
         Path filePath = uploadPath.resolve(storedFileName);
         file.transferTo(filePath);
         existingProduct.setPhoto(storedFileName);
      }

      existingProduct.setTitle(product.getTitle());
      existingProduct.setDescription(product.getDescription());
      existingProduct.setPrice(product.getPrice());

      // Cập nhật categoryId và category
      if (product.getCategory() != null) {
         existingProduct.setCategory(product.getCategory());
         existingProduct.setCategoryId(product.getCategory().getId()); // Cập nhật categoryId
      }

      return productRepository.save(existingProduct);
   }

   public void deleteProduct(Long productId) {
      this.productRepository.deleteById(productId);
   }

   @Override
   public Product uploadProduct(Product product, MultipartFile file) throws IOException {
      String fileName = StringUtils.cleanPath(file.getOriginalFilename());
      String fileExtension = fileName.substring(fileName.lastIndexOf("."));
      String storedFileName = UUID.randomUUID().toString() + fileExtension;
      Path uploadPath = Paths.get("image/products");
      Files.createDirectories(uploadPath);
      Path filePath = uploadPath.resolve(storedFileName);
      file.transferTo(filePath);
      product.setPhoto(storedFileName);

      // Lưu categoryId khi upload
      if (product.getCategory() != null) {
         product.setCategoryId(product.getCategory().getId());
      }

      return productRepository.save(product);
   }

   public ProductServiceImpl(final ProductRepository productRepository) {
      this.productRepository = productRepository;
   }

   @Override
   public Page<Product> searchProductByKeyword(String keyword, Long categoryId, Integer pageNumber, Integer pageSize) {
      Pageable pageable = PageRequest.of(pageNumber, pageSize);
      return productRepository.findByTitleContainingIgnoreCase(keyword, pageable);
   }

   @Override
   public Page<Product> getProductsByCategoryTitle(String categoryTitle, Pageable pageable) {
      return productRepository.findByCategory_TitleIgnoreCase(categoryTitle, pageable);
   }

   @Override
   public Page<Product> getProductsByCategoryId(Long categoryId, Pageable pageable) {
      return productRepository.findByCategoryId(categoryId, pageable);
   }

   @Override
   public List<Product> getSuggestionsByCategory(Long categoryId, Long excludeProductId, int limit) {
      Pageable pageable = PageRequest.of(0, limit);
      Page<Product> products = productRepository.findByCategoryId(categoryId, pageable);
      return products.getContent().stream()
              .filter(p -> !p.getId().equals(excludeProductId))
              .limit(limit)
              .collect(Collectors.toList());
   }
}
