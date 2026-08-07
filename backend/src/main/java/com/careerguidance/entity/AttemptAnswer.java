package com.careerguidance.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "attempt_answers", uniqueConstraints = {
        @UniqueConstraint(name = "uk_attempt_item", columnNames = {"attempt_id", "item_id"})
})
public class AttemptAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "attempt_id", nullable = false)
    private AssessmentAttempt attempt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "item_id", nullable = false)
    private AssessmentItem item;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "selected_option")
    private AssessmentItemOption selectedOption;

    @Column(columnDefinition = "TEXT")
    private String selectedText;

    private Boolean isCorrect;

    @Column(nullable = false)
    private Double marksObtained = 0.0;

    @Column(nullable = false)
    private LocalDateTime answeredAt = LocalDateTime.now();

    public Long getId() { return id; }
    public AssessmentAttempt getAttempt() { return attempt; }
    public void setAttempt(AssessmentAttempt attempt) { this.attempt = attempt; }
    public AssessmentItem getItem() { return item; }
    public void setItem(AssessmentItem item) { this.item = item; }
    public AssessmentItemOption getSelectedOption() { return selectedOption; }
    public void setSelectedOption(AssessmentItemOption selectedOption) { this.selectedOption = selectedOption; }
    public String getSelectedText() { return selectedText; }
    public void setSelectedText(String selectedText) { this.selectedText = selectedText; }
    public Boolean getIsCorrect() { return isCorrect; }
    public void setIsCorrect(Boolean isCorrect) { this.isCorrect = isCorrect; }
    public Double getMarksObtained() { return marksObtained; }
    public void setMarksObtained(Double marksObtained) { this.marksObtained = marksObtained; }
    public LocalDateTime getAnsweredAt() { return answeredAt; }
    public void setAnsweredAt(LocalDateTime answeredAt) { this.answeredAt = answeredAt; }
}
