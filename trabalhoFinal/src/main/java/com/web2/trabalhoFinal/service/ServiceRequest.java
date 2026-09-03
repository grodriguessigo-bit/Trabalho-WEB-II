package com.web2.trabalhoFinal.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "service_requests")
@Data
public class ServiceRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User client; 

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now(); 

    @NotBlank(message = "Equipment description is required")
    @Size(max = 30, message = "Equipment description must be up to 30 characters")
    @Column(length = 30, nullable = false)
    private String equipmentDescription;

    @Column(nullable = false)
    private String state = "ABERTA"; 
}