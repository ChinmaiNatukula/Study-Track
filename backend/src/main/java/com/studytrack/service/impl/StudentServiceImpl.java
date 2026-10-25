package com.studytrack.service.impl;

import com.studytrack.dto.StudentResponse;
import com.studytrack.dto.UpdateProfileRequest;
import com.studytrack.entity.Student;
import com.studytrack.exception.BadRequestException;
import com.studytrack.exception.ResourceNotFoundException;
import com.studytrack.repository.StudentRepository;
import com.studytrack.security.SecurityUtils;
import com.studytrack.service.StudentService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;

    public StudentServiceImpl(StudentRepository studentRepository, PasswordEncoder passwordEncoder) {
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional(readOnly = true)
    public StudentResponse getCurrentProfile() {
        Student student = getAuthenticatedStudentEntity();
        return new StudentResponse(student);
    }

    @Override
    @Transactional
    public StudentResponse updateProfile(UpdateProfileRequest request) {
        Student student = getAuthenticatedStudentEntity();

        if (request.getName() != null && !request.getName().isBlank()) {
            student.setName(request.getName().trim());
        }
        if (request.getCourse() != null) {
            student.setCourse(request.getCourse().trim());
        }
        if (request.getSemester() != null) {
            student.setSemester(request.getSemester().trim());
        }
        if (request.getInstitution() != null) {
            student.setInstitution(request.getInstitution().trim());
        }
        if (request.getTargetWeeklyHours() != null && request.getTargetWeeklyHours() > 0) {
            student.setTargetWeeklyHours(request.getTargetWeeklyHours());
        }

        // Change password if requested
        if (request.getNewPassword() != null && !request.getNewPassword().isBlank()) {
            if (request.getCurrentPassword() == null || !passwordEncoder.matches(request.getCurrentPassword(), student.getPassword())) {
                throw new BadRequestException("Current password does not match");
            }
            if (request.getNewPassword().length() < 6) {
                throw new BadRequestException("New password must be at least 6 characters");
            }
            student.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }

        Student updated = studentRepository.save(student);
        return new StudentResponse(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public Student getAuthenticatedStudentEntity() {
        Long studentId = SecurityUtils.getCurrentStudentId();
        return studentRepository.findById(studentId)
            .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + studentId));
    }
}
