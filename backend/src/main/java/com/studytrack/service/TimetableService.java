package com.studytrack.service;

import com.studytrack.dto.TimetableSessionRequest;
import com.studytrack.dto.TimetableSessionResponse;

import java.time.LocalDate;
import java.util.List;

public interface TimetableService {
    List<TimetableSessionResponse> getAllSessions();
    List<TimetableSessionResponse> getSessionsByDate(LocalDate date);
    List<TimetableSessionResponse> getSessionsForWeek(LocalDate anyDateInWeek);
    List<TimetableSessionResponse> getUpcomingSessions();
    TimetableSessionResponse getSessionById(Long id);
    TimetableSessionResponse createSession(TimetableSessionRequest request);
    TimetableSessionResponse updateSession(Long id, TimetableSessionRequest request);
    TimetableSessionResponse toggleComplete(Long id);
    void deleteSession(Long id);
}
