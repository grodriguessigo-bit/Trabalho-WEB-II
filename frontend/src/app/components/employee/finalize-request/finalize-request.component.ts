import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LoginService } from '../../../services/login.service';
import { MaintenanceRequestService } from '../../../services/maintenance-request.service';
import { RequestStatus } from '../../../shared/enum/request-status.enum';
import { EmployeeRequestDetailsDTO } from '../../../shared/models/request-api.model';

@Component({
  selector: 'app-finalize-request',
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './finalize-request.component.html',
  styleUrl: './finalize-request.component.css',
})
export class FinalizeRequestComponent implements OnInit {

  request =
    signal<EmployeeRequestDetailsDTO | null>(null);

  message = signal('');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private maintenanceRequestService: MaintenanceRequestService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {

    if (this.loginService.getLoggedUserType() !== 'EMPLOYEE') {
      this.router.navigate(['/login']);
      return;
    }

    const requestId =
      Number(this.route.snapshot.paramMap.get('id'));

    this.maintenanceRequestService
      .getEmployeeDetails(requestId)
      .subscribe({
        next: response => {

          if (
            !response.data ||
            response.data.status !== RequestStatus.PAID
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

  finalizeRequest(): void {

    const request = this.request();

    if (!request) {
      return;
    }

    this.message.set('');

    this.maintenanceRequestService
      .finalizeRequest(request.requestId)
      .subscribe({
        next: response => {
          alert(response.message);
          this.router.navigate(['/employee/home']);
        },

        error: error => {
          this.message.set(
            error.error?.message ??
            'Não foi possível finalizar a solicitação.'
          );
        }
      });
  }
}