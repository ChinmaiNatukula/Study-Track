package com.studytrack.controller;

import com.studytrack.dto.ApiResponse;
import com.studytrack.dto.TimetableSessionRequest;
import com.studytrack.dto.TimetableSessionResponse;
import com.studytrack.service.TimetableService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/timetable")
public class TimetableController {

    private final TimetableService timetableService;

    public TimetableController(TimetableService timetableService) {
        this.timetableService = timetableService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TimetableSessionResponse>>> getSessions(
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate week
    ) {
        List<TimetableSessionResponse> sessions;
        if (date != null) {
            sessions = timetableService.getSessionsByDate(date);
        } else if (week != null) {
            sessions = timetableService.getSessionsForWeek(week);
        } else {
            sessions = timetableService.getAllSessions();
        }
        return ResponseEntity.ok(ApiResponse.ok("Timetable sessions retrieved", sessions));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<ApiResponse<List<TimetableSessionResponse>>> getUpcomingSessions() {
        List<TimetableSessionResponse> sessions = timetableService.getUpcomingSessions();
        return ResponseEntity.ok(ApiResponse.ok("Upcoming timetable sessions retrieved", sessions));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TimetableSessionResponse>> getSessionById(@PathVariable Long id) {
        TimetableSessionResponse session = timetableService.getSessionById(id);
        return ResponseEntity.ok(ApiResponse.ok("Session retrieved", session));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TimetableSessionResponse>> createSession(
        @Valid @RequestBody TimetableSessionRequest request
    ) {
        TimetableSessionResponse response = timetableService.createSession(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok("Timetable session added successfully", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TimetableSessionResponse>> updateSession(
        @PathVariable Long id,
        @Valid @RequestBody TimetableSessionRequest request
    ) {
        TimetableSessionResponse response = timetableService.updateSession(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Timetable session updated successfully", response));
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<TimetableSessionResponse>> toggleComplete(@PathVariable Long id) {
        TimetableSessionResponse response = timetableService.toggleComplete(id);
        return ResponseEntity.ok(ApiResponse.ok("Timetable session completion toggled", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSession(@PathVariable Long id) {
        timetableService.deleteSession(id);
        return ResponseEntity.ok(ApiResponse.ok("Timetable session deleted successfully", null));
    }
}
