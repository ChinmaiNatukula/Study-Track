package com.studytrack.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.studytrack.entity.TimetableSession;

import java.time.LocalDate;
import java.time.LocalTime;

public class TimetableSessionResponse {
    private Long id;
    private Long subjectId;
    private String subjectName;
    private String subjectCode;
    private String subjectColor;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate sessionDate;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime startTime;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime endTime;

    private String topic;
    private String roomOrLink;
    private Boolean isCompleted;

    public TimetableSessionResponse() {
    }

    public TimetableSessionResponse(TimetableSession session) {
        if (session != null) {
            this.id = session.getId();
            this.sessionDate = session.getSessionDate();
            this.startTime = session.getStartTime();
            this.endTime = session.getEndTime();
            this.topic = session.getTopic();
            this.roomOrLink = session.getRoomOrLink();
            this.isCompleted = session.getIsCompleted();

            if (session.getSubject() != null) {
                this.subjectId = session.getSubject().getId();
                this.subjectName = session.getSubject().getName();
                this.subjectCode = session.getSubject().getCode();
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

    public LocalDate getSessionDate() {
        return sessionDate;
    }

    public void setSessionDate(LocalDate sessionDate) {
        this.sessionDate = sessionDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public String getRoomOrLink() {
        return roomOrLink;
    }

    public void setRoomOrLink(String roomOrLink) {
        this.roomOrLink = roomOrLink;
    }

    public Boolean getIsCompleted() {
        return isCompleted;
    }

    public void setIsCompleted(Boolean isCompleted) {
        this.isCompleted = isCompleted;
    }
}
