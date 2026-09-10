package com.web2.trabalhoFinal.entities;

import com.web2.trabalhoFinal.entities.enums.RequestStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Entity
@Table(name="maintenance_request")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class MaintenanceRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String equipmentDescription;

    @Column(nullable = false)
    private String defectDescription;

    @Column(nullable = false)
    private Instant requestDateTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus requestStatus;

    @ManyToOne
    @JoinColumn(name="id_client")
    private Client client;

    @ManyToOne
    @JoinColumn(name="id_category")
    private Category category;

    @OneToOne
    @JoinColumn(name="id_quote")
    private Quote quote;

    @OneToOne
    @JoinColumn(name="id_maintenance")
    private Maintenance maintenance;

    @OneToMany(mappedBy = "maintenanceRequest")
    private List<RequestHistory> requestHistory;

}

