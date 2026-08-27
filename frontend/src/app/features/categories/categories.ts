import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Category } from './category.model';
import { CategoryService } from './category.service';

@Component({
  selector: 'app-categories',
  imports: [FormsModule, RouterLink],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class Categories implements OnInit {
  private readonly categoryService = inject(CategoryService);

  protected readonly categories = signal<Category[]>([]);
  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly error = signal('');
  protected readonly feedback = signal('');

  protected categoryName = '';
  protected editingId: number | null = null;

  ngOnInit(): void {
    this.loadCategories();
  }

  protected submit(): void {
    const name = this.categoryName.trim();
    if (!name) {
      this.error.set('Informe o nome da categoria.');
      return;
    }

    this.saving.set(true);
    this.error.set('');
    this.feedback.set('');

    const request =
      this.editingId === null
        ? this.categoryService.create(name)
        : this.categoryService.update(this.editingId, name);

    request.subscribe({
      next: () => {
        this.feedback.set(
          this.editingId === null
            ? 'Categoria criada com sucesso.'
            : 'Categoria atualizada com sucesso.',
        );
        this.resetForm();
        this.saving.set(false);
        this.loadCategories();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.error.set(this.getErrorMessage(error));
      },
    });
  }

  protected startEdit(category: Category): void {
    this.editingId = category.id;
    this.categoryName = category.nome;
    this.error.set('');
    this.feedback.set('');
  }

  protected cancelEdit(): void {
    this.resetForm();
    this.error.set('');
    this.feedback.set('');
  }

  protected deactivate(category: Category): void {
    if (!window.confirm(`Desativar a categoria “${category.nome}”?`)) {
      return;
    }

    this.error.set('');
    this.categoryService.deactivate(category.id).subscribe({
      next: () => {
        this.feedback.set('Categoria desativada.');
        if (this.editingId === category.id) {
          this.resetForm();
        }
        this.loadCategories();
      },
      error: (error: unknown) => this.error.set(this.getErrorMessage(error)),
    });
  }

  protected activate(category: Category): void {
    this.error.set('');
    this.categoryService.activate(category.id).subscribe({
      next: () => {
        this.feedback.set('Categoria reativada.');
        this.loadCategories();
      },
      error: (error: unknown) => this.error.set(this.getErrorMessage(error)),
    });
  }

  private loadCategories(): void {
    this.loading.set(true);
    this.categoryService.list().subscribe({
      next: (categories) => {
        this.categories.set(categories);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.loading.set(false);
        this.error.set(this.getErrorMessage(error));
      },
    });
  }

  private resetForm(): void {
    this.categoryName = '';
    this.editingId = null;
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const message = error.error?.message;
      if (typeof message === 'string' && message.length > 0) {
        return message;
      }
    }

    return 'Não foi possível concluir a operação. Verifique se a API está disponível.';
  }
}
