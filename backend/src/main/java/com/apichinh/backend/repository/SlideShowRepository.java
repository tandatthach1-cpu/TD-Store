package com.apichinh.backend.repository;



import com.apichinh.backend.entity.SlideShow;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SlideShowRepository extends JpaRepository<SlideShow, Long> {
   Page<SlideShow> findAll(Pageable pageable);
}
