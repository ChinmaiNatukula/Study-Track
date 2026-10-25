package com.studytrack.service;

import com.studytrack.dto.AuthResponse;
import com.studytrack.dto.LoginRequest;
import com.studytrack.dto.RegisterRequest;

public interface AuthService {
    AuthResponse login(LoginRequest request);
    AuthResponse register(RegisterRequest request);
}
