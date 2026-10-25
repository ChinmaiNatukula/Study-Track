package com.studytrack.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.studytrack.entity.StudySession;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class StudySessionResponse {
    private Long id;
    private Long subjectId;
    private String subjectName;
    private String subjectColor;
    private String topic;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate sessionDate;

    private Integer durationMinutes;
    private Double durationHours;
    private String notes;
    private LocalDateTime createdAt;

    public StudySessionResponse() {
    }

    public StudySessionResponse(StudySession session) {
        if (session != null) {
            this.id = session.getId();
            this.topic = session.getTopic();
            this.sessionDate = session.getSessionDate();
            this.durationMinutes = session.getDurationMinutes();
            this.durationHours = session.getDurationMinutes() != null ? Math.round((session.getDurationMinutes() / 60.0) * 10.0) / 10.0 : 0.0;
            this.notes = session.getNotes();
            this.createdAt = session.getCreatedAt();

            if (session.getSubject() != null) {
                this.subjectId = session.getSubject().getId();
                this.subjectName = session.getSubject().getName();
                this.subjectColor = session.getSubject().getColor();
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

    public String getSubjectColor() {
        return subjectColor;
    }

    public void setSubjectColor(String subjectColor) {
        this.subjectColor = subjectColor;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public LocalDate getSessionDate() {
        return sessionDate;
    }

    public void setSessionDate(LocalDate sessionDate) {
        this.sessionDate = sessionDate;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public Double getDurationHours() {
        return durationHours;
    }

    public void setDurationHours(Double durationHours) {
        this.durationHours = durationHours;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
