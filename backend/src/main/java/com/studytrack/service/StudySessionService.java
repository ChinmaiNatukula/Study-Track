package com.studytrack.service;

import com.studytrack.dto.StudySessionRequest;
import com.studytrack.dto.StudySessionResponse;

import java.util.List;

public interface StudySessionService {
    List<StudySessionResponse> getAllStudySessions();
    StudySessionResponse recordSession(StudySessionRequest request);
    void deleteSession(Long id);
}
