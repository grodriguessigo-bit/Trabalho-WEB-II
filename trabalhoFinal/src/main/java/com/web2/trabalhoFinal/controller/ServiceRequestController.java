package com.web2.trabalhoFinal.controller;

import com.web2.trabalhoFinal.model.ServiceRequest;
import com.web2.trabalhoFinal.service.ServiceRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
public class ServiceRequestController {

    @Autowired
    private ServiceRequestService serviceRequestService;
    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<ServiceRequest>> getRequestsByClient(@PathVariable Long clientId) {
        List<ServiceRequest> requests = serviceRequestService.getClientRequests(clientId);
        return ResponseEntity.ok(requests);
    }
}