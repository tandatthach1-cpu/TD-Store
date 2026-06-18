package com.daohuybac.backend.repository;


import com.daohuybac.backend.entity.User;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
   Page<User> findAll(Pageable pageable);

   Optional<User> findByUsername(String user);

   Optional<User> findFirstByEmail(String email);

   boolean existsByUsername(String username);

}
