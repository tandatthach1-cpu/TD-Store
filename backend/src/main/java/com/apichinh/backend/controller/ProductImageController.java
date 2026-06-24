package com.apichinh.backend.controller;

import com.apichinh.backend.entity.Product;
import com.apichinh.backend.entity.ProductImage;
import com.apichinh.backend.repository.ProductImageRepository;
import com.apichinh.backend.repository.ProductRepository;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
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
@RequestMapping("/api/productImages")
@CrossOrigin(origins = "*", exposedHeaders = { "Content-Range" })
public class ProductImageController {
   private final ProductImageRepository productImageRepository;
   private final ProductRepository productRepository;

   @Value("${app.image-storage-path:image}")
   private String storageFolder;

   public ProductImageController(ProductImageRepository productImageRepository, ProductRepository productRepository) {
      this.productImageRepository = productImageRepository;
      this.productRepository = productRepository;
   }

   @GetMapping
   public ResponseEntity<List<ProductImage>> getAll(@RequestParam(name = "productId", required = false) Long productId) {
      if (productId != null) {
         return ResponseEntity.ok(productImageRepository.findByProductIdOrderBySortOrderAscIdAsc(productId));
      }
      return ResponseEntity.ok(productImageRepository.findAll());
   }

   @GetMapping("{id}")
   public ResponseEntity<ProductImage> getById(@PathVariable Long id) {
      return productImageRepository.findById(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
   }

   @PostMapping
   public ResponseEntity<?> create(
         @RequestParam("productId") Long productId,
         @RequestParam(value = "file", required = false) MultipartFile file,
         @RequestParam(value = "imageUrl", required = false) String imageUrl,
         @RequestParam(name = "thumbnail", defaultValue = "false") boolean thumbnail,
         @RequestParam(name = "sortOrder", defaultValue = "0") Integer sortOrder) throws IOException {
      Product product = productRepository.findById(productId).orElse(null);
      if (product == null) {
         return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Product not found");
      }

      ProductImage item = new ProductImage();
      item.setProduct(product);
      item.setThumbnail(thumbnail);
      item.setSortOrder(sortOrder);
      item.setImageUrl(file != null && !file.isEmpty() ? storeFile(file) : imageUrl);

      // Không cập nhật ảnh chính của sản phẩm từ ảnh phụ.
      // Ảnh chính chỉ do ProductController/Products module quản lý (field Product.photo).
      // Giữ thumbnail chỉ phục vụ sắp xếp/hiển thị trong gallery nếu cần.
      // if (thumbnail) {
      //    product.setPhoto(item.getImageUrl());
      //    productRepository.save(product);
      // }


      return new ResponseEntity<>(productImageRepository.save(item), HttpStatus.CREATED);
   }

   @PutMapping("{id}")
   public ResponseEntity<?> update(
         @PathVariable Long id,
         @ModelAttribute ProductImage image,
         @RequestParam(value = "file", required = false) MultipartFile file) throws IOException {
      ProductImage existing = productImageRepository.findById(id).orElse(null);
      if (existing == null) {
         return ResponseEntity.notFound().build();
      }

      if (image.getSortOrder() != null) {
         existing.setSortOrder(image.getSortOrder());
      }
      existing.setThumbnail(image.isThumbnail());

      if (StringUtils.hasText(image.getImageUrl())) {
         existing.setImageUrl(image.getImageUrl());
      }
      if (file != null && !file.isEmpty()) {
         existing.setImageUrl(storeFile(file));
      }

      // Không cập nhật ảnh chính của sản phẩm từ ảnh phụ.
      // Ảnh chính chỉ do ProductController/Products module quản lý (field Product.photo).
      // if (existing.isThumbnail() && existing.getProduct() != null) {
      //    existing.getProduct().setPhoto(existing.getImageUrl());
      //    productRepository.save(existing.getProduct());
      // }


      return ResponseEntity.ok(productImageRepository.save(existing));
   }

   @DeleteMapping("{id}")
   public ResponseEntity<String> delete(@PathVariable Long id) {
      if (!productImageRepository.existsById(id)) {
         return ResponseEntity.notFound().build();
      }
      productImageRepository.deleteById(id);
      return ResponseEntity.ok("Deleted successfully");
   }

   private String storeFile(MultipartFile file) throws IOException {
      String fileName = StringUtils.cleanPath(file.getOriginalFilename());
      String extension = fileName.contains(".") ? fileName.substring(fileName.lastIndexOf(".")) : "";
      String storedFileName = UUID.randomUUID() + extension;
      Path uploadPath = Paths.get(storageFolder, "products").toAbsolutePath().normalize();
      Files.createDirectories(uploadPath);
      Path filePath = uploadPath.resolve(storedFileName);
      file.transferTo(filePath);
      return storedFileName;
   }
}
