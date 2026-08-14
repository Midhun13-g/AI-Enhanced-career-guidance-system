package com.careerguidance.repository;
import com.careerguidance.entity.ResumeSkill;
import org.springframework.data.jpa.repository.*;
import java.util.*;
public interface ResumeSkillRepository extends JpaRepository<ResumeSkill,Long> {
    List<ResumeSkill> findByResumeId(Long resumeId);
    void deleteByResumeId(Long resumeId);
}
