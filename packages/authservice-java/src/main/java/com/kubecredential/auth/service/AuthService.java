package com.kubecredential.auth.service;

import com.kubecredential.auth.config.AuthProperties;
import com.kubecredential.auth.dto.LoginRequest;
import com.kubecredential.auth.dto.SignupRequest;
import com.kubecredential.auth.dto.AuthResponse;
import com.kubecredential.auth.dto.UserResponse;
import com.kubecredential.auth.model.User;
import com.kubecredential.auth.repo.UserFileRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    private final UserFileRepository userFileRepository;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(UserFileRepository userFileRepository,
                       JwtService jwtService,
                       AuthProperties authProperties) {
        this.userFileRepository = userFileRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = new BCryptPasswordEncoder(authProperties.getSaltRounds());
    }

    public AuthResponse signup(SignupRequest request) throws IOException {
        String name = request.getName() != null ? request.getName() : "";
        String email = request.getEmail();
        String password = request.getPassword();

        if (email == null || email.isBlank() || password == null || password.isBlank()) {
            throw new IllegalArgumentException("email and password required");
        }

        Optional<User> existing = userFileRepository.findByEmail(email.toLowerCase());
        if (existing.isPresent()) {
            throw new IllegalStateException("user already exists");
        }

        String hashed = passwordEncoder.encode(password);
        User user = new User(
                UUID.randomUUID().toString(),
                name,
                email.toLowerCase(),
                hashed,
                Instant.now().toString()
        );

        userFileRepository.createUser(user);

        String token = jwtService.generateToken(user.getId(), user.getEmail());

        UserResponse userResponse = new UserResponse(user.getId(), user.getName(), user.getEmail());
        return new AuthResponse(true, userResponse, token);
    }

    public AuthResponse login(LoginRequest request) throws IOException {
        String email = request.getEmail();
        String password = request.getPassword();

        if (email == null || email.isBlank() || password == null || password.isBlank()) {
            throw new IllegalArgumentException("email and password required");
        }

        Optional<User> existingOpt = userFileRepository.findByEmail(email.toLowerCase());
        if (existingOpt.isEmpty()) {
            throw new SecurityException("invalid credentials");
        }

        User user = existingOpt.get();
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new SecurityException("invalid credentials");
        }

        String token = jwtService.generateToken(user.getId(), user.getEmail());
        UserResponse userResponse = new UserResponse(user.getId(), user.getName(), user.getEmail());
        return new AuthResponse(true, userResponse, token);
    }
}
