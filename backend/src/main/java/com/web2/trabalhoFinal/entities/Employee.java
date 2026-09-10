package com.web2.trabalhoFinal.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name="employee")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Employee extends Person {

    private LocalDate birthDate;

    @OneToMany(mappedBy = "employee")
    private List<Quote> quotes;

    @OneToMany(mappedBy = "employee")
    private List<Maintenance> maintenances;

}
