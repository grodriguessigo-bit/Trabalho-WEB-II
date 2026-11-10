package com.web2.trabalhoFinal.dto;

import com.web2.trabalhoFinal.entities.enums.RequestStatus;

import java.time.Instant;

public record MaintenanceRequestSummaryDTO(
    Long maintenanceRequestId,
    Instant requestDateTime,
    String equipmentDescription,
    RequestStatus status
) {

}
