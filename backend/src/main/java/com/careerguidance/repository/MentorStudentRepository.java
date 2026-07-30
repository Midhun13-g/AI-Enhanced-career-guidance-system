package com.careerguidance.repository;
import com.careerguidance.entity.MentorStudent; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface MentorStudentRepository extends JpaRepository<MentorStudent,Long>{ boolean existsByMentorIdAndStudentId(Long mentorId,Long studentId); List<MentorStudent> findByMentorId(Long mentorId); }
