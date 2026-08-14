package com.careerguidance.entity;

import com.careerguidance.constant.AssessmentCategoryName;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "assessment_categories")
public class AssessmentCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true, length = 50)
    private AssessmentCategoryName name;

    @Column(columnDefinition = "TEXT")
    private String description;

    public Long getId() {
        return id;
    }

    public AssessmentCategoryName getName() {
        return name;
    }

    public void setName(AssessmentCategoryName name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
