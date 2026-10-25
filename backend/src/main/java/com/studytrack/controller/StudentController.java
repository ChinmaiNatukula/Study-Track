package com.studytrack.controller;

import com.studytrack.dto.ApiResponse;
import com.studytrack.dto.StudentResponse;
import com.studytrack.dto.UpdateProfileRequest;
import com.studytrack.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<StudentResponse>> getProfile() {
        StudentResponse response = studentService.getCurrentProfile();
        return ResponseEntity.ok(ApiResponse.ok("Profile retrieved", response));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<StudentResponse>> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        StudentResponse response = studentService.updateProfile(request);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", response));
    }
}
