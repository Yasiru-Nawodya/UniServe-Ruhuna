package com.uniserve.backend.controller;

import com.uniserve.backend.dto.auth.AuthResponse;
import com.uniserve.backend.dto.auth.LoginRequest;
import com.uniserve.backend.dto.auth.RegisterRequest;
import com.uniserve.backend.entity.User;
import com.uniserve.backend.repository.UserRepository;
import com.uniserve.backend.service.AuthService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    public AuthController(
            AuthService authService,
            UserRepository userRepository) {

        this.authService = authService;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request) {

        return ResponseEntity.ok(
                authService.login(request)
        );
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> getCurrentUser(
            Authentication authentication) {

        User user =
                userRepository
                        .findByEmail(
                                authentication.getName()
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Authenticated user not found."
                                )
                        );

        return ResponseEntity.ok(
                new AuthResponse(
                        null,
                        user.getId(),
                        user.getFullName(),
                        user.getEmail(),
                        user.getRole().name()
                )
        );
    }
}