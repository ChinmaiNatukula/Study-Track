package com.studytrack.repository;

import com.studytrack.entity.TimetableSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TimetableSessionRepository extends JpaRepository<TimetableSession, Long> {
    List<TimetableSession> findByStudentIdOrderBySessionDateAscStartTimeAsc(Long studentId);
    Optional<TimetableSession> findByIdAndStudentId(Long id, Long studentId);
    List<TimetableSession> findByStudentIdAndSessionDateOrderByStartTimeAsc(Long studentId, LocalDate sessionDate);
    List<TimetableSession> findByStudentIdAndSessionDateBetweenOrderBySessionDateAscStartTimeAsc(Long studentId, LocalDate startDate, LocalDate endDate);

    @Query("SELECT s FROM TimetableSession s WHERE s.student.id = :studentId " +
           "AND s.sessionDate >= :today " +
           "ORDER BY s.sessionDate ASC, s.startTime ASC")
    List<TimetableSession> findUpcomingSessions(@Param("studentId") Long studentId, @Param("today") LocalDate today);
}
