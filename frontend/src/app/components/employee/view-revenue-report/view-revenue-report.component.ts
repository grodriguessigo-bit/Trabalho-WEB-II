import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReportService } from '../../../services/report.service';
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';

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
    private reportService: ReportService
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

    if (this.startDate && this.endDate && this.startDate > this.endDate) {
      this.message = 'A data inicial não pode ser maior que a data final.';
      return;
    }

    this.reportService.getDailyRevenue(this.startDate || undefined, this.endDate || undefined).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const items = response.data.items || [];
          this.dailyRevenue = items.map((item) => {
            const [year, month, day] = item.date.split('-').map(Number);
            return {
              date: new Date(year, month - 1, day),
              total: Number(item.amount),
            };
          });
          this.totalRevenue = Number(response.data.total || 0);

          if (this.dailyRevenue.length === 0) {
            this.message = 'Nenhuma receita encontrada no período informado.';
          }
        } else {
          this.message = response.message || 'Erro ao carregar receitas.';
        }
      },
      error: (error) => {
        this.message = error.error?.message || 'Erro ao comunicar com o servidor.';
      },
    });
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  printReport(): void {
    if (this.dailyRevenue.length === 0) {
      this.message = 'Não existem receitas para gerar o relatório.';
      return;
    }

    let start = 'início dos registros';
    let end = 'última receita registrada';

    if (this.startDate) {
      start = this.startDate.split('-').reverse().join('/');
    }

    if (this.endDate) {
      end = this.endDate.split('-').reverse().join('/');
    }

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Relatório de Receitas por Dia', 14, 16);

    doc.setFontSize(10);
    doc.text('Período: ' + start + ' até ' + end, 14, 25);

    autoTable(doc, {
      html: '#tabela-receitas',
      startY: 32,
      showFoot: 'lastPage'
    });

    doc.save('receitas-por-dia.pdf');
  }
}
