import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MaintenanceRequestService } from '../../../services/maintenance-request.service';
import { ClientService } from '../../../services/client.service';
import { Client } from '../../../shared/models/client.model';
import { EmployeeService } from '../../../services/employee.service'; 
import { LoginService } from '../../../services/login.service';
import { RequestStatus } from '../../../shared/enum/request-status.enum';

@Component({
  selector: 'app-redirect-maintenance',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './redirect-maintenance.component.html',
  styleUrls: ['./redirect-maintenance.component.css']
})
export class RedirectMaintenanceComponent implements OnInit {
  request: any = null;
  client?: Client;
  employees: any[] = [];
  targetEmployeeId: string = '';
  message: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private requestService: MaintenanceRequestService,
    private clientService: ClientService,
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
      this.message = '';     
      if (found.clientId) {
      this.client = this.clientService.findById(found.clientId);
    }
  }   else {
      this.request = null; 
      this.message = 'Solicitação não encontrada.';
  }
}

  loadEmployees(): void {
    const loggedUserId = this.loginService.getLoggedUserId();
    const empList: any = this.employeeService.listAll ? this.employeeService.listAll() : [];

    if (Array.isArray(empList) && empList.length > 0) {
      this.employees = empList.filter((emp: any) => Number(emp.id) !== loggedUserId);
    } else {
      this.employees = [];
    }
  }

  redirectMaintenance(): void {
    if (!this.request) {
      this.request.status = 'Solicitação inválida.';
      return;
    }

    if (!this.targetEmployeeId) {
      this.message = 'Selecione o funcionário de destino.';
      return;
    }
    this.request.status = RequestStatus.REDIRECTED;
    if ('assignedEmployeeId' in this.request) {
    this.request.assignedEmployeeId = Number(this.targetEmployeeId);
    }

    this.requestService.update(this.request);

    alert('Solicitação redirecionada com sucesso!');
    this.router.navigate(['/employee/home']);
  }
}