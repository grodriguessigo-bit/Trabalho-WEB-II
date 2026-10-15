import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaintenanceRequestService } from '../../../services/maintenance-request.service';
import { QuoteService } from '../../../services/quote.service';

import { MaintenanceRequest } from '../../../shared/models/maintenance-request';

import { RequestStatus } from '../../../shared/enum/request-status.enum';
import { HistoryActions } from '../../../shared/enum/history-actions.enum';

@Component({
  selector: 'app-view-revenue-report',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './view-revenue-report.component.html',
  styleUrl: './view-revenue-report.component.css',
})
export class ViewRevenueReportComponent implements OnInit {

  startDate: string = '';
  endDate: string = '';

  dailyRevenue: {
    date: Date;
    total: number;
  }[] = [];

  totalRevenue: number = 0;
  message: string = '';

  constructor(
    private maintenanceRequestService: MaintenanceRequestService,
    private quoteService: QuoteService
  ) {}

  ngOnInit(): void {
    const today = new Date();

    const firstDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    this.startDate = firstDay.toISOString().split('T')[0];
    this.endDate = today.toISOString().split('T')[0];

    this.filterReport();
  }

  filterReport(): void {
    this.message = '';
    this.dailyRevenue = [];
    this.totalRevenue = 0;

    if (!this.startDate || !this.endDate) {
      this.message = 'Informe a data inicial e a data final.';
      return;
    }

    const start = new Date(
      this.startDate + 'T00:00:00'
    );

    const end = new Date(
      this.endDate + 'T23:59:59'
    );

    if (start > end) {
      this.message =
        'A data inicial não pode ser maior que a data final.';

      return;
    }

    const requests =
      this.maintenanceRequestService.listAll();

    requests.forEach(request => {

      if (
        request.status !== RequestStatus.PAID &&
        request.status !== RequestStatus.FINALIZED
      ) {
        return;
      }

      const paymentDate =
        this.getPaymentDate(request);

      if (!paymentDate) {
        return;
      }

      if (
        paymentDate < start ||
        paymentDate > end
      ) {
        return;
      }

      const value =
        this.getRequestValue(request);

      const day = new Date(
        paymentDate.getFullYear(),
        paymentDate.getMonth(),
        paymentDate.getDate()
      );

      const existingDay =
        this.dailyRevenue.find(
          item =>
            item.date.getTime() ===
            day.getTime()
        );

      if (existingDay) {
        existingDay.total += value;
      } else {
        this.dailyRevenue.push({
          date: day,
          total: value
        });
      }
    });

    this.dailyRevenue.sort(
      (a, b) =>
        a.date.getTime() -
        b.date.getTime()
    );

    this.calculateTotal();

    if (this.dailyRevenue.length === 0) {
      this.message =
        'Nenhuma receita encontrada para o período selecionado.';
    }
  }

  getPaymentDate(
    request: MaintenanceRequest
  ): Date | null {

    const history =
      (request.requestHistory || [])
        .find(
          item =>
            item.action ===
            HistoryActions.PAYMENT_CONFIRMED
        );

    if (!history) {
      return null;
    }

    if (!history.changeDateTime) {
      return null;
    }

    return new Date(
      history.changeDateTime
    );
  }

  getRequestValue(
    request: MaintenanceRequest
  ): number {

    const quote =
      this.quoteService.findByRequestId(
        request.id
      );

    if (!quote) {
      return 0;
    }

    return Number(
      quote.price
    );
  }

  calculateTotal(): void {
    this.totalRevenue =
      this.dailyRevenue.reduce(
        (total, item) =>
          total + item.total,
        0
      );
  }

  printReport(): void {
    if (this.dailyRevenue.length === 0) {
      this.message =
        'Não existem receitas para gerar o relatório.';

      return;
    }

    window.print();
  }
}