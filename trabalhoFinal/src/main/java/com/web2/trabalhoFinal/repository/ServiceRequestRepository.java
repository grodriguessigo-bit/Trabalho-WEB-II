package com.web2.trabalhoFinal.repository;

import com.web2.trabalhoFinal.model.ServiceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {
    List<ServiceRequest> findByClientIdOrderByCreatedAtAsc(Long clientId);
}