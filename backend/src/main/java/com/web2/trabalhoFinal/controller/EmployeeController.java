package com.web2.trabalhoFinal.controller;

import com.web2.trabalhoFinal.dto.EmployeeRequest;
import com.web2.trabalhoFinal.dto.EmployeeResponse;
import com.web2.trabalhoFinal.entities.Employee;
import com.web2.trabalhoFinal.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingRequestHeaderException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "http://localhost:4200")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping
    public List<EmployeeResponse> list() {
        return employeeService.listActive().stream()
                .map(EmployeeResponse::from)
                .toList();
    }

    @GetMapping("/{id}")
    public EmployeeResponse findById(@PathVariable Long id) {
        return EmployeeResponse.from(employeeService.findById(id));
    }

    @PostMapping
    public ResponseEntity<EmployeeResponse> create(@Valid @RequestBody EmployeeRequest request) {
        Employee created = employeeService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(EmployeeResponse.from(created));
    }

    @PutMapping("/{id}")
    public EmployeeResponse update(@PathVariable Long id, @Valid @RequestBody EmployeeRequest request) {
        return EmployeeResponse.from(employeeService.update(id, request));
    }

    // Enquanto o login (RF002) não existe, o id de quem está logado vem no header X-Employee-Id.
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivate(@PathVariable Long id,
                                           @RequestHeader("X-Employee-Id") Long loggedEmployeeId) {
        employeeService.deactivate(id, loggedEmployeeId);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(EmployeeService.EmployeeNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(EmployeeService.EmployeeNotFoundException ex) {
        return error(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleInvalidRequest(IllegalArgumentException ex) {
        return error(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(e -> e.getDefaultMessage())
                .orElse("Dados inválidos.");
        return error(HttpStatus.BAD_REQUEST, message);
    }

    @ExceptionHandler(MissingRequestHeaderException.class)
    public ResponseEntity<Map<String, String>> handleMissingHeader(MissingRequestHeaderException ex) {
        return error(HttpStatus.BAD_REQUEST, "Funcionário logado não identificado (header X-Employee-Id).");
    }

    private ResponseEntity<Map<String, String>> error(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(Map.of("message", message));
    }
}