package com.web2.trabalhoFinal.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name="maintenance")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Maintenance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_maintenance;

    @Column(nullable = false)
    private String maintenanceDescription;

    @Column(nullable = false)
    private String clienteInstructions;

    @Column(nullable = false)
    private Instant maintenanceDateTime;

    @ManyToOne
    @JoinColumn(name = "id_employee")
    private Employee employee;

}
