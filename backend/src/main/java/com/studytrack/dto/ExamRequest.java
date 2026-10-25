package com.studytrack.dto;

import com.studytrack.entity.PreparationStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public class ExamRequest {

    @NotNull(message = "Subject ID is required")
    private Long subjectId;

    @NotBlank(message = "Exam name is required")
    @Size(min = 2, max = 150, message = "Exam name must be between 2 and 150 characters")
    private String examName;

    @NotNull(message = "Exam date and time is required")
    private LocalDateTime examDate;

    private String location;
    private String syllabus;

    @Min(value = 0, message = "Percentage cannot be less than 0")
    @Max(value = 100, message = "Percentage cannot be greater than 100")
    private Integer syllabusCompletionPercentage = 0;

    private PreparationStatus preparationStatus = PreparationStatus.NOT_STARTED;
    private String targetScore;

    public ExamRequest() {
    }

    public Long getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(Long subjectId) {
        this.subjectId = subjectId;
    }

    public String getExamName() {
        return examName;
    }

    public void setExamName(String examName) {
        this.examName = examName;
    }

    public LocalDateTime getExamDate() {
        return examDate;
    }

    public void setExamDate(LocalDateTime examDate) {
        this.examDate = examDate;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getSyllabus() {
        return syllabus;
    }

    public void setSyllabus(String syllabus) {
        this.syllabus = syllabus;
    }

    public Integer getSyllabusCompletionPercentage() {
        return syllabusCompletionPercentage;
    }

    public void setSyllabusCompletionPercentage(Integer syllabusCompletionPercentage) {
        this.syllabusCompletionPercentage = syllabusCompletionPercentage;
    }

    public PreparationStatus getPreparationStatus() {
        return preparationStatus;
    }

    public void setPreparationStatus(PreparationStatus preparationStatus) {
        this.preparationStatus = preparationStatus;
    }

    public String getTargetScore() {
        return targetScore;
    }

    public void setTargetScore(String targetScore) {
        this.targetScore = targetScore;
    }
}
