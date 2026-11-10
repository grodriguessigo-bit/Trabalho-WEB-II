package com.web2.trabalhoFinal.dto;

import com.web2.trabalhoFinal.entities.enums.RequestStatus;

import java.time.Instant;

public record ClientRequestSummaryDTO(
    Long maintenanceRequestId,
    Instant requestDateTime,
    String equipmentDescription,
    RequestStatus status
) { }
