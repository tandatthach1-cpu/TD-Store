package com.apichinh.backend.controller;

import com.apichinh.backend.entity.Brand;
import com.apichinh.backend.repository.BrandRepository;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/brands")
@CrossOrigin(origins = "*", exposedHeaders = { "Content-Range" })
public class BrandController extends AdminCrudController<Brand, Long> {
   private static final Set<String> IMAGE_EXTENSIONS = Set.of(
         "jpg", "jpeg", "png", "gif", "webp", "bmp", "svg", "avif", "ico", "tif", "tiff", "heic", "heif");

   private final BrandRepository brandRepository;

   @Value("${app.image-storage-path:image}")
   private String storageFolder;

   public BrandController(BrandRepository brandRepository) {
      this.brandRepository = brandRepository;
   }

   @GetMapping
   public ResponseEntity<Page<Brand>> getAll(
         @RequestParam(name = "page", defaultValue = "0") int page,
         @RequestParam(name = "size", defaultValue = "10") int size) {
      Pageable pageable = PageRequest.of(page, size);
      return ResponseEntity.ok(brandRepository.findAll(pageable));
   }

   @GetMapping("{id}")
   public ResponseEntity<Brand> getById(@PathVariable Long id) {
      return getOne(brandRepository, id);
   }

   @PostMapping
   public ResponseEntity<Brand> createItem(@RequestBody Brand brand) {
      return create(brandRepository, brand);
   }

   @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
   public ResponseEntity<?> createItemWithFile(
         @ModelAttribute Brand brand,
         @RequestParam(value = "file", required = false) MultipartFile file) throws IOException {
      if (file != null && !file.isEmpty()) {
         if (!isImageFile(file)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Only image files are allowed.");
         }
         brand.setLogo(storeImage(file));
      }
      return new ResponseEntity<>(brandRepository.save(brand), HttpStatus.CREATED);
   }

   @PutMapping("{id}")
   public ResponseEntity<Brand> updateItem(@PathVariable Long id, @RequestBody Brand brand) {
      brand.setId(id);
      return update(brandRepository, id, brand);
   }

   @PutMapping(path = "{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
   public ResponseEntity<?> updateItemWithFile(
         @PathVariable Long id,
         @ModelAttribute Brand brand,
         @RequestParam(value = "file", required = false) MultipartFile file) throws IOException {
      Brand existing = brandRepository.findById(id).orElse(null);
      if (existing == null) {
         return ResponseEntity.notFound().build();
      }

      existing.setName(brand.getName());
      existing.setDescription(brand.getDescription());
      existing.setActive(brand.isActive());

      if (StringUtils.hasText(brand.getLogo()) && !brand.getLogo().startsWith("http://")
            && !brand.getLogo().startsWith("https://")) {
         existing.setLogo(brand.getLogo());
      }

      if (file != null && !file.isEmpty()) {
         if (!isImageFile(file)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Only image files are allowed.");
         }
         existing.setLogo(storeImage(file));
      }

      return ResponseEntity.ok(brandRepository.save(existing));
   }

   @DeleteMapping("{id}")
   public ResponseEntity<String> deleteItem(@PathVariable Long id) {
      return delete(brandRepository, id);
   }

   private boolean isImageFile(MultipartFile file) {
      String fileName = file.getOriginalFilename();
      String extension = getExtension(fileName);
      String contentType = file.getContentType();
      if (contentType != null && contentType.toLowerCase(Locale.ROOT).startsWith("image/")) {
         return true;
      }

      if ("svg".equals(extension)) {
         return true;
      }

      if (!StringUtils.hasText(fileName) || !fileName.contains(".")) {
         return false;
      }

      return IMAGE_EXTENSIONS.contains(extension);
   }

   private String storeImage(MultipartFile file) throws IOException {
      String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
      String extension = originalFileName.contains(".")
            ? originalFileName.substring(originalFileName.lastIndexOf('.'))
            : "";
      String storedFileName = UUID.randomUUID() + extension;
      Path uploadPath = Paths.get(storageFolder, "brands").toAbsolutePath().normalize();
      Files.createDirectories(uploadPath);
      file.transferTo(uploadPath.resolve(storedFileName));
      return storedFileName;
   }

   private String getExtension(String fileName) {
      if (!StringUtils.hasText(fileName) || !fileName.contains(".")) {
         return "";
      }
      return fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase(Locale.ROOT);
   }
}
