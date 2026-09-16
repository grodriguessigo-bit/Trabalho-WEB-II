import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { Employee } from '../../../shared/models/employee.model';
import { EmployeeService } from '../../../services/employee.service';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-list-employee',
  imports: [RouterModule, CommonModule],
  templateUrl: './list-employee.component.html',
  styleUrl: './list-employee.component.css',
})
export class ListEmployeeComponent {

  employees: Employee[] = [];

  constructor(
    private employeeService: EmployeeService,
    private loginService: LoginService,
    private router: Router
  ) {

    if (this.loginService.getLoggedUserType() !== "EMPLOYEE") {
      this.router.navigate(['/login']);
      return;
    }

    this.listAll();
  }

  listAll(): void {
    this.employees = this.employeeService.listAll();
  }

  remove(employee: Employee): void {

    if (employee.id === this.loginService.getLoggedUserId()) {
      alert("Você não pode remover a si mesmo.");
      return;
    }

    const activeEmployees = this.employees.filter(
      employee => employee.active
    );

    if (activeEmployees.length === 1) {
      alert("O único funcionário não pode ser removido.");
      return;
    }

    if (confirm("Deseja remover o funcionário " + employee.name + "?")) {
      this.employeeService.remove(employee.id);

      this.listAll();
    }

  }

}