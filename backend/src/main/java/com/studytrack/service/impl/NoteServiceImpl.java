package com.studytrack.service.impl;

import com.studytrack.dto.NoteRequest;
import com.studytrack.dto.NoteResponse;
import com.studytrack.entity.Note;
import com.studytrack.entity.Student;
import com.studytrack.entity.Subject;
import com.studytrack.exception.ResourceNotFoundException;
import com.studytrack.repository.NoteRepository;
import com.studytrack.security.SecurityUtils;
import com.studytrack.service.NoteService;
import com.studytrack.service.StudentService;
import com.studytrack.service.SubjectService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NoteServiceImpl implements NoteService {

    private final NoteRepository noteRepository;
    private final StudentService studentService;
    private final SubjectService subjectService;

    public NoteServiceImpl(NoteRepository noteRepository, StudentService studentService, SubjectService subjectService) {
        this.noteRepository = noteRepository;
        this.studentService = studentService;
        this.subjectService = subjectService;
    }

    @Override
    @Transactional(readOnly = true)
    public List<NoteResponse> searchNotes(Long subjectId, String topic, String search) {
        Long studentId = SecurityUtils.getCurrentStudentId();
        String trimmedTopic = (topic != null && !topic.isBlank()) ? topic.trim() : null;
        String trimmedSearch = (search != null && !search.isBlank()) ? search.trim() : null;

        return noteRepository.searchNotes(studentId, subjectId, trimmedTopic, trimmedSearch)
            .stream().map(NoteResponse::new).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public NoteResponse getNoteById(Long id) {
        Note note = getStudentNoteEntity(id);
        return new NoteResponse(note);
    }

    @Override
    @Transactional
    public NoteResponse createNote(NoteRequest request) {
        Student student = studentService.getAuthenticatedStudentEntity();
        Subject subject = subjectService.getStudentSubjectEntity(request.getSubjectId());

        Note note = new Note();
        note.setStudent(student);
        note.setSubject(subject);
        note.setTitle(request.getTitle().trim());
        note.setTopic(request.getTopic() != null ? request.getTopic().trim() : null);
        note.setContent(request.getContent());
        note.setTags(request.getTags());
        note.setIsPinned(request.getIsPinned() != null ? request.getIsPinned() : false);

        Note saved = noteRepository.save(note);
        return new NoteResponse(saved);
    }

    @Override
    @Transactional
    public NoteResponse updateNote(Long id, NoteRequest request) {
        Note note = getStudentNoteEntity(id);
        Subject subject = subjectService.getStudentSubjectEntity(request.getSubjectId());

        note.setSubject(subject);
        note.setTitle(request.getTitle().trim());
        note.setTopic(request.getTopic() != null ? request.getTopic().trim() : null);
        note.setContent(request.getContent());
        note.setTags(request.getTags());
        if (request.getIsPinned() != null) {
            note.setIsPinned(request.getIsPinned());
        }

        Note updated = noteRepository.save(note);
        return new NoteResponse(updated);
    }

    @Override
    @Transactional
    public NoteResponse togglePin(Long id) {
        Note note = getStudentNoteEntity(id);
        note.setIsPinned(!Boolean.TRUE.equals(note.getIsPinned()));
        Note updated = noteRepository.save(note);
        return new NoteResponse(updated);
    }

    @Override
    @Transactional
    public void deleteNote(Long id) {
        Note note = getStudentNoteEntity(id);
        noteRepository.delete(note);
    }

    private Note getStudentNoteEntity(Long noteId) {
        Long studentId = SecurityUtils.getCurrentStudentId();
        return noteRepository.findByIdAndStudentId(noteId, studentId)
            .orElseThrow(() -> new ResourceNotFoundException("Note not found with ID: " + noteId));
    }
}
