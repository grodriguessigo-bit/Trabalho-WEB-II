import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { MaintenanceRequest } from '../../../shared/models/maintenance-request';
import { RequestHistory } from '../../../shared/models/request-history.model';
import { RequestStatus } from '../../../shared/enum/request-status.enum';
import { HistoryActions } from '../../../shared/enum/history-actions.enum';
import { MaintenanceRequestService } from '../../../services/maintenance-request.service';
import { LoginService } from '../../../services/login.service';
import { EmployeeService } from '../../../services/employee.service';
import { CommonModule } from '@angular/common';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-finalize-request',
  imports: [RouterLink, CommonModule],
  templateUrl: './finalize-request.component.html',
  styleUrl: './finalize-request.component.css',
})

export class FinalizeRequestComponent {

  request: MaintenanceRequest | undefined;
  message: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private maintenanceRequestService: MaintenanceRequestService,
    private loginService: LoginService,
    private employeeService: EmployeeService
  ) {

    if (this.loginService.getLoggedUserType() !== 'EMPLOYEE') {
      this.router.navigate(['/login']);
      return;
    }

    const id =
      Number(this.route.snapshot.paramMap.get('id'));

    this.request =
      this.maintenanceRequestService.findById(id);

    if (!this.request) {
      this.router.navigate(['/employee/home']);
    }
  }

finalizeRequest(): void {

    if (!this.request) {
      return;
    }

    if (this.request.status !== RequestStatus.PAID) {
      this.message =
        'A solicitação precisa estar paga para ser finalizada.';
      return;
    }

    const request = this.request;

    this.employeeService.findById(
      this.loginService.getLoggedUserId()
    ).pipe(
      catchError(() => of(undefined))
    ).subscribe((employee) => {

      const previousStatus =
        request.status;

      const changeDateTime =
        new Date().toISOString();

      request.status =
        RequestStatus.FINALIZED;

      const history =
        new RequestHistory(
          request.requestHistory.length + 1,
          HistoryActions.REQUEST_FINALIZED,
          previousStatus,
          RequestStatus.FINALIZED,
          changeDateTime,
          'Solicitação finalizada.',
          employee ? employee.name : ''
        );

      request.requestHistory.push(history);

      this.maintenanceRequestService.update(
        request
      );

      alert('Solicitação finalizada.');

      this.router.navigate(['/employee/home']);
    });
  }
}