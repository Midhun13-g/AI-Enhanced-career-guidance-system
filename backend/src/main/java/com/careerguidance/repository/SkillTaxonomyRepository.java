package com.careerguidance.repository;

import com.careerguidance.entity.SkillTaxonomy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface SkillTaxonomyRepository extends JpaRepository<SkillTaxonomy, Long> {
    Optional<SkillTaxonomy> findBySkillNameIgnoreCase(String skillName);
    List<SkillTaxonomy> findByCategory(String category);
    @Query("SELECT s FROM SkillTaxonomy s WHERE LOWER(s.skillName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(s.normalizedName) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<SkillTaxonomy> searchByKeyword(String keyword);
}
