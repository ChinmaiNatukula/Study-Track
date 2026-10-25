package com.studytrack.repository;

import com.studytrack.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    List<Subject> findByStudentIdOrderByNameAsc(Long studentId);
    Optional<Subject> findByIdAndStudentId(Long id, Long studentId);
    boolean existsByNameIgnoreCaseAndStudentId(String name, Long studentId);
    boolean existsByCodeIgnoreCaseAndStudentId(String code, Long studentId);
}
