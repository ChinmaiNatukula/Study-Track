package com.studytrack.service.impl;

import com.studytrack.dto.SubjectRequest;
import com.studytrack.dto.SubjectResponse;
import com.studytrack.entity.Student;
import com.studytrack.entity.Subject;
import com.studytrack.entity.Task;
import com.studytrack.entity.TaskStatus;
import com.studytrack.exception.BadRequestException;
import com.studytrack.exception.ResourceNotFoundException;
import com.studytrack.repository.StudySessionRepository;
import com.studytrack.repository.SubjectRepository;
import com.studytrack.repository.TaskRepository;
import com.studytrack.security.SecurityUtils;
import com.studytrack.service.StudentService;
import com.studytrack.service.SubjectService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SubjectServiceImpl implements SubjectService {

    private final SubjectRepository subjectRepository;
    private final StudentService studentService;
    private final StudySessionRepository studySessionRepository;
    private final TaskRepository taskRepository;

    public SubjectServiceImpl(
        SubjectRepository subjectRepository,
        StudentService studentService,
        StudySessionRepository studySessionRepository,
        TaskRepository taskRepository
    ) {
        this.subjectRepository = subjectRepository;
        this.studentService = studentService;
        this.studySessionRepository = studySessionRepository;
        this.taskRepository = taskRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubjectResponse> getAllSubjects() {
        Long studentId = SecurityUtils.getCurrentStudentId();
        List<Subject> subjects = subjectRepository.findByStudentIdOrderByNameAsc(studentId);
        return subjects.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public SubjectResponse getSubjectById(Long id) {
        Subject subject = getStudentSubjectEntity(id);
        return mapToResponse(subject);
    }

    @Override
    @Transactional
    public SubjectResponse createSubject(SubjectRequest request) {
        Student student = studentService.getAuthenticatedStudentEntity();

        if (subjectRepository.existsByNameIgnoreCaseAndStudentId(request.getName().trim(), student.getId())) {
            throw new BadRequestException("A subject with name '" + request.getName() + "' already exists");
        }

        Subject subject = new Subject();
        subject.setStudent(student);
        subject.setName(request.getName().trim());
        subject.setCode(request.getCode().trim().toUpperCase());
        subject.setDescription(request.getDescription());
        subject.setTargetStudyHours(request.getTargetStudyHours() != null ? request.getTargetStudyHours() : 30.0);
        subject.setColor(request.getColor() != null && !request.getColor().isBlank() ? request.getColor() : "#3B82F6");

        Subject saved = subjectRepository.save(subject);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public SubjectResponse updateSubject(Long id, SubjectRequest request) {
        Subject subject = getStudentSubjectEntity(id);

        subject.setName(request.getName().trim());
        subject.setCode(request.getCode().trim().toUpperCase());
        subject.setDescription(request.getDescription());
        if (request.getTargetStudyHours() != null) {
            subject.setTargetStudyHours(request.getTargetStudyHours());
        }
        if (request.getColor() != null && !request.getColor().isBlank()) {
            subject.setColor(request.getColor());
        }

        Subject updated = subjectRepository.save(subject);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteSubject(Long id) {
        Subject subject = getStudentSubjectEntity(id);
        subjectRepository.delete(subject);
    }

    @Override
    @Transactional(readOnly = true)
    public Subject getStudentSubjectEntity(Long subjectId) {
        Long studentId = SecurityUtils.getCurrentStudentId();
        return subjectRepository.findByIdAndStudentId(subjectId, studentId)
            .orElseThrow(() -> new ResourceNotFoundException("Subject not found with ID: " + subjectId));
    }

    private SubjectResponse mapToResponse(Subject subject) {
        SubjectResponse response = new SubjectResponse(subject);
        Long studentId = subject.getStudent().getId();

        Integer loggedMinutes = studySessionRepository.getTotalMinutesForSubject(studentId, subject.getId());
        double loggedHours = loggedMinutes != null ? Math.round((loggedMinutes / 60.0) * 10.0) / 10.0 : 0.0;
        response.setLoggedStudyHours(loggedHours);

        if (subject.getTargetStudyHours() != null && subject.getTargetStudyHours() > 0) {
            int pct = (int) Math.round((loggedHours / subject.getTargetStudyHours()) * 100);
            response.setCompletionPercentage(Math.min(100, Math.max(0, pct)));
        } else {
            response.setCompletionPercentage(0);
        }

        List<Task> tasks = taskRepository.findByStudentIdAndSubjectId(studentId, subject.getId());
        response.setTotalTasks((long) tasks.size());
        response.setCompletedTasks(tasks.stream().filter(t -> t.getStatus() == TaskStatus.COMPLETED).count());

        return response;
    }
}
