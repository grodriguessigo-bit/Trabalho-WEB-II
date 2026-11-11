import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../../../services/login.service';
import { MaintenanceRequestService } from '../../../services/maintenance-request.service';
import { HistoryActions } from '../../../shared/enum/history-actions.enum';
import { RequestStatus } from '../../../shared/enum/request-status.enum';
import { ClientRequestDetailsDTO, ACTION_LABELS, STATUS_LABELS } from '../../../shared/models/request-api.model';

@Component({
  selector: 'app-request-details.component',
  imports: [CommonModule],
  templateUrl: './request-details.component.component.html',
  styleUrl: './request-details.component.component.css',
})
export class RequestDetailsComponentComponent implements OnInit {

  request = signal<ClientRequestDetailsDTO | null>(null);
  message = signal('');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService,
    private maintenanceRequestService: MaintenanceRequestService
  ) {}

  ngOnInit(): void {

    if (this.loginService.getLoggedUserType() !== 'CLIENT') {
      this.router.navigate(['/login']);
      return;
    }

    const requestId =
      Number(this.route.snapshot.paramMap.get('id'));

    this.loadRequest(requestId);
  }

  loadRequest(requestId: number): void {

    this.maintenanceRequestService
      .getClientDetails(requestId)
      .subscribe({
        next: response => {
          this.request.set(response.data);
        },

        error: () => {
          this.router.navigate(['/client/home']);
        }
      });
  }

  getStatusLabel(status: RequestStatus): string {
    return STATUS_LABELS[status];
  }

  getActionLabel(action: HistoryActions): string {
    return ACTION_LABELS[action];
  }

  canReviewQuote(): boolean {

    return (
      this.request()?.status === RequestStatus.QUOTED &&
      this.request()?.quote != null
    );
  }

  openQuote(): void {

    const request = this.request();

    if (request) {
      this.router.navigate([
        '/client/quote-approval',
        request.requestId
      ]);
    }
  }

  rescueRequest(): void {

    const request = this.request();

    if (!request) {
      return;
    }

    this.maintenanceRequestService
      .rescueRequest(request.requestId)
      .subscribe({
        next: response => {
          this.message.set(response.message);
          this.loadRequest(request.requestId);
        },

        error: error => {
          this.message.set(
            error.error?.message ??
            'Não foi possível resgatar a solicitação.'
          );
        }
      });
  }

  payRequest(): void {

    const request = this.request();

    if (request) {
      this.router.navigate([
        '/client/pay-request',
        request.requestId
      ]);
    }
  }

  goBack(): void {
    this.router.navigate(['/client/home']);
  }
}