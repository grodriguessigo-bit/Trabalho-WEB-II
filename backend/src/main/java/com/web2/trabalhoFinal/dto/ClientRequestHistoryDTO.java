package com.web2.trabalhoFinal.dto;

import com.web2.trabalhoFinal.entities.enums.HistoryActions;
import com.web2.trabalhoFinal.entities.enums.RequestStatus;

import java.time.Instant;

public record ClientRequestHistoryDTO(
        Long requestHistoryId,
        HistoryActions action,
        RequestStatus previousStatus,
        RequestStatus newStatus,
        Instant changeDateTime,
        String performedByName,
        String description
) {}