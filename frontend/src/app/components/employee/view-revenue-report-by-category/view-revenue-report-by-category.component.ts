import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { MaintenanceRequestService } from '../../../services/maintenance-request.service';
import { QuoteService } from '../../../services/quote.service';
import { Category } from '../../../shared/models/category.model';
import { RequestStatus } from '../../../shared/enum/request-status.enum';
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';

@Component({
  selector: 'app-view-revenue-report-by-category',
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
    private categoryService: CategoryService,
    private maintenanceRequestService: MaintenanceRequestService,
    private quoteService: QuoteService
  ) {}

  ngOnInit(): void {
    this.generateReport();
  }

  generateReport(): void {

    this.revenueByCategory = [];
    this.totalRevenue = 0;
    this.message = '';

    this.categoryService.listAll().subscribe({
      next: (response) => {
        if (response.success) {
          this.calculateRevenue(response.data);
        } else {
          this.message = response.message;
        }
      },
      error: (error) => {
        this.message = error.error?.message ?? error.message;
      },
    });
  }

  private calculateRevenue(categories: Category[]): void {
    this.revenueByCategory = [];
    this.totalRevenue = 0;
    this.message = '';

    const requests =
      this.maintenanceRequestService
        .listAll()
        .filter(request =>
          request.status === RequestStatus.PAID ||
          request.status === RequestStatus.FINALIZED
        );

    categories.forEach(category => {

      const categoryRequests =
        requests.filter(
          request =>
            request.categoryId === category.id
        );

      let categoryRevenue = 0;

      categoryRequests.forEach(request => {

        const quote =
          this.quoteService.findByRequestId(
            request.id
          );

        if (quote) {
          categoryRevenue += quote.price;
        }

      });

      this.revenueByCategory.push({
        category: category,
        requestsCount: categoryRequests.length,
        total: categoryRevenue
      });

      this.totalRevenue += categoryRevenue;
    });

    if (this.totalRevenue === 0) {
      this.message =
        'Nenhuma receita encontrada.';
    }
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  printReport(): void {
    if (this.totalRevenue === 0) {
      this.message = 'Não existem receitas para gerar o relatório.';
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