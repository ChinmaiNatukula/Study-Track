package com.studytrack.dto;

import com.studytrack.entity.Subject;
import java.time.LocalDateTime;

public class SubjectResponse {
    private Long id;
    private String name;
    private String code;
    private String description;
    private Double targetStudyHours;
    private Double loggedStudyHours = 0.0;
    private Integer completionPercentage = 0;
    private String color;
    private Long totalTasks = 0L;
    private Long completedTasks = 0L;
    private LocalDateTime createdAt;

    public SubjectResponse() {
    }

    public SubjectResponse(Subject subject) {
        if (subject != null) {
            this.id = subject.getId();
            this.name = subject.getName();
            this.code = subject.getCode();
            this.description = subject.getDescription();
            this.targetStudyHours = subject.getTargetStudyHours();
            this.color = subject.getColor();
            this.createdAt = subject.getCreatedAt();
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

    public Double getLoggedStudyHours() {
        return loggedStudyHours;
    }

    public void setLoggedStudyHours(Double loggedStudyHours) {
        this.loggedStudyHours = loggedStudyHours;
    }

    public Integer getCompletionPercentage() {
        return completionPercentage;
    }

    public void setCompletionPercentage(Integer completionPercentage) {
        this.completionPercentage = completionPercentage;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Long getTotalTasks() {
        return totalTasks;
    }

    public void setTotalTasks(Long totalTasks) {
        this.totalTasks = totalTasks;
    }

    public Long getCompletedTasks() {
        return completedTasks;
    }

    public void setCompletedTasks(Long completedTasks) {
        this.completedTasks = completedTasks;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
