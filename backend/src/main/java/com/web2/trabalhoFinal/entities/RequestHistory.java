package com.web2.trabalhoFinal.entities;

import com.web2.trabalhoFinal.entities.enums.HistoryActions;
import com.web2.trabalhoFinal.entities.enums.RequestStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name="request_history")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RequestHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private HistoryActions actions;

    @Column(nullable = false)
    private RequestStatus previousStatus;

    @Column(nullable = false)
    private RequestStatus newStatus;

    @Column(nullable = false)
    private Instant changeDateTime;

    @ManyToOne
    @JoinColumn(name = "id_person")
    private Person performedBy;

    @ManyToOne
    @JoinColumn(name = "idMaintenanceRequest", nullable = false)
    private MaintenanceRequest maintenanceRequest;

    @OneToOne(mappedBy = "requestHistory")
    private Redirect redirect;

}
