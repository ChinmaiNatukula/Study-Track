package com.studytrack.service;

import com.studytrack.dto.ExamRequest;
import com.studytrack.dto.ExamResponse;

import java.util.List;

public interface ExamService {
    List<ExamResponse> getAllExams();
    List<ExamResponse> getUpcomingExams();
    ExamResponse getExamById(Long id);
    ExamResponse createExam(ExamRequest request);
    ExamResponse updateExam(Long id, ExamRequest request);
    void deleteExam(Long id);
}
