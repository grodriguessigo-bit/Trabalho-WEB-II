import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { LoginService } from '../../../services/login.service';
import { MaintenanceRequestService } from '../../../services/maintenance-request.service';

import { RequestStatus } from '../../../shared/enum/request-status.enum';
import { EmployeeRequestDetailsDTO } from '../../../shared/models/request-api.model';

@Component({
  selector: 'app-budget-rejected',
  templateUrl: './budget_rejected.component.html',
  imports: [CommonModule],
  styleUrls: ['./budget_rejected.component.css']
})
export class BudgetRejectedComponent implements OnInit {

  request =
    signal<EmployeeRequestDetailsDTO | null>(null);

  message = signal('');

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private loginService: LoginService,
    private requestService: MaintenanceRequestService
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
            !response.data ||
            response.data.status !== RequestStatus.REJECTED
          ) {
            this.router.navigate(['/employee/home']);
            return;
          }

          this.request.set(response.data);
        },

        error: error => {
          this.message.set(
            error.error?.message ??
            'Não foi possível consultar a solicitação.'
          );
        }
      });
  }

  getRejectionReason(): string {

    const request = this.request();

    if (!request) {
      return '';
    }

    const rejection =[...request.history].reverse().find(history =>history.rejectionReason);

    return rejection?.rejectionReason ?? '';
  }

  goBack(): void {
    this.router.navigate(['/employee/home']);
  }
}