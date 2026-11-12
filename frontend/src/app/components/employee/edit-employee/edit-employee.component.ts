import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { EmployeeService, UpdateEmployeeDTO } from '../../../services/employee.service';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-edit-employee',
  imports: [FormsModule, RouterModule],
  templateUrl: './edit-employee.component.html',
  styleUrl: './edit-employee.component.css'
})
export class EditEmployeeComponent {
  id = 0;

  name = signal('');
  email = signal('');
  birthDate = signal('');
  newPassword = signal('');
  message = signal('');

  constructor(
    private employeeService: EmployeeService,
    private loginService: LoginService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    if (this.loginService.getLoggedUserType() !== 'EMPLOYEE') {
      this.router.navigate(['/login']);
      return;
    }

    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.employeeService.findById(this.id).subscribe({
      next: employee => {
        this.name.set(employee.name);
        this.email.set(employee.email);
        this.birthDate.set(employee.birthDate);
      },
      error: () => {
        this.router.navigate(['/employee/list']);
      }
    });
  }

  update(): void {
    const employee: UpdateEmployeeDTO = {
      name: this.name(),
      email: this.email(),
      birthDate: this.birthDate(),
      newPassword: this.newPassword()
    };

    this.message.set('');

    this.employeeService.update(this.id, employee).subscribe({
      next: () => {
        this.router.navigate(['/employee/list']);
      },
      error: error => {
        this.message.set(
          error.error?.message ?? 'Erro ao atualizar funcionário.'
        );
      }
    });
  }
}