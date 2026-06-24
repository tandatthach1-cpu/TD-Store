package com.apichinh.backend.service;

import com.apichinh.backend.entity.User;
import java.io.IOException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

public interface UserService {
   String uploadDir = "image/users";

   User createUser(User user);

   User getUser(String user);
   User getUserByPhone(String phone);

   User getUserByEmail(String email);

   User authenticate(String account, String password);

   User loginWithGoogle(User googleUser);

   User getUserById(Long userId);

   Page<User> getAllUser(Pageable pageable);

   User updateUser(User user);

   void deleteUser(Long userId);

   User uploadUser(User user, MultipartFile file) throws IOException;

   User updateUserWithFile(Long userId, User user, MultipartFile file) throws IOException;

}
