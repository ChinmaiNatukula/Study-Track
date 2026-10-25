package com.studytrack.service;

import com.studytrack.dto.SubjectRequest;
import com.studytrack.dto.SubjectResponse;
import com.studytrack.entity.Subject;

import java.util.List;

public interface SubjectService {
    List<SubjectResponse> getAllSubjects();
    SubjectResponse getSubjectById(Long id);
    SubjectResponse createSubject(SubjectRequest request);
    SubjectResponse updateSubject(Long id, SubjectRequest request);
    void deleteSubject(Long id);
    Subject getStudentSubjectEntity(Long subjectId);
}
