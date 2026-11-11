import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LoginService } from '../../../services/login.service';
import { MaintenanceRequestService } from '../../../services/maintenance-request.service';
import { PaymentService } from '../../../services/payment.service';
import { RequestStatus } from '../../../shared/enum/request-status.enum';
import { ClientRequestDetailsDTO } from '../../../shared/models/request-api.model';

@Component({
  selector: 'app-pay-request',
  imports: [CommonModule, RouterLink],
  templateUrl: './pay-request.component.html',
  styleUrl: './pay-request.component.css',
})
export class PayRequestComponent implements OnInit {

  request = signal<ClientRequestDetailsDTO | null>(null);
  message = signal('');
  paymentConfirmed = signal(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService,
    private maintenanceRequestService: MaintenanceRequestService,
    private paymentService: PaymentService
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
            response.data.status !== RequestStatus.FIXED
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

  confirmPayment(): void {

    const request = this.request();

    if (!request) {
      return;
    }

    this.message.set('');

    this.paymentService
      .pay(request.requestId)
      .subscribe({
        next: response => {
          this.paymentConfirmed.set(true);
          this.message.set(response.message);
        },

        error: error => {
          this.message.set(
            error.error?.message ??
            'Não foi possível confirmar o pagamento.'
          );
        }
      });
  }
}