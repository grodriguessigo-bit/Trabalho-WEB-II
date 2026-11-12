import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { EmployeeDTO, EmployeeService } from '../../../services/employee.service';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-list-employee',
  imports: [RouterModule, CommonModule],
  templateUrl: './list-employee.component.html',
  styleUrl: './list-employee.component.css'
})
export class ListEmployeeComponent {
  employees = signal<EmployeeDTO[]>([]);

  constructor(
    private employeeService: EmployeeService,
    private loginService: LoginService,
    private router: Router
  ) {
    if (this.loginService.getLoggedUserType() !== 'EMPLOYEE') {
      this.router.navigate(['/login']);
      return;
    }

    this.listAll();
  }

  listAll(): void {
    this.employeeService.listAll().subscribe({
      next: employees => {
        this.employees.set(employees);
      },
      error: error => {
        alert(error.error?.message ?? 'Erro ao carregar funcionários.');
      }
    });
  }

  remove(employee: EmployeeDTO): void {
    const loggedId = this.loginService.getLoggedUserId();

    if (employee.id === loggedId) {
      alert('Você não pode remover a si mesmo.');
      return;
    }

    const activeEmployees = this.employees().filter(employee => employee.active);

    if (activeEmployees.length === 1) {
      alert('O único funcionário não pode ser removido.');
      return;
    }

    if (!confirm('Deseja remover o funcionário ' + employee.name + '?')) {
      return;
    }

    this.employeeService.remove(employee.id).subscribe({
      next: () => {
        this.listAll();
      },
      error: error => {
        alert(error.error?.message ?? 'Erro ao remover funcionário.');
      }
    });
  }
}