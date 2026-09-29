package com.research.paper.handler;


import com.research.paper.exception.BusinessException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.ArrayList;
import java.util.List;

import static com.research.paper.enumeration.ErrorCode.*;
import static org.springframework.http.HttpStatus.BAD_REQUEST;

@RestControllerAdvice
@RequiredArgsConstructor
@Slf4j
public class ApplicationExceptionHandler {
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleException (final BusinessException ex){
        final ErrorResponse body = ErrorResponse.builder()
                .message(ex.getMessage())
                .code(ex.getErrorCode().getCode())
                .build();
        log.info("Business exception: {}",ex.getMessage());
        log.debug(ex.getMessage(),ex);
        return ResponseEntity.status(ex.getErrorCode()
                                        .getStatus()!=null ? ex.getErrorCode()
                                                                .getStatus(): BAD_REQUEST).body(body);
    }
    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<ErrorResponse>handleException(final DisabledException ex){
        final ErrorResponse body = ErrorResponse.builder()
                .code(ERROR_USER_DISABLED.getCode())
                .message(ERROR_USER_DISABLED.getDefaultMessage())
                .build();
        return ResponseEntity.status(ERROR_USER_DISABLED.getStatus()).body(body);
    }
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse>handleException(final BadCredentialsException ex){
        log.debug(ex.getMessage(),ex);
        final ErrorResponse body = ErrorResponse.builder()
                .code(ERROR_BAD_CREDENTIALS.getCode())
                .message(ERROR_BAD_CREDENTIALS.getDefaultMessage())
                .build();
        return ResponseEntity.status(ERROR_BAD_CREDENTIALS.getStatus()).body(body);
    }
    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ErrorResponse>handleException(final UsernameNotFoundException ex){
        log.debug(ex.getMessage(),ex);
        final ErrorResponse response = ErrorResponse.builder()
                .code(USERNAME_NOT_FOUND.getCode())
                .message(USERNAME_NOT_FOUND.getDefaultMessage())
                .build();
        return new ResponseEntity<>(response, USERNAME_NOT_FOUND.getStatus());
    }
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponse>handleException(final EntityNotFoundException ex) {
        log.debug(ex.getMessage(), ex);
        final ErrorResponse response = ErrorResponse.builder()
                .code("TBD")
                .message(ex.getMessage())
                .build();
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse>handleException(final MethodArgumentNotValidException ex) {
        final List<ErrorResponse.ValidationError> errors = new ArrayList<>();
        ex.getBindingResult().getAllErrors().forEach(error ->{
            final String fieldName = ((FieldError)error).getField();
            final String errorCode = error.getDefaultMessage();
            errors.add(ErrorResponse.ValidationError.builder()
                                                    .field(fieldName)
                                                    .code(errorCode)
                                                    .message(errorCode)
                                                    .build());
        });
        final ErrorResponse errorResponse = ErrorResponse.builder()
                                                         .validationErrors(errors)
                                                         .build();
        return ResponseEntity.status(BAD_REQUEST)
                             .body(errorResponse);
    }
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse>handleException(final Exception ex){
        log.error(ex.getMessage(),ex);
        final ErrorResponse response = ErrorResponse.builder()
                .code(INTERNAL_EXCEPTION.getCode())
                .message(INTERNAL_EXCEPTION.getDefaultMessage())
                .build();
        return new ResponseEntity<>(response, INTERNAL_EXCEPTION.getStatus());
    }
}
