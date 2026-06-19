package com.apichinh.backend.repository;


import com.apichinh.backend.entity.User;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
   Optional<User> findByNumphone(String numphone);
   Page<User> findAll(Pageable pageable);

   Optional<User> findByUsername(String user);

   Optional<User> findFirstByEmail(String email);

   boolean existsByUsername(String username);

}
