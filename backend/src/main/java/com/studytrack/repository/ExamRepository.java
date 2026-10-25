package com.studytrack.repository;

import com.studytrack.entity.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Long> {
    List<Exam> findByStudentIdOrderByExamDateAsc(Long studentId);
    Optional<Exam> findByIdAndStudentId(Long id, Long studentId);
    List<Exam> findByStudentIdAndSubjectId(Long studentId, Long subjectId);

    @Query("SELECT e FROM Exam e WHERE e.student.id = :studentId " +
           "AND e.examDate >= :afterDate " +
           "ORDER BY e.examDate ASC")
    List<Exam> findUpcomingExams(@Param("studentId") Long studentId, @Param("afterDate") LocalDateTime afterDate);

    @Query("SELECT COUNT(e) FROM Exam e WHERE e.student.id = :studentId AND e.examDate >= :afterDate")
    long countUpcomingExams(@Param("studentId") Long studentId, @Param("afterDate") LocalDateTime afterDate);
}
