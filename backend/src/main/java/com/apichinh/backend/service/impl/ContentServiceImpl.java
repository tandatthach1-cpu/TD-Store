package com.apichinh.backend.service.impl;

import com.apichinh.backend.entity.Content;
import com.apichinh.backend.repository.ContentRepository;
import com.apichinh.backend.service.ContentService;
import jakarta.persistence.EntityNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ContentServiceImpl implements ContentService {
   private final ContentRepository contentRepository;
   @Value("${app.image-storage-path:image}")
   private String storageFolder;

   public ContentServiceImpl(ContentRepository contentRepository) {
      this.contentRepository = contentRepository;
   }

   @Override
   public Content createContent(Content content) {
      return contentRepository.save(normalizeNewContent(content));
   }

   @Override
   public Content createContentWithFile(Content content, MultipartFile file) throws IOException {
      Content normalizedContent = normalizeNewContent(content);
      normalizedContent.setImageUrl(storeFile(file));
      return contentRepository.save(normalizedContent);
   }

   @Override
   public Content getContentById(Long contentId) {
      return contentRepository.findById(contentId)
            .orElseThrow(() -> new EntityNotFoundException("Content not found with id: " + contentId));
   }

   @Override
   public Page<Content> getAllContents(String search, String contentType, String status, Pageable pageable) {
      String normalizedSearch = search == null || search.isBlank() ? null : search.trim();
      String normalizedType = contentType == null || contentType.isBlank() ? null : contentType.trim();
      String normalizedStatus = status == null || status.isBlank() ? null : status.trim();
      return contentRepository.search(normalizedSearch, normalizedType, normalizedStatus, pageable);
   }

   @Override
   public List<Content> getPublishedContentsByType(String contentType, int limit) {
      List<Content> items = contentRepository.findByContentTypeAndStatusOrderByDisplayOrderAscIdDesc(contentType, "PUBLISHED");
      return items.stream().limit(Math.max(limit, 0)).toList();
   }

   @Override
   public Content updateContent(Content content) {
      Content existing = getContentById(content.getId());
      mergeContent(existing, content);
      if (StringUtils.hasText(content.getImageUrl())) {
         existing.setImageUrl(content.getImageUrl().trim());
      }
      return contentRepository.save(existing);
   }

   @Override
   public Content updateContentWithFile(Long contentId, Content content, MultipartFile file) throws IOException {
      Content existing = getContentById(contentId);
      mergeContent(existing, content);

      if (file != null && !file.isEmpty()) {
         existing.setImageUrl(storeFile(file));
      }

      return contentRepository.save(existing);
   }

   @Override
   public void deleteContent(Long contentId) {
      if (!contentRepository.existsById(contentId)) {
         throw new EntityNotFoundException("Content not found with id: " + contentId);
      }
      contentRepository.deleteById(contentId);
   }

   private String storeFile(MultipartFile file) throws IOException {
      String fileName = StringUtils.cleanPath(file.getOriginalFilename());
      String extension = fileName.contains(".") ? fileName.substring(fileName.lastIndexOf(".")) : "";
      String storedFileName = UUID.randomUUID() + extension;
      Path uploadPath = Paths.get(storageFolder, "contents").toAbsolutePath().normalize();
      Files.createDirectories(uploadPath);
      Path filePath = uploadPath.resolve(storedFileName);
      file.transferTo(filePath);
      return storedFileName;
   }

   private Content normalizeNewContent(Content content) {
      if (content.getDisplayOrder() == null) {
         content.setDisplayOrder(0);
      }
      if (!StringUtils.hasText(content.getContentType())) {
         content.setContentType("NEWS");
      }
      if (!StringUtils.hasText(content.getStatus())) {
         content.setStatus("PUBLISHED");
      }
      if (StringUtils.hasText(content.getTitle())) {
         content.setTitle(content.getTitle().trim());
      }
      if (StringUtils.hasText(content.getSummary())) {
         content.setSummary(content.getSummary().trim());
      }
      if (StringUtils.hasText(content.getImageUrl())) {
         content.setImageUrl(normalizeImageName(content.getImageUrl()));
      }
      return content;
   }

   private void mergeContent(Content existing, Content incoming) {
      existing.setTitle(StringUtils.hasText(incoming.getTitle()) ? incoming.getTitle().trim() : existing.getTitle());
      existing.setSummary(incoming.getSummary());
      existing.setBody(incoming.getBody());
      existing.setContentType(StringUtils.hasText(incoming.getContentType()) ? incoming.getContentType() : existing.getContentType());
      existing.setStatus(StringUtils.hasText(incoming.getStatus()) ? incoming.getStatus() : existing.getStatus());
      existing.setFeatured(incoming.isFeatured());
      existing.setDisplayOrder(incoming.getDisplayOrder() == null ? 0 : incoming.getDisplayOrder());
   }

   private String normalizeImageName(String imageValue) {
      if (!StringUtils.hasText(imageValue)) {
         return imageValue;
      }
      return java.util.Arrays.stream(imageValue.split(","))
            .map(String::trim)
            .filter(StringUtils::hasText)
            .findFirst()
            .orElse(imageValue.trim());
   }
}
