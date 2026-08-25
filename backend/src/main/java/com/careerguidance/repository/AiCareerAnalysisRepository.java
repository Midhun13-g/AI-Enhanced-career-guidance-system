package com.careerguidance.repository;

import com.careerguidance.entity.AiCareerAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AiCareerAnalysisRepository extends JpaRepository<AiCareerAnalysis, Long> {

    List<AiCareerAnalysis> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<AiCareerAnalysis> findByIdAndUserId(Long id, Long userId);
}
