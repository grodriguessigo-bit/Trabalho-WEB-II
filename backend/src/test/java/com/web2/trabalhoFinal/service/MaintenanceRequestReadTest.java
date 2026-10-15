package com.web2.trabalhoFinal.service;

import com.web2.trabalhoFinal.controller.MaintenanceRequestController;
import com.web2.trabalhoFinal.dto.MaintenanceRequestResponse;
import com.web2.trabalhoFinal.entities.Category;
import com.web2.trabalhoFinal.entities.Client;
import com.web2.trabalhoFinal.entities.MaintenanceRequest;
import com.web2.trabalhoFinal.entities.enums.RequestStatus;
import com.web2.trabalhoFinal.repository.MaintenanceRequestRepository;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

import java.lang.reflect.Proxy;
import java.time.Instant;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class MaintenanceRequestReadTest {

    private final Map<Long, MaintenanceRequest> storedRequests = new HashMap<>();
    private final MaintenanceRequestService service =
            new MaintenanceRequestService(inMemoryRepository(), null, null);
    private final MaintenanceRequestController controller = new MaintenanceRequestController(service);

    @Test
    void listReturnsEmptyWhenThereAreNoRequests() {
        assertTrue(controller.list().isEmpty());
    }

    @Test
    void listOrdersByDateAndThenId() {
        storedRequests.put(3L, request(3L, "2026-10-02T10:00:00Z"));
        storedRequests.put(2L, request(2L, "2026-10-01T10:00:00Z"));
        storedRequests.put(1L, request(1L, "2026-10-01T10:00:00Z"));

        assertEquals(java.util.List.of(1L, 2L, 3L),
                controller.list().stream().map(MaintenanceRequestResponse::id).toList());
    }

    @Test
    void findByIdReturnsResponseWithRelationshipIds() {
        MaintenanceRequest request = request(1L, "2026-10-01T10:00:00Z");
        Client client = new Client();
        client.setId_person(7L);
        Category category = new Category();
        category.setId(9L);
        request.setClient(client);
        request.setCategory(category);
        storedRequests.put(1L, request);

        assertEquals(new MaintenanceRequestResponse(1L, 7L, 9L, "Notebook", "Não liga",
                request.getRequestDateTime(), RequestStatus.OPEN), controller.findById(1L));
    }

    @Test
    void responseAllowsMissingRelationships() {
        storedRequests.put(1L, request(1L, "2026-10-01T10:00:00Z"));

        MaintenanceRequestResponse response = controller.findById(1L);

        assertNull(response.clientId());
        assertNull(response.categoryId());
    }

    @Test
    void missingRequestProducesNotFoundResponse() {
        var exception = assertThrows(MaintenanceRequestService.MaintenanceRequestNotFoundException.class,
                () -> controller.findById(99L));

        var response = controller.handleNotFound(exception);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals(Map.of("message", "Solicitação não encontrada: 99"), response.getBody());
    }

    private MaintenanceRequest request(Long id, String date) {
        return new MaintenanceRequest(id, "Notebook", "Não liga", Instant.parse(date),
                RequestStatus.OPEN, null, null, null, null, java.util.List.of());
    }

    private MaintenanceRequestRepository inMemoryRepository() {
        return (MaintenanceRequestRepository) Proxy.newProxyInstance(
                MaintenanceRequestRepository.class.getClassLoader(),
                new Class<?>[]{MaintenanceRequestRepository.class},
                (proxy, method, args) -> switch (method.getName()) {
                    case "findAllByOrderByRequestDateTimeAscIdAsc" -> storedRequests.values().stream()
                            .sorted(Comparator.comparing(MaintenanceRequest::getRequestDateTime)
                                    .thenComparing(MaintenanceRequest::getId))
                            .toList();
                    case "findById" -> Optional.ofNullable(storedRequests.get(args[0]));
                    default -> throw new UnsupportedOperationException(method.getName());
                });
    }
}
