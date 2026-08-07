package com.careerguidance.repository;

import com.careerguidance.entity.StudentProfileVector;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface StudentProfileVectorRepository extends JpaRepository<StudentProfileVector, Long> {
    Optional<StudentProfileVector> findByStudentId(Long studentId);
}
