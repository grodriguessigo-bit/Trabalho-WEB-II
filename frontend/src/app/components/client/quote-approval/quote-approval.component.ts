import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../../../services/login.service';
import { MaintenanceRequestService } from '../../../services/maintenance-request.service';
import { QuoteService } from '../../../services/quote.service';
import { RequestStatus } from '../../../shared/enum/request-status.enum';
import { ClientRequestDetailsDTO, STATUS_LABELS } from '../../../shared/models/request-api.model';

@Component({
  selector: 'app-quote-approval',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './quote-approval.component.html',
  styleUrl: './quote-approval.component.css',
})
export class QuoteApprovalComponent implements OnInit {

  request = signal<ClientRequestDetailsDTO | null>(null);
  message = signal('');
  approvalConfirmed = signal(false);

  rejectionReason = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService,
    private maintenanceRequestService: MaintenanceRequestService,
    private quoteService: QuoteService
  ) {}

  ngOnInit(): void {

    if (this.loginService.getLoggedUserType() !== 'CLIENT') {
      this.router.navigate(['/login']);
      return;
    }

    const requestId =
      Number(this.route.snapshot.paramMap.get('id'));

    this.maintenanceRequestService
      .getClientDetails(requestId)
      .subscribe({
        next: response => {

          if (
            !response.data ||
            !response.data.quote
          ) {
            this.router.navigate(['/client/home']);
            return;
          }

          this.request.set(response.data);
        },

        error: () => {
          this.router.navigate(['/client/home']);
        }
      });
  }

  approve(): void {

    const request = this.request();

    if (!request) {
      return;
    }

    this.message.set('');

    this.quoteService
      .approve(request.requestId)
      .subscribe({
        next: response => {
          this.message.set(response.message);
          this.approvalConfirmed.set(true);
        },

        error: error => {
          this.message.set(
            error.error?.message ??
            'Não foi possível aprovar o orçamento.'
          );
        }
      });
  }

  reject(): void {

    const request = this.request();

    if (!request) {
      return;
    }

    if (!this.rejectionReason.trim()) {
      this.message.set(
        'Informe o motivo da rejeição.'
      );
      return;
    }

    this.message.set('');

    this.quoteService
      .reject(
        request.requestId,
        this.rejectionReason
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/client/home']);
        },

        error: error => {
          this.message.set(
            error.error?.message ??
            'Não foi possível rejeitar o orçamento.'
          );
        }
      });
  }

  getStatusLabel(status: RequestStatus): string {
    return STATUS_LABELS[status];
  }

  goBack(): void {
    this.router.navigate(['/client/home']);
  }
}