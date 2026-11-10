package com.web2.trabalhoFinal.exception;

import com.web2.trabalhoFinal.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(InvalidMaintenanceRequestException.class)
    public ResponseEntity<ApiResponse<Void>> handleInvalidMaintenanceRequest(
            InvalidMaintenanceRequestException exception
    ){
        return ResponseEntity.badRequest().body(new ApiResponse<>(exception.getMessage(), false));
    }



}
