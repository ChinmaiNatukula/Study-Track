package com.studytrack.controller;

import com.studytrack.dto.ApiResponse;
import com.studytrack.dto.AuthResponse;
import com.studytrack.dto.LoginRequest;
import com.studytrack.dto.RegisterRequest;
import com.studytrack.dto.StudentResponse;
import com.studytrack.service.AuthService;
import com.studytrack.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final StudentService studentService;

    public AuthController(AuthService authService, StudentService studentService) {
        this.authService = authService;
        this.studentService = studentService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok("Registration successful", response));
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<StudentResponse>> getCurrentUser() {
        StudentResponse response = studentService.getCurrentProfile();
        return ResponseEntity.ok(ApiResponse.ok("Profile retrieved", response));
    }
}
