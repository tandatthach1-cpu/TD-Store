package com.apichinh.backend.service;

import com.apichinh.backend.entity.Content;
import java.io.IOException;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

public interface ContentService {
   String uploadDir = "image/contents";

   Content createContent(Content content);

   Content createContentWithFile(Content content, MultipartFile file) throws IOException;

   Content getContentById(Long contentId);

   Page<Content> getAllContents(String search, String contentType, String status, Pageable pageable);

   List<Content> getPublishedContentsByType(String contentType, int limit);

   Content updateContent(Content content);

   Content updateContentWithFile(Long contentId, Content content, MultipartFile file) throws IOException;

   void deleteContent(Long contentId);
}
