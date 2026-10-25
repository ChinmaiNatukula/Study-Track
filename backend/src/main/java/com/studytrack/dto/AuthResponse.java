package com.studytrack.dto;

public class AuthResponse {
    private String token;
    private String tokenType = "Bearer";
    private StudentResponse student;

    public AuthResponse() {
    }

    public AuthResponse(String token, StudentResponse student) {
        this.token = token;
        this.student = student;
        this.tokenType = "Bearer";
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public StudentResponse getStudent() {
        return student;
    }

    public void setStudent(StudentResponse student) {
        this.student = student;
    }
}
