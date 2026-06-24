package com.apichinh.backend.controller;

import com.apichinh.backend.dto.ProductDTO;
import com.apichinh.backend.entity.Brand;
import com.apichinh.backend.entity.Category;
import com.apichinh.backend.entity.Product;
import com.apichinh.backend.repository.BrandRepository;
import com.apichinh.backend.service.CategoryService;
import com.apichinh.backend.service.ProductService;
import java.io.IOException;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping({ "/api/products" })
@CrossOrigin(origins = { "*" }, exposedHeaders = { "Content-Range" })
public class ProductController {
   private final ProductService productService;
   private final CategoryService categoryService;
   private final BrandRepository brandRepository;

   public ProductController(
         final ProductService productService,
         final CategoryService categoryService,
         final BrandRepository brandRepository) {
      this.productService = productService;
      this.categoryService = categoryService;
      this.brandRepository = brandRepository;
   }

   private ProductDTO toDto(Product p) {
      return new ProductDTO(
            p.getId(),
            p.getTitle(),
            String.format("%,.0fđ", p.getPrice()),
            p.getPhoto() != null ? "/api/image/products/" + p.getPhoto() : "https://via.placeholder.com/200",
            p.getCategory() != null ? p.getCategory().getTitle() : "",
            p.isFeatured(),
            p.isBestSeller());
   }

   @PostMapping
   public ResponseEntity<?> addProduct(
         @ModelAttribute Product product,
         @RequestParam(value = "file", required = false) MultipartFile file,
         @RequestParam(value = "categoryId", required = false) Long categoryId,
         @RequestParam(value = "brandId", required = false) Long brandId) {
      if (categoryId != null) {
         Category category = this.categoryService.getCategoryById(categoryId);
         product.setCategory(category);
      }
      if (brandId != null) {
         Brand brand = brandRepository.findById(brandId).orElse(null);
         product.setBrand(brand);
      }

      try {
         Product savedProduct = file != null && !file.isEmpty()
               ? this.productService.uploadProduct(product, file)
               : this.productService.createProduct(product);
         return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
      } catch (IOException e) {
         return new ResponseEntity<>("Error uploading image.", HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

   @GetMapping({ "{id}" })
   public ResponseEntity<Product> getProductById(@PathVariable("id") Long productId) {
      Product product = this.productService.getProductById(productId);
      return new ResponseEntity<>(product, HttpStatus.OK);
   }

   @GetMapping
   public ResponseEntity<Page<Product>> getAllProducts(
         @RequestParam(name = "page", defaultValue = "0") int page,
         @RequestParam(name = "size", defaultValue = "100") int size,
         @RequestParam(name = "search", required = false) String search,
         @RequestParam(name = "categoryId", required = false) Long categoryId,
         @RequestParam(name = "brandId", required = false) Long brandId,
         @RequestParam(name = "visible", required = false) Boolean visible) {
      Pageable pageable = PageRequest.of(page, size);
      Page<Product> productPage = this.productService.getAdminProducts(search, categoryId, brandId, visible, pageable);
      return new ResponseEntity<>(productPage, HttpStatus.OK);
   }

   @PutMapping({ "{id}" })
   public ResponseEntity<?> updateProduct(
         @PathVariable("id") Long productId,
         @ModelAttribute Product product,
         @RequestParam(value = "file", required = false) MultipartFile file,
         @RequestParam(value = "categoryId", required = false) Long categoryId,
         @RequestParam(value = "brandId", required = false) Long brandId) {
      if (categoryId != null) {
         Category category = this.categoryService.getCategoryById(categoryId);
         product.setCategory(category);
      }
      if (brandId != null) {
         Brand brand = brandRepository.findById(brandId).orElse(null);
         product.setBrand(brand);
      }

      try {
         Product updatedProduct = file != null && !file.isEmpty()
               ? this.productService.updateProductWithFile(productId, product, file)
               : this.productService.updateProduct(withId(product, productId));
         return new ResponseEntity<>(updatedProduct, HttpStatus.OK);
      } catch (IOException e) {
         return new ResponseEntity<>("Error uploading image.", HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

   @DeleteMapping({ "{id}" })
   public ResponseEntity<String> deleteProduct(@PathVariable("id") Long productId) {
      this.productService.deleteProduct(productId);
      return new ResponseEntity<>("Product successfully deleted!", HttpStatus.OK);
   }

   @GetMapping("/public/products/keyword/{keyword}")
   public ResponseEntity<Page<Product>> getProductsByKeyword(
         @PathVariable String keyword,
         @RequestParam(name = "pageNumber", defaultValue = "0") Integer pageNumber,
         @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
         @RequestParam(name = "categoryId", defaultValue = "0") Long categoryId) {
      Page<Product> productPage = productService.searchProductByKeyword(keyword, categoryId, pageNumber, pageSize);
      return new ResponseEntity<>(productPage, HttpStatus.OK);
   }

   @GetMapping("/category/title/{categoryTitle}")
   public ResponseEntity<Page<Product>> getProductsByCategoryTitle(
         @PathVariable String categoryTitle,
         @RequestParam(name = "page", defaultValue = "0") int page,
         @RequestParam(name = "size", defaultValue = "100") int size) {
      Pageable pageable = PageRequest.of(page, size);
      Page<Product> products = productService.getProductsByCategoryTitle(categoryTitle, pageable);
      return new ResponseEntity<>(products, HttpStatus.OK);
   }

   @GetMapping("/category/{categoryId}")
   public ResponseEntity<Page<Product>> getProductsByCategoryId(
         @PathVariable Long categoryId,
         @RequestParam(name = "page", defaultValue = "0") int page,
         @RequestParam(name = "size", defaultValue = "100") int size) {
      Pageable pageable = PageRequest.of(page, size);
      Page<Product> products = productService.getProductsByCategoryId(categoryId, pageable);
      return ResponseEntity.ok(products);
   }

   @GetMapping("/suggestions/{productId}")
   public ResponseEntity<List<Product>> getSuggestions(
         @PathVariable Long productId,
         @RequestParam(name = "limit", defaultValue = "5") int limit) {
      Product product = productService.getProductById(productId);
      if (product.getCategory() == null) {
         return ResponseEntity.ok(new java.util.ArrayList<>());
      }
      List<Product> suggestions = productService.getSuggestionsByCategory(product.getCategory().getId(), productId, limit);
      return ResponseEntity.ok(suggestions);
   }

   private Product withId(Product product, Long productId) {
      product.setId(productId);
      return product;
   }
}
