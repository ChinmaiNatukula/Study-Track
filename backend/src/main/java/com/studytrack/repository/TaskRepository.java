package com.studytrack.repository;

import com.studytrack.entity.Priority;
import com.studytrack.entity.Task;
import com.studytrack.entity.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByStudentIdOrderByDeadlineAsc(Long studentId);
    Optional<Task> findByIdAndStudentId(Long id, Long studentId);
    List<Task> findByStudentIdAndStatus(Long studentId, TaskStatus status);
    List<Task> findByStudentIdAndSubjectId(Long studentId, Long subjectId);
    long countByStudentIdAndStatus(Long studentId, TaskStatus status);
    long countByStudentId(Long studentId);

    @Query("SELECT t FROM Task t WHERE t.student.id = :studentId " +
           "AND (:status IS NULL OR t.status = :status) " +
           "AND (:subjectId IS NULL OR (t.subject IS NOT NULL AND t.subject.id = :subjectId)) " +
           "AND (:priority IS NULL OR t.priority = :priority) " +
           "ORDER BY CASE WHEN t.deadline IS NULL THEN 1 ELSE 0 END, t.deadline ASC, t.createdAt DESC")
    List<Task> findFiltered(
        @Param("studentId") Long studentId,
        @Param("status") TaskStatus status,
        @Param("subjectId") Long subjectId,
        @Param("priority") Priority priority
    );

    @Query("SELECT t FROM Task t WHERE t.student.id = :studentId " +
           "AND t.status != 'COMPLETED' " +
           "AND t.deadline < :now " +
           "ORDER BY t.deadline ASC")
    List<Task> findOverdueTasks(@Param("studentId") Long studentId, @Param("now") LocalDateTime now);
}
