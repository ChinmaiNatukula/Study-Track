package com.studytrack.service.impl;

import com.studytrack.dto.TimetableSessionRequest;
import com.studytrack.dto.TimetableSessionResponse;
import com.studytrack.entity.Student;
import com.studytrack.entity.Subject;
import com.studytrack.entity.TimetableSession;
import com.studytrack.exception.BadRequestException;
import com.studytrack.exception.ResourceNotFoundException;
import com.studytrack.repository.TimetableSessionRepository;
import com.studytrack.security.SecurityUtils;
import com.studytrack.service.StudentService;
import com.studytrack.service.SubjectService;
import com.studytrack.service.TimetableService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TimetableServiceImpl implements TimetableService {

    private final TimetableSessionRepository timetableSessionRepository;
    private final StudentService studentService;
    private final SubjectService subjectService;

    public TimetableServiceImpl(
        TimetableSessionRepository timetableSessionRepository,
        StudentService studentService,
        SubjectService subjectService
    ) {
        this.timetableSessionRepository = timetableSessionRepository;
        this.studentService = studentService;
        this.subjectService = subjectService;
    }

    @Override
    @Transactional(readOnly = true)
    public List<TimetableSessionResponse> getAllSessions() {
        Long studentId = SecurityUtils.getCurrentStudentId();
        return timetableSessionRepository.findByStudentIdOrderBySessionDateAscStartTimeAsc(studentId)
            .stream().map(TimetableSessionResponse::new).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TimetableSessionResponse> getSessionsByDate(LocalDate date) {
        Long studentId = SecurityUtils.getCurrentStudentId();
        return timetableSessionRepository.findByStudentIdAndSessionDateOrderByStartTimeAsc(studentId, date)
            .stream().map(TimetableSessionResponse::new).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TimetableSessionResponse> getSessionsForWeek(LocalDate anyDateInWeek) {
        Long studentId = SecurityUtils.getCurrentStudentId();
        LocalDate monday = anyDateInWeek.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate sunday = anyDateInWeek.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));

        return timetableSessionRepository.findByStudentIdAndSessionDateBetweenOrderBySessionDateAscStartTimeAsc(studentId, monday, sunday)
            .stream().map(TimetableSessionResponse::new).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TimetableSessionResponse> getUpcomingSessions() {
        Long studentId = SecurityUtils.getCurrentStudentId();
        return timetableSessionRepository.findUpcomingSessions(studentId, LocalDate.now())
            .stream().map(TimetableSessionResponse::new).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TimetableSessionResponse getSessionById(Long id) {
        TimetableSession session = getStudentSessionEntity(id);
        return new TimetableSessionResponse(session);
    }

    @Override
    @Transactional
    public TimetableSessionResponse createSession(TimetableSessionRequest request) {
        validateTimeRange(request);
        Student student = studentService.getAuthenticatedStudentEntity();
        Subject subject = subjectService.getStudentSubjectEntity(request.getSubjectId());

        TimetableSession session = new TimetableSession();
        session.setStudent(student);
        session.setSubject(subject);
        session.setSessionDate(request.getSessionDate());
        session.setStartTime(request.getStartTime());
        session.setEndTime(request.getEndTime());
        session.setTopic(request.getTopic().trim());
        session.setRoomOrLink(request.getRoomOrLink());
        session.setIsCompleted(request.getIsCompleted() != null ? request.getIsCompleted() : false);

        TimetableSession saved = timetableSessionRepository.save(session);
        return new TimetableSessionResponse(saved);
    }

    @Override
    @Transactional
    public TimetableSessionResponse updateSession(Long id, TimetableSessionRequest request) {
        validateTimeRange(request);
        TimetableSession session = getStudentSessionEntity(id);
        Subject subject = subjectService.getStudentSubjectEntity(request.getSubjectId());

        session.setSubject(subject);
        session.setSessionDate(request.getSessionDate());
        session.setStartTime(request.getStartTime());
        session.setEndTime(request.getEndTime());
        session.setTopic(request.getTopic().trim());
        session.setRoomOrLink(request.getRoomOrLink());
        if (request.getIsCompleted() != null) {
            session.setIsCompleted(request.getIsCompleted());
        }

        TimetableSession updated = timetableSessionRepository.save(session);
        return new TimetableSessionResponse(updated);
    }

    @Override
    @Transactional
    public TimetableSessionResponse toggleComplete(Long id) {
        TimetableSession session = getStudentSessionEntity(id);
        session.setIsCompleted(!Boolean.TRUE.equals(session.getIsCompleted()));
        TimetableSession updated = timetableSessionRepository.save(session);
        return new TimetableSessionResponse(updated);
    }

    @Override
    @Transactional
    public void deleteSession(Long id) {
        TimetableSession session = getStudentSessionEntity(id);
        timetableSessionRepository.delete(session);
    }

    private void validateTimeRange(TimetableSessionRequest request) {
        if (request.getStartTime() == null || request.getEndTime() == null) {
            throw new BadRequestException("Start time and end time must both be specified");
        }
        if (!request.getStartTime().isBefore(request.getEndTime())) {
            throw new BadRequestException("Start time (" + request.getStartTime() + ") must be earlier than end time (" + request.getEndTime() + ")");
        }
    }

    private TimetableSession getStudentSessionEntity(Long id) {
        Long studentId = SecurityUtils.getCurrentStudentId();
        return timetableSessionRepository.findByIdAndStudentId(id, studentId)
            .orElseThrow(() -> new ResourceNotFoundException("Timetable session not found with ID: " + id));
    }
}
