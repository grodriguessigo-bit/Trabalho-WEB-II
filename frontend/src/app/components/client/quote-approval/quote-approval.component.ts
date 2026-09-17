import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CategoryService } from '../../../services/category.service';
import { LoginService } from '../../../services/login.service';
import { MaintenanceRequestService } from '../../../services/maintenance-request.service';
import { QuoteService } from '../../../services/quote.service';
import { HistoryActions } from '../../../shared/enum/history-actions.enum';
import { RequestStatus } from '../../../shared/enum/request-status.enum';
import { MaintenanceRequest } from '../../../shared/models/maintenance-request';
import { RequestHistory } from '../../../shared/models/request-history.model';

@Component({
	selector: 'app-quote-approval',
	imports: [CommonModule],
	templateUrl: './quote-approval.component.html',
	styleUrl: './quote-approval.component.css',
})
export class QuoteApprovalComponent {
	request: MaintenanceRequest | undefined;
	quotePrice: number | undefined;
	quoteDescription = '';
	categoryName = '';
	message = '';

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private loginService: LoginService,
		private maintenanceRequestService: MaintenanceRequestService,
		private quoteService: QuoteService,
		private categoryService: CategoryService,
	) {
		if (this.loginService.getLoggedUserType() !== 'CLIENT') {
			this.router.navigate(['/login']);
			return;
		}

		const requestId = Number(this.route.snapshot.paramMap.get('id'));
		const request = this.maintenanceRequestService.findById(requestId);

		if (!request || request.clientId !== this.loginService.getLoggedUserId()) {
			this.router.navigate(['/client/home']);
			return;
		}

		const quote = this.quoteService.findByRequestId(requestId);

		if (!quote) {
			this.router.navigate(['/client/home']);
			return;
		}

		this.request = request;
		this.quotePrice = quote.price;
		this.quoteDescription = quote.description ?? '';
		this.categoryName = this.categoryService.findById(request.categoryId)?.name ?? '';
	}

	approve(): void {
		this.updateRequestStatus(RequestStatus.APPROVED, HistoryActions.QUOTE_APPROVED, 'Orçamento aprovado pelo cliente.');
	}

	reject(): void {
		this.updateRequestStatus(RequestStatus.REJECTED, HistoryActions.QUOTE_REJECTED, 'Orçamento rejeitado pelo cliente.');
	}

	goBack(): void {
		this.router.navigate(['/client/home']);
	}

	private updateRequestStatus(
		status: RequestStatus,
		action: HistoryActions,
		description: string,
	): void {
		if (!this.request || this.request.status !== RequestStatus.QUOTED) {
			this.message = 'Esta solicitação não está aguardando aprovação.';
			return;
		}

		const changeDateTime = new Date().toISOString();
		const previousStatus = this.request.status;
		this.request.requestHistory ??= [];

		this.request.status = status;
		this.request.requestHistory.push(
			new RequestHistory(
				this.request.requestHistory.length + 1,
				action,
				previousStatus,
				status,
				changeDateTime,
				description,
				'Cliente',
			),
		);

		this.maintenanceRequestService.update(this.request);
		this.router.navigate(['/client/home']);
	}
}
