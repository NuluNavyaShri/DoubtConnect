package com.app.doubtconnect.service;

import com.app.doubtconnect.dto.LoginDTO;
import com.app.doubtconnect.dto.SignupDTO;
import com.app.doubtconnect.dto.UserResponse;
import com.app.doubtconnect.model.User;
import com.app.doubtconnect.repository.UserRepository;
import com.app.doubtconnect.security.JwtService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public void signup(SignupDTO payload) {

        if (userRepository.findByUsername(payload.getUsername()).isPresent()) {
            throw new IllegalStateException("User already exists");
        }

        User user = new User();
        user.setUsername(payload.getUsername());
        user.setFirstName(payload.getFirstName());
        user.setLastName(payload.getLastName());
        user.setPassword(passwordEncoder.encode(payload.getPassword()));
        user.setRole("ROLE_USER");

        userRepository.save(user);

        log.info("New user registered: {}", payload.getUsername());
    }

    public void login(LoginDTO payload, HttpServletResponse response) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        payload.getUsername(),
                        payload.getPassword()
                )
        );

        if (!authentication.isAuthenticated()) {
            throw new UsernameNotFoundException("Invalid credentials");
        }

        String jwtToken = jwtService.generateToken(payload.getUsername());

        Cookie cookie = new Cookie("jwt", jwtToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(24 * 60 * 60);

        response.addCookie(cookie);

        log.info("User logged in: {}", payload.getUsername());
    }

    public void logout(HttpServletResponse response) {

        Cookie cookie = new Cookie("jwt", "");
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);

        response.addCookie(cookie);

        log.info("User logged out");
    }


    public UserResponse getMe() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        Optional<User> user = userRepository.findByUsername(username);
        if(user.isEmpty()) {
            throw new UsernameNotFoundException("User not found");
        } else {
            return UserResponse.from(user.get());
        }
    }
}
