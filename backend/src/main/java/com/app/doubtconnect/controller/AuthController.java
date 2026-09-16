package com.app.doubtconnect.controller;

import com.app.doubtconnect.dto.AuthResponse;
import com.app.doubtconnect.dto.LoginDTO;
import com.app.doubtconnect.dto.SignupDTO;
import com.app.doubtconnect.dto.UserResponse;
import com.app.doubtconnect.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody SignupDTO payload) {

        authService.signup(payload);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new AuthResponse("Signup successful"));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody LoginDTO payload,
            HttpServletResponse response
    ) {
        authService.login(payload, response);
        return ResponseEntity.ok(new AuthResponse("Login successful"));
    }

    @PostMapping("/logout")
    public ResponseEntity<AuthResponse> logout(HttpServletResponse response) {
        authService.logout(response);
        return ResponseEntity.ok(new AuthResponse("Logged out successfully"));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me() {
        return ResponseEntity.ok(authService.getMe());
    }
}
