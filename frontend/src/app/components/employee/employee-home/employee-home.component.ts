import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { Employee } from '../../../shared/models/employee.model';
import { EmployeeService } from '../../../services/employee.service';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-employee-home',
  imports: [RouterModule],
  templateUrl: './employee-home.component.html',
  styleUrl: './employee-home.component.css',
})
export class EmployeeHomeComponent {

  employee: Employee | undefined;
  clientRequest = {
    dateRequested: '01/01/2024',
    clientName: 'João da silva',
    equipamentName: 'Notebook Dell',
  };

  constructor(
    private employeeService: EmployeeService,
    private loginService: LoginService,
    private router: Router
  ) {

    if (this.loginService.getLoggedUserType() !== "EMPLOYEE") {
      this.router.navigate(['/login']);
      return;
    }

    const id = this.loginService.getLoggedUserId();

    this.employee = this.employeeService.findById(id);
  }

  logout(): void {
    this.loginService.logout();

    this.router.navigate(['/login']);
  }

}