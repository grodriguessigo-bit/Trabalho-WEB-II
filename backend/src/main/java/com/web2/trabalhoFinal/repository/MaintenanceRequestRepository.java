package com.web2.trabalhoFinal.repository;

import com.web2.trabalhoFinal.entities.MaintenanceRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MaintenanceRequestRepository extends JpaRepository<MaintenanceRequest, Long> {
    List<MaintenanceRequest> findAllByOrderByRequestDateTimeAscIdAsc();
}
