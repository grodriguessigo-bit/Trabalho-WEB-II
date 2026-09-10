package com.web2.trabalhoFinal.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="redirect")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Redirect {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "id_request_history", nullable = false, unique = true)
    private RequestHistory requestHistory;

    @OneToOne
    @JoinColumn(name="id_SourceEmployee")
    private Employee sourceEmployee;

    @OneToOne
    @JoinColumn(name="id_destinationEmployee")
    private Employee destinationEmployee;

}
