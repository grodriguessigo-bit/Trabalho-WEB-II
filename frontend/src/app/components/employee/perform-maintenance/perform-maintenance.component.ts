import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LoginService } from '../../../services/login.service';
import { MaintenanceRequestService } from '../../../services/maintenance-request.service';
import { MaintenanceService } from '../../../services/maintenance.service';
import { RequestStatus } from '../../../shared/enum/request-status.enum';
import { EmployeeRequestDetailsDTO, STATUS_LABELS } from '../../../shared/models/request-api.model';

@Component({
  selector: 'app-perform-maintenance',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './perform-maintenance.component.html',
  styleUrl: './perform-maintenance.component.css'
})
export class PerformMaintenanceComponent implements OnInit {

  request = signal<EmployeeRequestDetailsDTO | null>(null);
  message = signal('');

  maintenanceDescription = '';
  clientGuidelines = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService,
    private requestService: MaintenanceRequestService,
    private maintenanceService: MaintenanceService
  ) {}

  ngOnInit(): void {

    if (this.loginService.getLoggedUserType() !== 'EMPLOYEE') {
      this.router.navigate(['/login']);
      return;
    }

    const requestId =
      Number(this.route.snapshot.paramMap.get('id'));

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

  performMaintenance(): void {

    const request = this.request();

    if (!request) {
      return;
    }

    if (!this.maintenanceDescription.trim()) {
      this.message.set(
        'Informe a descrição da manutenção.'
      );
      return;
    }

    if (!this.clientGuidelines.trim()) {
      this.message.set(
        'Informe as orientações para o cliente.'
      );
      return;
    }

    this.message.set('');

    this.maintenanceService
      .perform(
        request.requestId,
        this.maintenanceDescription,
        this.clientGuidelines
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/employee/home']);
        },

        error: error => {
          this.message.set(
            error.error?.message ??
            'Não foi possível registrar a manutenção.'
          );
        }
      });
  }

  redirect(): void {

    const request = this.request();

    if (request) {
      this.router.navigate([
        '/employee/request/redirect',
        request.requestId
      ]);
    }
  }

  getStatusLabel(status: RequestStatus): string {
    return STATUS_LABELS[status];
  }
}