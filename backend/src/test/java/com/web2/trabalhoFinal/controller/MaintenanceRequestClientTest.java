package com.web2.trabalhoFinal.controller;

import com.web2.trabalhoFinal.entities.Client;
import com.web2.trabalhoFinal.entities.MaintenanceRequest;
import com.web2.trabalhoFinal.entities.enums.RequestStatus;
import com.web2.trabalhoFinal.repository.MaintenanceRequestRepository;
import com.web2.trabalhoFinal.service.MaintenanceRequestService;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.lang.reflect.Proxy;
import java.time.Instant;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class MaintenanceRequestClientTest {

    private List<MaintenanceRequest> results = List.of();
    private Long queriedClientId;
    private boolean queriedAll;
    private final MaintenanceRequestService service = new MaintenanceRequestService(repository(), null, null);
    private final MockMvc mvc = MockMvcBuilders
            .standaloneSetup(new MaintenanceRequestController(service)).build();

    @Test
    void returnsClientRequestsInRepositoryOrder() throws Exception {
        results = List.of(request(2L), request(3L));

        mvc.perform(get("/api/maintenance-requests/client/7"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value(2))
                .andExpect(jsonPath("$[1].id").value(3))
                .andExpect(jsonPath("$[0].clientId").value(7))
                .andExpect(jsonPath("$[0].equipmentDescription").value("Notebook"))
                .andExpect(jsonPath("$[0].status").value("OPEN"));

        assertEquals(7L, queriedClientId);
        assertFalse(queriedAll);
    }

    @Test
    void returnsEmptyArrayWhenClientHasNoRequests() throws Exception {
        mvc.perform(get("/api/maintenance-requests/client/99"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));

        assertEquals(99L, queriedClientId);
    }

    @Test
    void rejectsNonPositiveClientIdsBeforeQuerying() throws Exception {
        for (long clientId : new long[]{0, -1}) {
            mvc.perform(get("/api/maintenance-requests/client/{clientId}", clientId))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message")
                            .value("O identificador do cliente deve ser positivo."));
        }
        assertNull(queriedClientId);
        assertFalse(queriedAll);
    }

    @Test
    void rejectsMalformedClientId() throws Exception {
        mvc.perform(get("/api/maintenance-requests/client/invalid"))
                .andExpect(status().isBadRequest());

        assertNull(queriedClientId);
        assertFalse(queriedAll);
    }

    @Test
    void rejectsMissingClientIdInService() {
        assertThrows(IllegalArgumentException.class, () -> service.findByClientId(null));

        assertNull(queriedClientId);
        assertFalse(queriedAll);
    }

    @Test
    void keepsUnfilteredListAvailable() throws Exception {
        results = List.of(request(1L));

        mvc.perform(get("/api/maintenance-requests"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1));

        assertTrue(queriedAll);
        assertNull(queriedClientId);
    }

    private MaintenanceRequestRepository repository() {
        return (MaintenanceRequestRepository) Proxy.newProxyInstance(
                MaintenanceRequestRepository.class.getClassLoader(),
                new Class<?>[]{MaintenanceRequestRepository.class},
                (proxy, method, args) -> switch (method.getName()) {
                    case "findAllByClientId" -> {
                        queriedClientId = (Long) args[0];
                        yield results;
                    }
                    case "findAllByOrderByRequestDateTimeAscIdAsc" -> {
                        queriedAll = true;
                        yield results;
                    }
                    default -> throw new UnsupportedOperationException(method.getName());
                });
    }

    private MaintenanceRequest request(Long id) {
        Client client = new Client();
        client.setId_person(7L);
        return new MaintenanceRequest(id, "Notebook", "Não liga", Instant.parse("2026-10-01T10:00:00Z"),
                RequestStatus.OPEN, client, null, null, null, List.of());
    }
}
