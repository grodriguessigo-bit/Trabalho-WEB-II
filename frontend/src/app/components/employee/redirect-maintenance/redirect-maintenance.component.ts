import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LoginService } from '../../../services/login.service';
import { MaintenanceRequestService } from '../../../services/maintenance-request.service';
import { RedirectService } from '../../../services/redirect.service';
import { EmployeeDTO, EmployeeService } from '../../../services/employee.service';
import { RequestStatus } from '../../../shared/enum/request-status.enum';
import { EmployeeRequestDetailsDTO } from '../../../shared/models/request-api.model';

@Component({
  selector: 'app-redirect-maintenance',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './redirect-maintenance.component.html',
  styleUrls: ['./redirect-maintenance.component.css']
})
export class RedirectMaintenanceComponent implements OnInit {

  request = signal<EmployeeRequestDetailsDTO | null>(null);
  employees = signal<EmployeeDTO[]>([]);
  message = signal('');

  targetEmployeeId = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService,
    private requestService: MaintenanceRequestService,
    private redirectService: RedirectService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {

    if (this.loginService.getLoggedUserType() !== 'EMPLOYEE') {
      this.router.navigate(['/login']);
      return;
    }

    const requestId =
      Number(this.route.snapshot.paramMap.get('id'));

    this.loadRequest(requestId);
    this.loadEmployees();
  }

  loadRequest(requestId: number): void {

    this.requestService
      .getEmployeeDetails(requestId)
      .subscribe({
        next: response => {

          if (
            response.data.status !== RequestStatus.APPROVED &&
            response.data.status !== RequestStatus.REDIRECTED
          ) {
            this.router.navigate(['/employee/home']);
            return;
          }

          this.request.set(response.data);
        },

        error: () => {
          this.router.navigate(['/employee/home']);
        }
      });
  }

  loadEmployees(): void {

    const loggedEmployeeId =
      this.loginService.getLoggedUserId();

    this.employeeService
      .listAll()
      .subscribe({
        next: employees => {

          this.employees.set(
            employees.filter(
              employee =>
                employee.active &&
                employee.id !== loggedEmployeeId
            )
          );
        },

        error: () => {
          this.employees.set([]);
        }
      });
  }

  redirectMaintenance(): void {

    const request = this.request();

    if (!request) {
      return;
    }

    if (!this.targetEmployeeId) {
      this.message.set(
        'Selecione o funcionário de destino.'
      );
      return;
    }

    this.message.set('');

    this.redirectService.redirect(request.requestId, Number(this.targetEmployeeId)).subscribe({
        next: () => {
          this.router.navigate(['/employee/home']);
        },

        error: error => {
          this.message.set(error.error?.message ??'Não foi possível redirecionar a manutenção.'
          );
        }
      });
  }
}