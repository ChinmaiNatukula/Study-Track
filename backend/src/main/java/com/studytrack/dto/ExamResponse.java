package com.studytrack.dto;

import com.studytrack.entity.Exam;
import com.studytrack.entity.PreparationStatus;

import java.time.Duration;
import java.time.LocalDateTime;

public class ExamResponse {
    private Long id;
    private Long subjectId;
    private String subjectName;
    private String subjectCode;
    private String subjectColor;
    private String examName;
    private LocalDateTime examDate;
    private String location;
    private String syllabus;
    private Integer syllabusCompletionPercentage;
    private PreparationStatus preparationStatus;
    private String targetScore;
    private Long daysRemaining;
    private boolean isPast;
    private LocalDateTime createdAt;

    public ExamResponse() {
    }

    public ExamResponse(Exam exam) {
        if (exam != null) {
            this.id = exam.getId();
            this.examName = exam.getExamName();
            this.examDate = exam.getExamDate();
            this.location = exam.getLocation();
            this.syllabus = exam.getSyllabus();
            this.syllabusCompletionPercentage = exam.getSyllabusCompletionPercentage();
            this.preparationStatus = exam.getPreparationStatus();
            this.targetScore = exam.getTargetScore();
            this.createdAt = exam.getCreatedAt();

            if (exam.getSubject() != null) {
                this.subjectId = exam.getSubject().getId();
                this.subjectName = exam.getSubject().getName();
                this.subjectCode = exam.getSubject().getCode();
                this.subjectColor = exam.getSubject().getColor();
            }

            if (exam.getExamDate() != null) {
                Duration duration = Duration.between(LocalDateTime.now(), exam.getExamDate());
                this.daysRemaining = duration.toDays();
                this.isPast = exam.getExamDate().isBefore(LocalDateTime.now());
            }
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(Long subjectId) {
        this.subjectId = subjectId;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public String getSubjectCode() {
        return subjectCode;
    }

    public void setSubjectCode(String subjectCode) {
        this.subjectCode = subjectCode;
    }

    public String getSubjectColor() {
        return subjectColor;
    }

    public void setSubjectColor(String subjectColor) {
        this.subjectColor = subjectColor;
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

    public Long getDaysRemaining() {
        return daysRemaining;
    }

    public void setDaysRemaining(Long daysRemaining) {
        this.daysRemaining = daysRemaining;
    }

    public boolean isPast() {
        return isPast;
    }

    public void setPast(boolean past) {
        isPast = past;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
