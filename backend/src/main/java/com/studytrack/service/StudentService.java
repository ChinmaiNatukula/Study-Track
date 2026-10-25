package com.studytrack.service;

import com.studytrack.dto.StudentResponse;
import com.studytrack.dto.UpdateProfileRequest;
import com.studytrack.entity.Student;

public interface StudentService {
    StudentResponse getCurrentProfile();
    StudentResponse updateProfile(UpdateProfileRequest request);
    Student getAuthenticatedStudentEntity();
}
