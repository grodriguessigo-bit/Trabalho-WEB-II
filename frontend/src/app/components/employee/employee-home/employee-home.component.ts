import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { Employee } from '../../../shared/models/employee.model';
import { EmployeeService } from '../../../services/employee.service';
import { LoginService } from '../../../services/login.service';

import { MaintenanceRequest } from '../../../shared/models/maintenance-request';
import { MaintenanceRequestService } from '../../../services/maintenance-request.service';


@Component({
  selector: 'app-employee-home',
  imports: [RouterModule],
  templateUrl: './employee-home.component.html',
  styleUrl: './employee-home.component.css',
})
export class EmployeeHomeComponent {

  employee: Employee | undefined;

  clientRequest: MaintenanceRequest | undefined;

  constructor(
    private employeeService: EmployeeService,
    private loginService: LoginService,
    private router: Router,
    private maintenanceRequestService: MaintenanceRequestService
  )
  {
    this.clientRequest = this.maintenanceRequestService.findOpenRequest()[0]; //mockando cliente

    if (this.loginService.getLoggedUserType() !== "EMPLOYEE") {
      this.router.navigate(['/login']);
      return;
    }

    const id = this.loginService.getLoggedUserId();

    this.employee = this.employeeService.findById(id);

    this.clientRequest = this.maintenanceRequestService.findOpenRequest()[0];
  }

  logout(): void {
    this.loginService.logout();

    this.router.navigate(['/login']);
  }

}
