package com.web2.trabalhoFinal.dto;

import com.web2.trabalhoFinal.entities.enums.RequestStatus;

import java.time.Instant;

public record EmployeeRequestSummaryDTO(
    Long maintenanceRequestId,
    RequestStatus status,
    Instant requestDateTime,
    String clientName,
    String equipmentDescription
) { }
