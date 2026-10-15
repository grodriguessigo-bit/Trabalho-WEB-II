package com.web2.trabalhoFinal.repository;

import com.web2.trabalhoFinal.entities.MaintenanceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MaintenanceRequestRepository extends JpaRepository<MaintenanceRequest, Long> {
    List<MaintenanceRequest> findAllByOrderByRequestDateTimeAscIdAsc();

    @Query("select request from MaintenanceRequest request where request.client.id_person = :clientId "
            + "order by request.requestDateTime asc, request.id asc")
    List<MaintenanceRequest> findAllByClientId(@Param("clientId") Long clientId);
}
