package com.careerguidance.repository;

import com.careerguidance.entity.ResumeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ResumeEntityRepository extends JpaRepository<ResumeEntity, Long> {
    List<ResumeEntity> findByResumeId(Long resumeId);
    List<ResumeEntity> findByResumeIdAndEntityType(Long resumeId, String entityType);
    @Modifying @Query("DELETE FROM ResumeEntity e WHERE e.resume.id = :resumeId")
    void deleteByResumeId(Long resumeId);
}
