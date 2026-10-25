package com.studytrack.service;

import com.studytrack.dto.NoteRequest;
import com.studytrack.dto.NoteResponse;

import java.util.List;

public interface NoteService {
    List<NoteResponse> searchNotes(Long subjectId, String topic, String search);
    NoteResponse getNoteById(Long id);
    NoteResponse createNote(NoteRequest request);
    NoteResponse updateNote(Long id, NoteRequest request);
    NoteResponse togglePin(Long id);
    void deleteNote(Long id);
}
