package com.careerguidance.exception;

import org.springframework.http.HttpStatus;

public class AIServiceException extends RuntimeException {

    private final String errorCode;
    private final HttpStatus httpStatus;

    public AIServiceException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
        this.httpStatus = determineStatus(errorCode);
    }

    public AIServiceException(String errorCode, String message, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
        this.httpStatus = determineStatus(errorCode);
    }

    public AIServiceException(String errorCode, String message, HttpStatus httpStatus) {
        super(message);
        this.errorCode = errorCode;
        this.httpStatus = httpStatus != null ? httpStatus : determineStatus(errorCode);
    }

    public AIServiceException(String errorCode, String message, HttpStatus httpStatus, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
        this.httpStatus = httpStatus != null ? httpStatus : determineStatus(errorCode);
    }

    public String getErrorCode() {
        return errorCode;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }

    private static HttpStatus determineStatus(String errorCode) {
        if (errorCode == null) return HttpStatus.INTERNAL_SERVER_ERROR;
        return switch (errorCode) {
            case "INVALID_FILE", "INVALID_FILE_NAME", "UNSUPPORTED_FORMAT", "BAD_REQUEST" -> HttpStatus.BAD_REQUEST;
            case "UNAUTHENTICATED", "UNAUTHORIZED" -> HttpStatus.UNAUTHORIZED;
            case "UNAUTHORIZED_ACCESS", "FORBIDDEN" -> HttpStatus.FORBIDDEN;
            case "ANALYSIS_NOT_FOUND", "NOT_FOUND" -> HttpStatus.NOT_FOUND;
            case "AI_TIMEOUT", "REQUEST_TIMEOUT" -> HttpStatus.REQUEST_TIMEOUT;
            case "FILE_TOO_LARGE" -> HttpStatus.PAYLOAD_TOO_LARGE;
            case "UNPROCESSABLE_ENTITY", "EXTRACTION_FAILED" -> HttpStatus.UNPROCESSABLE_ENTITY;
            case "RATE_LIMITED", "TOO_MANY_REQUESTS" -> HttpStatus.TOO_MANY_REQUESTS;
            case "HF_BAD_GATEWAY" -> HttpStatus.BAD_GATEWAY;
            case "AI_SERVICE_UNAVAILABLE" -> HttpStatus.SERVICE_UNAVAILABLE;
            case "AI_GATEWAY_TIMEOUT" -> HttpStatus.GATEWAY_TIMEOUT;
            default -> HttpStatus.INTERNAL_SERVER_ERROR;
        };
    }
}
