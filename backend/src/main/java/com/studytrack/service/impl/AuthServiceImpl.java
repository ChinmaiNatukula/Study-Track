package com.studytrack.service.impl;

import com.studytrack.dto.AuthResponse;
import com.studytrack.dto.LoginRequest;
import com.studytrack.dto.RegisterRequest;
import com.studytrack.dto.StudentResponse;
import com.studytrack.entity.Student;
import com.studytrack.exception.UserAlreadyExistsException;
import com.studytrack.repository.StudentRepository;
import com.studytrack.security.JwtUtils;
import com.studytrack.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthServiceImpl(
        AuthenticationManager authenticationManager,
        StudentRepository studentRepository,
        PasswordEncoder passwordEncoder,
        JwtUtils jwtUtils
    ) {
        this.authenticationManager = authenticationManager;
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail().toLowerCase().trim(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        Student student = studentRepository.findByEmail(request.getEmail().toLowerCase().trim())
            .orElseThrow(() -> new RuntimeException("Student not found"));

        return new AuthResponse(jwt, new StudentResponse(student));
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        if (studentRepository.existsByEmail(email)) {
            throw new UserAlreadyExistsException("An account with email " + email + " already exists");
        }

        Student student = new Student();
        student.setName(request.getName().trim());
        student.setEmail(email);
        student.setPassword(passwordEncoder.encode(request.getPassword()));
        student.setCourse(request.getCourse());
        student.setSemester(request.getSemester());
        student.setInstitution(request.getInstitution());
        student.setTargetWeeklyHours(20);

        Student saved = studentRepository.save(student);

        String jwt = jwtUtils.generateTokenFromEmail(saved.getEmail(), saved.getId(), saved.getName());

        return new AuthResponse(jwt, new StudentResponse(saved));
    }
}
