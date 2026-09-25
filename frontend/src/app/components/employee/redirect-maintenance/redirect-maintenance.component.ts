import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RequestService } from '../../../services/request.service';
import { EmployeeService } from '../../../services/employee.service';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-redirect-maintenance',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './redirect-maintenance.component.html',
  styleUrls: ['./redirect-maintenance.component.css']
})
export class RedirectMaintenanceComponent implements OnInit {
  request: any = null;
  employees: any[] = [];
  targetEmployeeId: string = '';
  message: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private requestService: RequestService,
    private employeeService: EmployeeService,
    private loginService: LoginService
  ) {
    if (this.loginService.getLoggedUserType() !== "EMPLOYEE") {
      this.router.navigate(['/login']);
      return;
    }
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadRequest(id);
      this.loadEmployees();
    } else {
      this.message = 'ID da solicitação não fornecido na URL.';
    }
  }

  loadRequest(id: string): void {
    const numericId = Number(id);
    const found = this.requestService.findById(numericId);
    if (found) {
      this.request = found;
    } else {
      this.message = 'Solicitação não encontrada.';
    }
  }

  loadEmployees(): void {
    const loggedUserId = this.loginService.getLoggedUserId();
    const empList: any = this.employeeService.listAll ? this.employeeService.listAll() : [];

    if (Array.isArray(empList)) {
      this.employees = empList.filter((emp: any) => emp.id !== loggedUserId);
    } else {
      this.employees = [];
    }
  }

  redirectMaintenance(): void {
    if (!this.request) {
      this.message = 'Solicitação inválida.';
      return;
    }

    if (!this.targetEmployeeId) {
      this.message = 'Selecione o funcionário de destino.';
      return;
    }

    const sourceEmployeeId = this.loginService.getLoggedUserId();
    const redirectionData = {
      requestId: this.request.id,
      sourceEmployeeId: sourceEmployeeId,
      targetEmployeeId: Number(this.targetEmployeeId),
      dateTime: new Date().toISOString(),
      status: 'REDIRECIONADA'
    };

    if (this.requestService.redirectMaintenance) {
      this.requestService.redirectMaintenance(redirectionData);
    } else {
      this.request.status = 'REDIRECIONADA';
    }

    alert('Solicitação redirecionada com sucesso!');
    this.router.navigate(['/employee/home']);
  }
}