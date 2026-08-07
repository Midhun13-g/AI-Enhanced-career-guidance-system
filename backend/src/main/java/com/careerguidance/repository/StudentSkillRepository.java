package com.careerguidance.repository;

import com.careerguidance.entity.StudentSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface StudentSkillRepository extends JpaRepository<StudentSkill, Long> {
    List<StudentSkill> findByStudentId(Long studentId);
    List<StudentSkill> findByStudentIdAndSource(Long studentId, String source);
    boolean existsByStudentIdAndSkillIdAndSource(Long studentId, Long skillId, String source);
    @Modifying @Query("DELETE FROM StudentSkill ss WHERE ss.student.id = :studentId AND ss.source = :source")
    void deleteByStudentIdAndSource(Long studentId, String source);
}
