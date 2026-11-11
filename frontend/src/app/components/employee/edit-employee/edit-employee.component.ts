import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { EmployeeService, UpdateEmployeeDTO } from '../../../services/employee.service';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-edit-employee',
  imports: [FormsModule, RouterModule],
  templateUrl: './edit-employee.component.html',
  styleUrl: './edit-employee.component.css',
})
export class EditEmployeeComponent {

  id: number = 0;

  employee: UpdateEmployeeDTO = {
    name: '',
    email: '',
    birthDate: '',
    newPassword: ''
  };

  message: string = "";

  constructor(
    private employeeService: EmployeeService,
    private loginService: LoginService,
    private route: ActivatedRoute,
    private router: Router
  ) {

    if (this.loginService.getLoggedUserType() !== "EMPLOYEE") {
      this.router.navigate(['/login']);
      return;
    }

    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.employeeService.findById(this.id).subscribe({
      next: (employee) => {
        // A senha nunca vem do servidor: o campo começa vazio.
        this.employee = {
          name: employee.name,
          email: employee.email,
          birthDate: employee.birthDate,
          newPassword: ''
        };
      },
      error: () => {
        this.router.navigate(['/employee/list']);
      }
    });

  }

  update(): void {

    this.message = "";
    this.employeeService.update(this.id, this.employee).subscribe({
      next: () => {
        this.router.navigate(['/employee/list']);
      },
      error: (err) => {
        this.message = err.error?.message ?? "Erro ao atualizar funcionário.";
      }
    });
  }

}