package com.studytrack.dto;

import com.studytrack.entity.Student;
import java.time.LocalDateTime;

public class StudentResponse {
    private Long id;
    private String name;
    private String email;
    private String course;
    private String semester;
    private String institution;
    private Integer targetWeeklyHours;
    private LocalDateTime createdAt;

    public StudentResponse() {
    }

    public StudentResponse(Student student) {
        if (student != null) {
            this.id = student.getId();
            this.name = student.getName();
            this.email = student.getEmail();
            this.course = student.getCourse();
            this.semester = student.getSemester();
            this.institution = student.getInstitution();
            this.targetWeeklyHours = student.getTargetWeeklyHours();
            this.createdAt = student.getCreatedAt();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public String getSemester() {
        return semester;
    }

    public void setSemester(String semester) {
        this.semester = semester;
    }

    public String getInstitution() {
        return institution;
    }

    public void setInstitution(String institution) {
        this.institution = institution;
    }

    public Integer getTargetWeeklyHours() {
        return targetWeeklyHours;
    }

    public void setTargetWeeklyHours(Integer targetWeeklyHours) {
        this.targetWeeklyHours = targetWeeklyHours;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
