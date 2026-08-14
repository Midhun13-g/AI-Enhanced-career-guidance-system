package com.careerguidance.repository;
import com.careerguidance.entity.Mentor; import org.springframework.data.jpa.repository.JpaRepository; import java.util.Optional;
public interface MentorRepository extends JpaRepository<Mentor,Long>{ Optional<Mentor> findByUserId(Long userId); }
