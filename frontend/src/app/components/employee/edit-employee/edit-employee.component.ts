import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { Employee } from '../../../shared/models/employee.model';
import { EmployeeService } from '../../../services/employee.service';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-edit-employee',
  imports: [FormsModule, RouterModule],
  templateUrl: './edit-employee.component.html',
  styleUrl: './edit-employee.component.css',
})
export class EditEmployeeComponent {

  employee: Employee = new Employee();

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

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    const employee = this.employeeService.findById(id);

    if (employee) {
      this.employee = employee;
    } else {
      this.router.navigate(['/employee/list']);
    }

  }

  update(): void {

    const employee = this.employeeService.listAll().find(
      item =>
        item.email === this.employee.email &&
        item.id !== this.employee.id
    );

    if (employee) {
      this.message = "E-mail já cadastrado.";
      return;
    }

    this.employeeService.update(this.employee);

    this.router.navigate(['/employee/list']);
  }

}