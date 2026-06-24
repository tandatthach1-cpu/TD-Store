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
   private final ProductRepository productRepository;

   public ProductServiceImpl(final ProductRepository productRepository) {
      this.productRepository = productRepository;
   }

   @Override
   public Product createProduct(Product product) {
      prepareProduct(product);
      return productRepository.save(product);
   }

   @Override
   public Product getProductById(Long productId) {
      return productRepository.findById(productId)
            .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + productId));
   }

   @Override
   public Page<Product> getAllProducts(Pageable pageable) {
      return productRepository.findAll(pageable);
   }

   @Override
   public Page<Product> getAdminProducts(String search, Long categoryId, Long brandId, Boolean visible, Pageable pageable) {
      String normalizedSearch = search == null || search.isBlank() ? null : search.trim();
      return productRepository.search(normalizedSearch, categoryId, brandId, visible, pageable);
   }

   @Override
   public Product updateProduct(Product product) {
      Product existingProduct = getProductById(product.getId());
      mergeProduct(existingProduct, product);
      return productRepository.save(existingProduct);
   }

   @Override
   public Product updateProductWithFile(Long productId, Product product, MultipartFile file) throws IOException {
      Product existingProduct = getProductById(productId);
      if (file != null && !file.isEmpty()) {
         existingProduct.setPhoto(storeFile(file));
      }
      mergeProduct(existingProduct, product);
      return productRepository.save(existingProduct);
   }

   @Override
   public void deleteProduct(Long productId) {
      productRepository.deleteById(productId);
   }

   @Override
   public Product uploadProduct(Product product, MultipartFile file) throws IOException {
      if (file != null && !file.isEmpty()) {
         product.setPhoto(storeFile(file));
      }
      prepareProduct(product);
      return productRepository.save(product);
   }

   @Override
   public Page<Product> searchProductByKeyword(String keyword, Long categoryId, Integer pageNumber, Integer pageSize) {
      Pageable pageable = PageRequest.of(pageNumber, pageSize);
      if (categoryId != null && categoryId > 0) {
         return productRepository.search(keyword, categoryId, null, true, pageable);
      }
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
      Pageable pageable = PageRequest.of(0, limit + 1);
      Page<Product> products = productRepository.findByCategoryId(categoryId, pageable);
      return products.getContent().stream()
            .filter(item -> !item.getId().equals(excludeProductId))
            .limit(limit)
            .collect(Collectors.toList());
   }

   private void prepareProduct(Product product) {
      if (product.getCategory() != null) {
         product.setCategoryId(product.getCategory().getId());
      }
      if (product.getBrand() != null) {
         product.setBrandId(product.getBrand().getId());
      }
      if (product.getOriginalPrice() == null) {
         product.setOriginalPrice(product.getPrice());
      }
      if (product.getStockQuantity() == null) {
         product.setStockQuantity(0);
      }
   }

   private void mergeProduct(Product existingProduct, Product incomingProduct) {
      existingProduct.setTitle(incomingProduct.getTitle());
      existingProduct.setDescription(incomingProduct.getDescription());
      existingProduct.setDetailedDescription(incomingProduct.getDetailedDescription());
      existingProduct.setPrice(incomingProduct.getPrice());
      existingProduct.setOriginalPrice(incomingProduct.getOriginalPrice() == null
            ? incomingProduct.getPrice()
            : incomingProduct.getOriginalPrice());
      existingProduct.setStockQuantity(incomingProduct.getStockQuantity() == null ? 0 : incomingProduct.getStockQuantity());
      existingProduct.setVisible(incomingProduct.isVisible());
      existingProduct.setFeatured(incomingProduct.isFeatured());
      existingProduct.setBestSeller(incomingProduct.isBestSeller());

      if (incomingProduct.getCategory() != null) {
         existingProduct.setCategory(incomingProduct.getCategory());
      }
      if (incomingProduct.getBrand() != null) {
         existingProduct.setBrand(incomingProduct.getBrand());
      }
   }

   private String storeFile(MultipartFile file) throws IOException {
      String fileName = StringUtils.cleanPath(file.getOriginalFilename());
      String fileExtension = fileName.contains(".") ? fileName.substring(fileName.lastIndexOf(".")) : "";
      String storedFileName = UUID.randomUUID() + fileExtension;
      Path uploadPath = Paths.get("image/products");
      Files.createDirectories(uploadPath);
      Path filePath = uploadPath.resolve(storedFileName);
      file.transferTo(filePath);
      return storedFileName;
   }
}
