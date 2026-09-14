import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Employee } from '../../../shared/models/employee.model';
import { EmployeeService } from '../../../services/employee.service';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-employee-home',
  imports: [],
  templateUrl: './employee-home.component.html',
  styleUrl: './employee-home.component.css',
})
export class EmployeeHomeComponent {

  employee: Employee | undefined;

  constructor(
    private employeeService: EmployeeService,
    private loginService: LoginService,
    private router: Router
  ) {
    const id = this.loginService.getLoggedUserId();

    this.employee = this.employeeService.findById(id);
  }

  logout(): void {
    this.loginService.logout();

    this.router.navigate(['/login']);
  }

}