package com.studytrack.repository;

import com.studytrack.entity.StudySession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface StudySessionRepository extends JpaRepository<StudySession, Long> {
    List<StudySession> findByStudentIdOrderBySessionDateDesc(Long studentId);
    List<StudySession> findByStudentIdAndSessionDate(Long studentId, LocalDate sessionDate);
    List<StudySession> findByStudentIdAndSessionDateBetweenOrderBySessionDateAsc(Long studentId, LocalDate startDate, LocalDate endDate);
    List<StudySession> findByStudentIdAndSubjectId(Long studentId, Long subjectId);

    @Query("SELECT COALESCE(SUM(s.durationMinutes), 0) FROM StudySession s " +
           "WHERE s.student.id = :studentId AND s.sessionDate = :date")
    Integer getTotalMinutesForDate(@Param("studentId") Long studentId, @Param("date") LocalDate date);

    @Query("SELECT COALESCE(SUM(s.durationMinutes), 0) FROM StudySession s " +
           "WHERE s.student.id = :studentId AND s.sessionDate BETWEEN :startDate AND :endDate")
    Integer getTotalMinutesBetween(@Param("studentId") Long studentId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT COALESCE(SUM(s.durationMinutes), 0) FROM StudySession s " +
           "WHERE s.student.id = :studentId AND s.subject.id = :subjectId")
    Integer getTotalMinutesForSubject(@Param("studentId") Long studentId, @Param("subjectId") Long subjectId);

    @Query("SELECT COALESCE(SUM(s.durationMinutes), 0) FROM StudySession s " +
           "WHERE s.student.id = :studentId")
    Integer getTotalMinutesAllTime(@Param("studentId") Long studentId);
}
