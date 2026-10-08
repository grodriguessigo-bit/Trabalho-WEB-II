import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { MaintenanceRequestService } from '../../../services/maintenance-request.service';
import { ClientService } from '../../../services/client.service';
import { EmployeeService } from '../../../services/employee.service';
import { RequestStatus } from '../../../shared/enum/request-status.enum';

@Component({
  selector: 'app-view-revenue-report',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './view-revenue-report.component.html',
  styleUrl: './view-revenue-report.component.css',
})
export class ViewRevenueReportComponent implements OnInit {
  startDate: string = '';
  endDate: string = '';
  filteredRequests: any[] = [];
  totalRevenue: number = 0;
  message: string = '';

  constructor(
    private requestService: MaintenanceRequestService,
    private clientService: ClientService,
    private employeeService: EmployeeService,
    private router: Router
  ) {}
ngOnInit(): void {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

    this.startDate = firstDay.toISOString().split('T')[0];
    this.endDate = now.toISOString().split('T')[0];

    this.filterReport();
  }

  filterReport(): void {
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

  generatePDF(): void {
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
}