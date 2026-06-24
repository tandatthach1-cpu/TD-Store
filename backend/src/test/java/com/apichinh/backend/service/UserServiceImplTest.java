package com.apichinh.backend.service;

import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.apichinh.backend.entity.User;
import com.apichinh.backend.repository.AddressRepository;
import com.apichinh.backend.repository.UserRepository;
import com.apichinh.backend.service.impl.UserServiceImpl;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {
    @Mock
    private UserRepository userRepository;

    @Mock
    private AddressRepository addressRepository;

    private PasswordEncoder passwordEncoder;
    private UserServiceImpl userService;

    @BeforeEach
    void setUp() {
        passwordEncoder = new BCryptPasswordEncoder(4);
        userService = new UserServiceImpl(userRepository, addressRepository, passwordEncoder);
    }

    @Test
    void createUserHashesPasswordBeforeSaving() {
        User user = user("member@example.com", "0912345678", "PlainPassword1");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User savedUser = userService.createUser(user);

        assertNotEquals("PlainPassword1", savedUser.getPass());
        assertTrue(passwordEncoder.matches("PlainPassword1", savedUser.getPass()));
        verify(userRepository).save(user);
    }

    @Test
    void authenticateAcceptsBcryptPassword() {
        User user = user("member@example.com", "0912345678", passwordEncoder.encode("PlainPassword1"));
        when(userRepository.findFirstByEmail("member@example.com")).thenReturn(Optional.of(user));

        User authenticatedUser = userService.authenticate("member@example.com", "PlainPassword1");

        assertSame(user, authenticatedUser);
    }

    @Test
    void authenticateUpgradesLegacyPlaintextPassword() {
        User user = user("member@example.com", "0912345678", "OldPassword1");
        when(userRepository.findByNumphone("0912345678")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User authenticatedUser = userService.authenticate("0912345678", "OldPassword1");

        assertSame(user, authenticatedUser);
        assertNotEquals("OldPassword1", user.getPass());
        assertTrue(passwordEncoder.matches("OldPassword1", user.getPass()));
        verify(userRepository).save(user);
    }

    private User user(String email, String phone, String password) {
        User user = new User();
        user.setUsername("member");
        user.setEmail(email);
        user.setNumphone(phone);
        user.setPass(password);
        return user;
    }
}
