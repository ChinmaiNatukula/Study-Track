package com.studytrack.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "exams")
public class Exam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @Column(name = "exam_name", nullable = false, length = 150)
    private String examName;

    @Column(name = "exam_date", nullable = false)
    private LocalDateTime examDate;

    @Column(length = 150)
    private String location;

    @Column(columnDefinition = "TEXT")
    private String syllabus;

    @Column(name = "syllabus_completion_percentage")
    private Integer syllabusCompletionPercentage = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "preparation_status", nullable = false, length = 30)
    private PreparationStatus preparationStatus = PreparationStatus.NOT_STARTED;

    @Column(name = "target_score", length = 20)
    private String targetScore;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Exam() {
    }

    public Exam(Student student, Subject subject, String examName, LocalDateTime examDate, String location, String syllabus, Integer syllabusCompletionPercentage, PreparationStatus preparationStatus, String targetScore) {
        this.student = student;
        this.subject = subject;
        this.examName = examName;
        this.examDate = examDate;
        this.location = location;
        this.syllabus = syllabus;
        this.syllabusCompletionPercentage = syllabusCompletionPercentage != null ? syllabusCompletionPercentage : 0;
        this.preparationStatus = preparationStatus != null ? preparationStatus : PreparationStatus.NOT_STARTED;
        this.targetScore = targetScore;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.syllabusCompletionPercentage == null) {
            this.syllabusCompletionPercentage = 0;
        }
        if (this.preparationStatus == null) {
            this.preparationStatus = PreparationStatus.NOT_STARTED;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Subject getSubject() {
        return subject;
    }

    public void setSubject(Subject subject) {
        this.subject = subject;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
