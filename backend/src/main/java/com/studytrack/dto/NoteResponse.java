package com.studytrack.dto;

import com.studytrack.entity.Note;
import java.time.LocalDateTime;

public class NoteResponse {
    private Long id;
    private Long subjectId;
    private String subjectName;
    private String subjectColor;
    private String title;
    private String topic;
    private String content;
    private String tags;
    private Boolean isPinned;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public NoteResponse() {
    }

    public NoteResponse(Note note) {
        if (note != null) {
            this.id = note.getId();
            this.title = note.getTitle();
            this.topic = note.getTopic();
            this.content = note.getContent();
            this.tags = note.getTags();
            this.isPinned = note.getIsPinned();
            this.createdAt = note.getCreatedAt();
            this.updatedAt = note.getUpdatedAt();

            if (note.getSubject() != null) {
                this.subjectId = note.getSubject().getId();
                this.subjectName = note.getSubject().getName();
                this.subjectColor = note.getSubject().getColor();
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public Boolean getIsPinned() {
        return isPinned;
    }

    public void setIsPinned(Boolean isPinned) {
        this.isPinned = isPinned;
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
