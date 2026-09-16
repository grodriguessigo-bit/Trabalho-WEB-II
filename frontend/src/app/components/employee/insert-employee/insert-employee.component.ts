import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { Employee } from '../../../shared/models/employee.model';
import { EmployeeService } from '../../../services/employee.service';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-insert-employee',
  imports: [FormsModule, RouterModule],
  templateUrl: './insert-employee.component.html',
  styleUrl: './insert-employee.component.css',
})
export class InsertEmployeeComponent {

  @ViewChild('formEmployee') formEmployee!: NgForm;

  employee: Employee = new Employee();

  message: string = "";

  constructor(
    private employeeService: EmployeeService,
    private loginService: LoginService,
    private router: Router
  ) {

    if (this.loginService.getLoggedUserType() !== "EMPLOYEE") {
      this.router.navigate(['/login']);
    }

  }

  insert(): void {

    if (this.formEmployee.form.valid) {

      const employee = this.employeeService.findByEmail(
        this.employee.email
      );

      if (employee) {
        this.message = "E-mail já cadastrado.";
        return;
      }

      this.employeeService.insert(this.employee);

      this.router.navigate(['/employee/list']);
    }

  }

}