package com.studytrack.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public class SubjectRequest {

    @NotBlank(message = "Subject name is required")
    @Size(min = 2, max = 100, message = "Subject name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Subject code is required")
    @Size(min = 1, max = 30, message = "Subject code must be between 1 and 30 characters")
    private String code;

    private String description;

    @PositiveOrZero(message = "Target study hours must be positive or zero")
    private Double targetStudyHours = 30.0;

    private String color = "#3B82F6";

    public SubjectRequest() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getTargetStudyHours() {
        return targetStudyHours;
    }

    public void setTargetStudyHours(Double targetStudyHours) {
        this.targetStudyHours = targetStudyHours;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}
