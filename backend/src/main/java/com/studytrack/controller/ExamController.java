package com.studytrack.controller;

import com.studytrack.dto.ApiResponse;
import com.studytrack.dto.ExamRequest;
import com.studytrack.dto.ExamResponse;
import com.studytrack.service.ExamService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exams")
public class ExamController {

    private final ExamService examService;

    public ExamController(ExamService examService) {
        this.examService = examService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ExamResponse>>> getAllExams() {
        List<ExamResponse> exams = examService.getAllExams();
        return ResponseEntity.ok(ApiResponse.ok("Exams retrieved", exams));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<ApiResponse<List<ExamResponse>>> getUpcomingExams() {
        List<ExamResponse> exams = examService.getUpcomingExams();
        return ResponseEntity.ok(ApiResponse.ok("Upcoming exams retrieved", exams));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ExamResponse>> getExamById(@PathVariable Long id) {
        ExamResponse response = examService.getExamById(id);
        return ResponseEntity.ok(ApiResponse.ok("Exam details retrieved", response));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ExamResponse>> createExam(@Valid @RequestBody ExamRequest request) {
        ExamResponse response = examService.createExam(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok("Exam added successfully", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ExamResponse>> updateExam(
        @PathVariable Long id,
        @Valid @RequestBody ExamRequest request
    ) {
        ExamResponse response = examService.updateExam(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Exam updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteExam(@PathVariable Long id) {
        examService.deleteExam(id);
        return ResponseEntity.ok(ApiResponse.ok("Exam deleted successfully", null));
    }
}
