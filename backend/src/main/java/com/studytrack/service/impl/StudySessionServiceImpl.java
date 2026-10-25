package com.studytrack.service.impl;

import com.studytrack.dto.StudySessionRequest;
import com.studytrack.dto.StudySessionResponse;
import com.studytrack.entity.Student;
import com.studytrack.entity.StudySession;
import com.studytrack.entity.Subject;
import com.studytrack.exception.ResourceNotFoundException;
import com.studytrack.repository.StudySessionRepository;
import com.studytrack.security.SecurityUtils;
import com.studytrack.service.StudentService;
import com.studytrack.service.StudySessionService;
import com.studytrack.service.SubjectService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudySessionServiceImpl implements StudySessionService {

    private final StudySessionRepository studySessionRepository;
    private final StudentService studentService;
    private final SubjectService subjectService;

    public StudySessionServiceImpl(
        StudySessionRepository studySessionRepository,
        StudentService studentService,
        SubjectService subjectService
    ) {
        this.studySessionRepository = studySessionRepository;
        this.studentService = studentService;
        this.subjectService = subjectService;
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudySessionResponse> getAllStudySessions() {
        Long studentId = SecurityUtils.getCurrentStudentId();
        return studySessionRepository.findByStudentIdOrderBySessionDateDesc(studentId)
            .stream().map(StudySessionResponse::new).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public StudySessionResponse recordSession(StudySessionRequest request) {
        Student student = studentService.getAuthenticatedStudentEntity();
        Subject subject = subjectService.getStudentSubjectEntity(request.getSubjectId());

        StudySession session = new StudySession();
        session.setStudent(student);
        session.setSubject(subject);
        session.setTopic(request.getTopic());
        session.setSessionDate(request.getSessionDate() != null ? request.getSessionDate() : LocalDate.now());
        session.setDurationMinutes(request.getDurationMinutes());
        session.setNotes(request.getNotes());

        StudySession saved = studySessionRepository.save(session);
        return new StudySessionResponse(saved);
    }

    @Override
    @Transactional
    public void deleteSession(Long id) {
        Long studentId = SecurityUtils.getCurrentStudentId();
        StudySession session = studySessionRepository.findById(id)
            .filter(s -> s.getStudent().getId().equals(studentId))
            .orElseThrow(() -> new ResourceNotFoundException("Study session not found with ID: " + id));

        studySessionRepository.delete(session);
    }
}
