package com.careerguidance.repository;
import com.careerguidance.entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface ResumeRepository extends JpaRepository<Resume,Long> {
    List<Resume> findByUserIdOrderByUploadTimeDesc(Long userId);
    boolean existsByUserIdAndOriginalFileNameAndFileSize(Long userId,String name,Long size);
}
