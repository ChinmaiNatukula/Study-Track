package com.studytrack.controller;

import com.studytrack.dto.ApiResponse;
import com.studytrack.dto.StudySessionRequest;
import com.studytrack.dto.StudySessionResponse;
import com.studytrack.service.StudySessionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/study-sessions")
public class StudySessionController {

    private final StudySessionService studySessionService;

    public StudySessionController(StudySessionService studySessionService) {
        this.studySessionService = studySessionService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<StudySessionResponse>>> getAllStudySessions() {
        List<StudySessionResponse> sessions = studySessionService.getAllStudySessions();
        return ResponseEntity.ok(ApiResponse.ok("Study sessions retrieved", sessions));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<StudySessionResponse>> recordSession(
        @Valid @RequestBody StudySessionRequest request
    ) {
        StudySessionResponse response = studySessionService.recordSession(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok("Study session recorded successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSession(@PathVariable Long id) {
        studySessionService.deleteSession(id);
        return ResponseEntity.ok(ApiResponse.ok("Study session deleted successfully", null));
    }
}
