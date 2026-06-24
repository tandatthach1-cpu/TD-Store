package com.apichinh.backend.service.impl;

import com.apichinh.backend.entity.User;
import com.apichinh.backend.repository.AddressRepository;
import com.apichinh.backend.repository.UserRepository;
import com.apichinh.backend.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class UserServiceImpl implements UserService {
   private UserRepository userRepository;
   private final PasswordEncoder passwordEncoder;

   public UserServiceImpl(final UserRepository userRepository, final AddressRepository addressRepository,
         final PasswordEncoder passwordEncoder) {
      this.userRepository = userRepository;
      this.passwordEncoder = passwordEncoder;
   }

   public User createUser(User user) {
      // Ensure unique username – if duplicate, append a numeric suffix
      String baseUsername = user.getUsername();
      if (baseUsername == null || baseUsername.trim().isEmpty()) {
          // Fallback: use email prefix or phone
          baseUsername = (user.getEmail() != null && !user.getEmail().isEmpty())
                  ? user.getEmail().split("@")[0]
                  : (user.getNumphone() != null ? user.getNumphone() : "user");
      }
      String candidate = baseUsername;
      int suffix = 1;
      while (this.userRepository.existsByUsername(candidate)) {
          candidate = baseUsername + suffix;
          suffix++;
      }
      user.setUsername(candidate);
      if (user.getPass() == null || user.getPass().isBlank()) {
         throw new IllegalArgumentException("Password is required");
      }
      if (user.getRole() == null || user.getRole().isBlank()) {
         user.setRole("CUSTOMER");
      }
      user.setPass(passwordEncoder.encode(user.getPass()));
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
   public User getUserByPhone(String phone) {
      if (phone == null || phone.trim().isEmpty()) {
         return null;
      }
      return this.userRepository.findByNumphone(phone.trim()).orElse(null);
   }

   @Override
   public User getUserByEmail(String email) {
      if (email == null || email.trim().isEmpty()) {
         return null;
      }
      return this.userRepository.findFirstByEmail(email.trim()).orElse(null);
   }

   @Override
   public User authenticate(String account, String rawPassword) {
      if (account == null || account.isBlank() || rawPassword == null || rawPassword.isBlank()) {
         return null;
      }

      String normalizedAccount = account.trim();
      User user = normalizedAccount.contains("@")
            ? getUserByEmail(normalizedAccount)
            : getUserByPhone(normalizedAccount);

      if (user == null) {
         user = getUser(normalizedAccount);
      }
      if (user == null || user.getPass() == null) {
         return null;
      }

      String storedPassword = user.getPass();
      boolean bcryptPassword = isBcryptHash(storedPassword);
      boolean matches = bcryptPassword
            ? passwordEncoder.matches(rawPassword, storedPassword)
            : storedPassword.equals(rawPassword);

      if (!matches) {
         return null;
      }

      // Upgrade legacy plaintext passwords after a successful login.
      if (!bcryptPassword) {
         user.setPass(passwordEncoder.encode(rawPassword));
         user = userRepository.save(user);
      }

      return user;
   }

   private boolean isBcryptHash(String password) {
      return password.matches("^\\$2[aby]\\$\\d{2}\\$.{53}$");
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

      // Fix mojibake (UTF-8 bị đọc nhầm) thường gặp khi backend/DB charset không khớp.
      // Ví dụ: "Tháº¡ch Táº¡n".
      String fixedUsername = fixMojibake(username);

      fixedUsername = buildUniqueUsername(fixedUsername.trim());

      User newUser = new User();
      newUser.setUsername(fixedUsername);
      newUser.setEmail(email.trim());
      newUser.setFullName(fixedUsername);
      newUser.setPhoto(googleUser.getPhoto());
      newUser.setNumphone("");
      newUser.setRole("CUSTOMER");
      newUser.setPass(passwordEncoder.encode(UUID.randomUUID().toString()));

      return this.userRepository.save(newUser);
   }

   private String fixMojibake(String s) {
      if (s == null) return null;
      // Trường hợp hay gặp: chứa chuỗi đặc trưng của "UTF-8 decoded as ISO-8859-1"
      // như "Tháº¡ch Táº¡n".
      String trimmed = s.trim();
      if (trimmed.isEmpty()) return trimmed;

      try {
         // Thử chuyển: lấy bytes theo ISO-8859-1 rồi decode lại UTF-8.
         // Nếu chuỗi vốn đã đúng UTF-8, việc này thường không làm hỏng thêm nhiều.
         return new String(trimmed.getBytes("ISO-8859-1"), "UTF-8");
      } catch (Exception ignored) {
         return trimmed;
      }
   }


   private String buildUniqueUsername(String username) {
      // Giữ nguyên Unicode (bao gồm tiếng Việt) để username hiển thị đúng.
      // Chỉ trim khoảng trắng.
      String baseUsername = username == null ? "" : username.trim();
      if (baseUsername.isEmpty()) {
         baseUsername = "google_user";
      }

      // Đảm bảo username duy nhất.
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
      existingUser.setFullName(user.getFullName());
      existingUser.setEmail(user.getEmail());
      existingUser.setNumphone(user.getNumphone());
      existingUser.setRole(user.getRole() == null || user.getRole().isBlank() ? existingUser.getRole() : user.getRole());
      existingUser.setActive(user.isActive());
      if (user.getPass() != null && !user.getPass().isBlank()) {
         existingUser.setPass(passwordEncoder.encode(user.getPass()));
      }

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
      existingUser.setFullName(user.getFullName());
      existingUser.setEmail(user.getEmail());
      existingUser.setNumphone(user.getNumphone());
      existingUser.setRole(user.getRole() == null || user.getRole().isBlank() ? existingUser.getRole() : user.getRole());
      existingUser.setActive(user.isActive());
      if (user.getPass() != null && !user.getPass().isBlank()) {
         existingUser.setPass(passwordEncoder.encode(user.getPass()));
      }

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
      return createUser(user);
   }


}
