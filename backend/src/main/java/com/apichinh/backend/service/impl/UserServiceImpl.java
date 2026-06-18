package com.daohuybac.backend.service.impl;

import com.daohuybac.backend.entity.User;
import com.daohuybac.backend.repository.AddressRepository;
import com.daohuybac.backend.repository.UserRepository;
import com.daohuybac.backend.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class UserServiceImpl implements UserService {
   private UserRepository userRepository;

   public UserServiceImpl(final UserRepository userRepository, final AddressRepository addressRepository) {
      this.userRepository = userRepository;
   }

   public User createUser(User user) {
      return (User) this.userRepository.save(user);
   }

   public User getUserById(Long userId) {
      Optional<User> optionalUser = this.userRepository.findById(userId);
      return (User) optionalUser.get();
   }

   public Page<User> getAllUser(Pageable pageable) {
      return this.userRepository.findAll(pageable);
   }

   public User getUser(String user) {
      Optional<User> optionalUser = this.userRepository.findByUsername(user);
      return optionalUser.orElse(null);
   }

   @Override
   public User getUserByEmail(String email) {
      if (email == null || email.trim().isEmpty()) {
         return null;
      }
      return this.userRepository.findFirstByEmail(email.trim()).orElse(null);
   }

   @Override
   public User loginWithGoogle(User googleUser) {
      String email = googleUser.getEmail();
      if (email == null || email.trim().isEmpty()) {
         throw new IllegalArgumentException("Email is required for Google login");
      }

      User existingUser = getUserByEmail(email);
      if (existingUser != null) {
         return existingUser;
      }

      String username = googleUser.getUsername();
      if (username == null || username.trim().isEmpty()) {
         username = email.substring(0, email.indexOf("@"));
      }

      username = buildUniqueUsername(username.trim());

      User newUser = new User();
      newUser.setUsername(username);
      newUser.setEmail(email.trim());
      newUser.setPhoto(googleUser.getPhoto());
      newUser.setNumphone("");
      newUser.setPass("GOOGLE_ACCOUNT");

      return this.userRepository.save(newUser);
   }

   private String buildUniqueUsername(String username) {
      String baseUsername = username.replaceAll("[^A-Za-z0-9_]", "");
      if (baseUsername.isEmpty()) {
         baseUsername = "google_user";
      }

      String candidate = baseUsername;
      int suffix = 1;
      while (this.userRepository.existsByUsername(candidate)) {
         candidate = baseUsername + suffix;
         suffix++;
      }
      return candidate;
   }

   @Override
   public User updateUser(User user) {
      User existingUser = userRepository.findById(user.getId())
            .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + user.getId()));

      existingUser.setUsername(user.getUsername());
      existingUser.setEmail(user.getEmail());
      existingUser.setNumphone(user.getNumphone());
      existingUser.setPass(user.getPass());

      return userRepository.save(existingUser);
   }

   @Override
   public User updateUserWithFile(Long userId, User user, MultipartFile file) throws IOException {
      User existingUser = userRepository.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));

      if (file != null && !file.isEmpty()) {
         String fileName = StringUtils.cleanPath(file.getOriginalFilename());
         String fileExtension = fileName.substring(fileName.lastIndexOf("."));
         String storedFileName = UUID.randomUUID().toString() + fileExtension;
         Path uploadPath = Paths.get("image/users");
         Files.createDirectories(uploadPath);
         Path filePath = uploadPath.resolve(storedFileName);
         file.transferTo(filePath);
         existingUser.setPhoto(storedFileName);
      }

      existingUser.setUsername(user.getUsername());
      existingUser.setEmail(user.getEmail());
      existingUser.setNumphone(user.getNumphone());
      existingUser.setPass(user.getPass());

      return userRepository.save(existingUser);
   }

   public void deleteUser(Long userId) {
      this.userRepository.deleteById(userId);
   }

   public User uploadUser(User user, MultipartFile file) throws IOException {
      String fileName = StringUtils.cleanPath(file.getOriginalFilename());
      String fileExtension = fileName.substring(fileName.lastIndexOf("."));
      String var10000 = UUID.randomUUID().toString();
      String storedFileName = var10000 + fileExtension;
      Path uploadPath = Paths.get("image/users");
      Files.createDirectories(uploadPath);
      Path filePath = uploadPath.resolve(storedFileName);
      file.transferTo(filePath);
      user.setPhoto(storedFileName);
      this.userRepository.save(user);
      return user;
   }


}
