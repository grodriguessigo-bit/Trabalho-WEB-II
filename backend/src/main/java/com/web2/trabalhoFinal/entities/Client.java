package com.web2.trabalhoFinal.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name="client")
@Getter
@Setter
@NoArgsConstructor
public class Client extends Person {

    @Column(nullable = false)
    private String cpf;

    @Column(nullable = false)
    private String phone;

    @OneToOne
    @JoinColumn(name = "id_address")
    private Address address;

    // criar classe MaintenanceRequest e mapear
    // @OneToMany(mappedBy = "client")
    // private List<MaintenanceRequest> maintenanceRequests;

}