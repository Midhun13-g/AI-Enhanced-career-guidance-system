package com.careerguidance.dto.response;

public record AssignedStudentResponse(Long id, String firstName, String lastName, String email, String collegeName,
        Double cgpa, Integer profileCompletion, String careerGoal) {
}
