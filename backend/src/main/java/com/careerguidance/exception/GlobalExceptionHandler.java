package com.careerguidance.exception;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(StudentNotAssignedException.class)
    public ResponseEntity<?> handleStudentNotAssigned(StudentNotAssignedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", ex.getMessage()));
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<Map<String, String>> handleBadRequest(BadRequestException ex) {
        return error(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(ResourceNotFoundException ex) {
        return error(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(DuplicateAnswerException.class)
    public ResponseEntity<Map<String, String>> handleDuplicateAnswer(DuplicateAnswerException ex) {
        return error(HttpStatus.CONFLICT, ex.getMessage());
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<Map<String, String>> handleUnauthorized(UnauthorizedException ex) {
        return error(HttpStatus.FORBIDDEN, ex.getMessage());
    }

    @ExceptionHandler({InvalidFileFormatException.class, FileTooLargeException.class})
    public ResponseEntity<Map<String, String>> handleFileValidation(RuntimeException ex) {
        return error(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(DuplicateResumeException.class)
    public ResponseEntity<Map<String, String>> handleDuplicateResume(DuplicateResumeException ex) {
        return error(HttpStatus.CONFLICT, ex.getMessage());
    }

    @ExceptionHandler(ResumeNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleResumeNotFound(ResumeNotFoundException ex) {
        return error(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(ParsingFailedException.class)
    public ResponseEntity<Map<String, String>> handleParsingFailed(ParsingFailedException ex) {
        return error(HttpStatus.UNPROCESSABLE_ENTITY, ex.getMessage());
    }

    @ExceptionHandler(SkillMappingException.class)
    public ResponseEntity<Map<String, String>> handleSkillMapping(SkillMappingException ex) {
        return error(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage());
    }

    @ExceptionHandler(UnauthorizedAccessException.class)
    public ResponseEntity<Map<String, String>> handleUnauthorizedAccess(UnauthorizedAccessException ex) {
        return error(HttpStatus.FORBIDDEN, ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(e -> {
            String fieldName = ((FieldError) e).getField();
            errors.put(fieldName, e.getDefaultMessage());
        });
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }

    @ExceptionHandler(AIServiceException.class)
    public ResponseEntity<Map<String, Object>> handleAIServiceException(AIServiceException ex) {
        HttpStatus status = ex.getHttpStatus() != null ? ex.getHttpStatus() : HttpStatus.BAD_REQUEST;

        Map<String, Object> body = new HashMap<>();
        body.put("success", false);
        body.put("status", "FAILED");
        body.put("message", ex.getMessage());
        body.put("errorCode", ex.getErrorCode());
        body.put("timestamp", LocalDateTime.now().toString());

        // Add retryAfter for quota exceeded errors
        if ("AI_QUOTA_EXCEEDED".equals(ex.getErrorCode()) || "PROVIDER_QUOTA_EXCEEDED".equals(ex.getErrorCode())
                || "PROVIDER_RATE_LIMITED".equals(ex.getErrorCode())) {
            String retryAfter = extractRetryAfter(ex.getMessage());
            if (retryAfter != null) {
                body.put("retryAfter", retryAfter);
            }
        }

        return ResponseEntity.status(status).body(body);
    }

    private String extractRetryAfter(String message) {
        if (message == null) return null;
        // Try to extract retry time from messages like "Try again in 4:35:33" or "try again in 5 minutes"
        java.util.regex.Matcher matcher = java.util.regex.Pattern.compile("(?i)try again in\\s+(\\d+[:\\d]*)").matcher(message);
        if (matcher.find()) {
            return matcher.group(1);
        }
        matcher = java.util.regex.Pattern.compile("(?i)retry after\\s+(\\d+[:\\d]*)").matcher(message);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return null;
    }

    private ResponseEntity<Map<String, String>> error(HttpStatus status, String message) {
        Map<String, String> body = new HashMap<>();
        body.put("message", message);
        return ResponseEntity.status(status).body(body);
    }
}
