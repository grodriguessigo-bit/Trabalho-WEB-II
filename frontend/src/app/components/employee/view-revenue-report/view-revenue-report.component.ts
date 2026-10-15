import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
<<<<<<< HEAD
import { RouterModule } from '@angular/router';
=======
import { Router, RouterModule } from '@angular/router';
>>>>>>> origin/main

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
<<<<<<< HEAD

  ngOnInit(): void {

    const today =
      new Date();

    const firstDay =
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );

    this.startDate =
      firstDay.toISOString().split('T')[0];

    this.endDate =
      today.toISOString().split('T')[0];
=======
ngOnInit(): void {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

    this.startDate = firstDay.toISOString().split('T')[0];
    this.endDate = now.toISOString().split('T')[0];
>>>>>>> origin/main

    this.filterReport();
  }

  filterReport(): void {
<<<<<<< HEAD

    this.message = '';

    this.dailyRevenue = [];

    this.totalRevenue = 0;

    if (!this.startDate || !this.endDate) {

      this.message =
        'Informe a data inicial e a data final.';

      return;
    }

    const start =
      new Date(
        this.startDate + 'T00:00:00'
      );

    const end =
      new Date(
        this.endDate + 'T23:59:59'
      );

    if (start > end) {

      this.message =
        'A data inicial não pode ser maior que a data final.';

      return;
    }

    const requests =
      this.maintenanceRequestService.listAll();

    requests.forEach(
      request => {

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

        const day =
          new Date(
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

        }
        else {

          this.dailyRevenue.push({
            date: day,
            total: value
          });

        }

      }
    );

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

=======
    this.message = '';
    const allRequests = this.requestService.listAll ? this.requestService.listAll() : [];

    const start = this.startDate ? new Date(`${this.startDate}T00:00:00`) : null;
    const end = this.endDate ? new Date(`${this.endDate}T23:59:59`) : null;

    this.filteredRequests = allRequests.filter((req: any) => {
        const isPaid =
        req.status === RequestStatus.PAID ||
        req.status === RequestStatus.FINALIZED ||
        req.status === 'PAID' ||
        req.status === 'PAGA' ||
        req.status === 'FINALIZADA';

      if (!isPaid) return false;

      const reqDate = new Date(req.requestDateTime || req.dateTime);

      if (start && reqDate < start) return false;
      if (end && reqDate > end) return false;

      return true;
    });

    this.totalRevenue = this.filteredRequests.reduce((acc, req) => {
      const val = req.value || req.price || 0;
      return acc + Number(val);
    }, 0);

    if (this.filteredRequests.length === 0) {
      this.message = 'Nenhuma receita encontrada para o período selecionado.';
    }
  }

  getClientName(clientId: number): string {
    const client = this.clientService.findById(clientId);
    return client ? client.name : 'Cliente não encontrado';
  }

  getEmployeeName(employeeId?: number): string {
    if (!employeeId) return '-';
    const emp = this.employeeService.findById(employeeId);
    return emp ? emp.name : 'Não atribuído';
  }

  async generatePDF(): Promise<void> {
    const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
      import('jspdf'),
      import('jspdf-autotable'),
    ]);
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Relatório de Receitas', 14, 20);

    doc.setFontSize(10);
    doc.text(`Período: ${this.startDate} até ${this.endDate}`, 14, 28);

       const tableRows = this.filteredRequests.map((req) => [
      new Date(req.requestDateTime || req.dateTime).toLocaleDateString('pt-BR'),
      this.getClientName(req.clientId),
      this.getEmployeeName(req.assignedEmployeeId || req.employeeId),
      req.equipmentDescription || req.description || '-',
      `R$ ${Number(req.value || req.price || 0).toFixed(2)}`,
    ]);

     tableRows.push(['TOTAL', '', '', '', `R$ ${this.totalRevenue.toFixed(2)}`]);

    autoTable(doc, {
      startY: 35,
      head: [['Data', 'Cliente', 'Funcionário', 'Equipamento', 'Valor']],
      body: tableRows,
      theme: 'striped',
      headStyles: { fillColor: [33, 37, 41] },
    });

    doc.save(`relatorio-receitas-${this.startDate}-a-${this.endDate}.pdf`);
  }

  goBack(): void {
    this.router.navigate(['/employee/home']);
  }
>>>>>>> origin/main
}