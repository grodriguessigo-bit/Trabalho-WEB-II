package com.web2.trabalhoFinal.controller;

import com.web2.trabalhoFinal.dto.MaintenanceRequestRequest;
import com.web2.trabalhoFinal.dto.MaintenanceRequestResponse;
import com.web2.trabalhoFinal.service.MaintenanceRequestService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/maintenance-requests")
@CrossOrigin(origins = "http://localhost:4200")
public class MaintenanceRequestController {

    private final MaintenanceRequestService requestService;

    public MaintenanceRequestController(MaintenanceRequestService requestService) {
        this.requestService = requestService;
    }

    @GetMapping
    public List<MaintenanceRequestResponse> list() {
        return requestService.list().stream()
                .map(MaintenanceRequestResponse::from)
                .toList();
    }

    @GetMapping("/{id}")
    public MaintenanceRequestResponse findById(@PathVariable Long id) {
        return MaintenanceRequestResponse.from(requestService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody MaintenanceRequestRequest request) {
        var created = requestService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("id", created.getId(), "message", "Solicitação registrada com sucesso."));
    }

    @ExceptionHandler(MaintenanceRequestService.MaintenanceRequestNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(
            MaintenanceRequestService.MaintenanceRequestNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", exception.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleInvalidRequest(IllegalArgumentException exception) {
        return ResponseEntity.badRequest().body(Map.of("message", exception.getMessage()));
    }
}
