package com.studytrack.service.impl;

import com.studytrack.dto.ExamRequest;
import com.studytrack.dto.ExamResponse;
import com.studytrack.entity.Exam;
import com.studytrack.entity.PreparationStatus;
import com.studytrack.entity.Student;
import com.studytrack.entity.Subject;
import com.studytrack.exception.ResourceNotFoundException;
import com.studytrack.repository.ExamRepository;
import com.studytrack.security.SecurityUtils;
import com.studytrack.service.ExamService;
import com.studytrack.service.StudentService;
import com.studytrack.service.SubjectService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExamServiceImpl implements ExamService {

    private final ExamRepository examRepository;
    private final StudentService studentService;
    private final SubjectService subjectService;

    public ExamServiceImpl(ExamRepository examRepository, StudentService studentService, SubjectService subjectService) {
        this.examRepository = examRepository;
        this.studentService = studentService;
        this.subjectService = subjectService;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExamResponse> getAllExams() {
        Long studentId = SecurityUtils.getCurrentStudentId();
        return examRepository.findByStudentIdOrderByExamDateAsc(studentId)
            .stream().map(ExamResponse::new).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExamResponse> getUpcomingExams() {
        Long studentId = SecurityUtils.getCurrentStudentId();
        return examRepository.findUpcomingExams(studentId, LocalDateTime.now())
            .stream().map(ExamResponse::new).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ExamResponse getExamById(Long id) {
        Exam exam = getStudentExamEntity(id);
        return new ExamResponse(exam);
    }

    @Override
    @Transactional
    public ExamResponse createExam(ExamRequest request) {
        Student student = studentService.getAuthenticatedStudentEntity();
        Subject subject = subjectService.getStudentSubjectEntity(request.getSubjectId());

        Exam exam = new Exam();
        exam.setStudent(student);
        exam.setSubject(subject);
        exam.setExamName(request.getExamName().trim());
        exam.setExamDate(request.getExamDate());
        exam.setLocation(request.getLocation());
        exam.setSyllabus(request.getSyllabus());
        exam.setSyllabusCompletionPercentage(request.getSyllabusCompletionPercentage() != null ? request.getSyllabusCompletionPercentage() : 0);
        exam.setPreparationStatus(request.getPreparationStatus() != null ? request.getPreparationStatus() : PreparationStatus.NOT_STARTED);
        exam.setTargetScore(request.getTargetScore());

        Exam saved = examRepository.save(exam);
        return new ExamResponse(saved);
    }

    @Override
    @Transactional
    public ExamResponse updateExam(Long id, ExamRequest request) {
        Exam exam = getStudentExamEntity(id);
        Subject subject = subjectService.getStudentSubjectEntity(request.getSubjectId());

        exam.setSubject(subject);
        exam.setExamName(request.getExamName().trim());
        exam.setExamDate(request.getExamDate());
        exam.setLocation(request.getLocation());
        exam.setSyllabus(request.getSyllabus());
        if (request.getSyllabusCompletionPercentage() != null) {
            exam.setSyllabusCompletionPercentage(request.getSyllabusCompletionPercentage());
        }
        if (request.getPreparationStatus() != null) {
            exam.setPreparationStatus(request.getPreparationStatus());
        }
        exam.setTargetScore(request.getTargetScore());

        Exam updated = examRepository.save(exam);
        return new ExamResponse(updated);
    }

    @Override
    @Transactional
    public void deleteExam(Long id) {
        Exam exam = getStudentExamEntity(id);
        examRepository.delete(exam);
    }

    private Exam getStudentExamEntity(Long examId) {
        Long studentId = SecurityUtils.getCurrentStudentId();
        return examRepository.findByIdAndStudentId(examId, studentId)
            .orElseThrow(() -> new ResourceNotFoundException("Exam not found with ID: " + examId));
    }
}
