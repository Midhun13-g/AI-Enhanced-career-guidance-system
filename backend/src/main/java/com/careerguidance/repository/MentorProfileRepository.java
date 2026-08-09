package com.careerguidance.repository;
import com.careerguidance.entity.*; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface MentorProfileRepository extends JpaRepository<MentorProfile,Long>{ Optional<MentorProfile> findByUserId(Long userId); List<MentorProfile> findByVerificationStatus(AccountStatus status); long countByVerificationStatus(AccountStatus status); }
