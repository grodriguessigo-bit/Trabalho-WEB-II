import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReportService } from '../../../services/report.service';
import { Category } from '../../../shared/models/category.model';
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';

@Component({
  selector: 'app-view-revenue-report-by-category',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './view-revenue-report-by-category.component.html',
  styleUrl: './view-revenue-report-by-category.component.css',
})
export class ViewRevenueReportByCategoryComponent implements OnInit {

  revenueByCategory: {
    category: Category;
    requestsCount: number;
    total: number;
  }[] = [];

  totalRevenue: number = 0;
  message: string = '';

  constructor(
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    this.generateReport();
  }

  generateReport(): void {
    this.revenueByCategory = [];
    this.totalRevenue = 0;
    this.message = '';

    this.reportService.getRevenueByCategory().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const items = response.data.items || [];
          this.revenueByCategory = items.map((item) => ({
            category: new Category(item.categoryId, item.categoryName),
            requestsCount: Number(item.requestsCount),
            total: Number(item.amount),
          }));
          this.totalRevenue = Number(response.data.total || 0);

          if (this.revenueByCategory.length === 0) {
            this.message = 'Nenhuma categoria cadastrada.';
          }
        } else {
          this.message = response.message || 'Erro ao carregar receitas por categoria.';
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
    if (this.totalRevenue === 0 && this.revenueByCategory.length === 0) {
      this.message = 'Não existem dados para gerar o relatório.';
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Relatório de Receitas por Categoria', 14, 16);

    doc.setFontSize(10);
    doc.text('Receitas de todo o período, agrupadas por categoria.', 14, 25);

    autoTable(doc, {
      html: '#tabela-receitas-categoria',
      startY: 32,
      showFoot: 'lastPage'
    });

    doc.save('receitas-por-categoria.pdf');
  }
}
