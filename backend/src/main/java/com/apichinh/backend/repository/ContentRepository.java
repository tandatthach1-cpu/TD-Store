package com.apichinh.backend.repository;

import com.apichinh.backend.entity.Content;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ContentRepository extends JpaRepository<Content, Long> {
   @Query("""
         SELECT c
         FROM Content c
         WHERE (:search IS NULL
               OR lower(c.title) LIKE lower(concat('%', :search, '%'))
               OR lower(coalesce(c.summary, '')) LIKE lower(concat('%', :search, '%')))
           AND (:contentType IS NULL OR c.contentType = :contentType)
           AND (:status IS NULL OR c.status = :status)
         ORDER BY c.displayOrder ASC, c.id DESC
         """)
   Page<Content> search(
         @Param("search") String search,
         @Param("contentType") String contentType,
         @Param("status") String status,
         Pageable pageable);

   List<Content> findByContentTypeAndStatusOrderByDisplayOrderAscIdDesc(String contentType, String status);
}
