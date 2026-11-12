import { Component, signal, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { CreateEmployeeDTO, EmployeeService } from '../../../services/employee.service';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-insert-employee',
  imports: [FormsModule, RouterModule],
  templateUrl: './insert-employee.component.html',
  styleUrl: './insert-employee.component.css'
})
export class InsertEmployeeComponent {
  @ViewChild('formEmployee') formEmployee!: NgForm;

  employee: CreateEmployeeDTO = {
    name: '',
    email: '',
    birthDate: '',
    password: ''
  };

  message = signal('');

  constructor(
    private employeeService: EmployeeService,
    private loginService: LoginService,
    private router: Router
  ) {
    if (this.loginService.getLoggedUserType() !== 'EMPLOYEE') {
      this.router.navigate(['/login']);
    }
  }

  insert(): void {
    if (!this.formEmployee.form.valid) {
      return;
    }

    this.message.set('');

    this.employeeService.insert(this.employee).subscribe({
      next: () => {
        this.router.navigate(['/employee/list']);
      },
      error: error => {
        this.message.set(
          error.error?.message ?? 'Erro ao cadastrar funcionário.'
        );
      }
    });
  }
}