package com.studytrack.repository;

import com.studytrack.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByStudentIdOrderByIsPinnedDescUpdatedAtDesc(Long studentId);
    Optional<Note> findByIdAndStudentId(Long id, Long studentId);
    List<Note> findByStudentIdAndSubjectId(Long studentId, Long subjectId);

    @Query("SELECT n FROM Note n WHERE n.student.id = :studentId " +
           "AND (:subjectId IS NULL OR n.subject.id = :subjectId) " +
           "AND (:topic IS NULL OR LOWER(n.topic) LIKE LOWER(CONCAT('%', :topic, '%'))) " +
           "AND (:search IS NULL OR (LOWER(n.title) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "     OR LOWER(n.content) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "     OR LOWER(n.tags) LIKE LOWER(CONCAT('%', :search, '%')))) " +
           "ORDER BY n.isPinned DESC, n.updatedAt DESC")
    List<Note> searchNotes(
        @Param("studentId") Long studentId,
        @Param("subjectId") Long subjectId,
        @Param("topic") String topic,
        @Param("search") String search
    );
}
