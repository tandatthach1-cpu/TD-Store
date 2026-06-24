package com.apichinh.backend.controller;

import com.apichinh.backend.entity.Content;
import com.apichinh.backend.service.ContentService;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/contents")
@CrossOrigin(origins = "*", exposedHeaders = { "Content-Range" })
public class ContentController {
   private final ContentService contentService;
   @Value("${app.image-storage-path:image}")
   private String storageFolder;

   public ContentController(ContentService contentService) {
      this.contentService = contentService;
   }

   @PostMapping
   public ResponseEntity<Content> createContent(
         @ModelAttribute Content content,
         @RequestParam(value = "file", required = false) MultipartFile file) throws IOException {
      Content savedContent = file != null && !file.isEmpty()
            ? contentService.createContentWithFile(content, file)
            : contentService.createContent(content);
      return new ResponseEntity<>(savedContent, HttpStatus.CREATED);
   }

   @GetMapping("/{id}")
   public ResponseEntity<Content> getContentById(@PathVariable("id") Long contentId) {
      return ResponseEntity.ok(contentService.getContentById(contentId));
   }

   @GetMapping
   public ResponseEntity<Page<Content>> getAllContents(
         @RequestParam(name = "page", defaultValue = "0") int page,
         @RequestParam(name = "size", defaultValue = "10") int size,
         @RequestParam(name = "search", required = false) String search,
         @RequestParam(name = "contentType", required = false) String contentType,
         @RequestParam(name = "status", required = false) String status) {
      Pageable pageable = PageRequest.of(page, size);
      return ResponseEntity.ok(contentService.getAllContents(search, contentType, status, pageable));
   }

   @GetMapping("/images/{imageName:.+}")
   public ResponseEntity<Resource> getContentImage(@PathVariable String imageName) throws IOException {
      Path contentRoot = Paths.get(storageFolder, "contents").toAbsolutePath().normalize();
      Path imagePath = contentRoot.resolve(imageName).normalize();

      if (!imagePath.startsWith(contentRoot)) {
         return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
      }

      Resource resource = new UrlResource(imagePath.toUri());
      if (!resource.exists() || !resource.isReadable()) {
         return ResponseEntity.notFound().build();
      }

      String contentType = Files.probeContentType(imagePath);
      HttpHeaders headers = new HttpHeaders();
      headers.setContentType(contentType != null ? MediaType.parseMediaType(contentType) : MediaType.APPLICATION_OCTET_STREAM);
      return new ResponseEntity<>(resource, headers, HttpStatus.OK);
   }

   @PutMapping("/{id}")
   public ResponseEntity<Content> updateContent(
         @PathVariable("id") Long contentId,
         @ModelAttribute Content content,
         @RequestParam(value = "file", required = false) MultipartFile file) throws IOException {
      content.setId(contentId);
      Content updatedContent = file != null && !file.isEmpty()
            ? contentService.updateContentWithFile(contentId, content, file)
            : contentService.updateContent(content);
      return ResponseEntity.ok(updatedContent);
   }

   @DeleteMapping("/{id}")
   public ResponseEntity<String> deleteContent(@PathVariable("id") Long contentId) {
      contentService.deleteContent(contentId);
      return ResponseEntity.ok("Content deleted successfully");
   }
}
