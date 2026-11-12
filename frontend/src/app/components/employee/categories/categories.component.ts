import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Category } from '../../../shared/models/category.model';
import { CategoryService } from '../../../services/category.service';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-categories',
  imports: [RouterModule, FormsModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit {
  categories = signal<Category[]>([]);
  showModal = false;
  showDeactivateModal = false;
  showOnlyActive = false;
  categoryName = '';
  editingCategory: Category | undefined;
  categoryToDeactivate: Category | undefined;
  message = '';

  constructor(
    private categoryService: CategoryService,
    private loginService: LoginService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (this.loginService.getLoggedUserType() !== 'EMPLOYEE') {
      this.router.navigate(['/login']);
      return;
    }

    this.listAll();
  }

  listAll(): void {
    this.categoryService.listForEmployee().subscribe({
      next: (resposta) => {
        if (resposta.success) {
          this.categories.set(resposta.data);
        }
      },
      error: (err) => console.error('Erro ao buscar categorias:', err),
    });
  }

  get displayedCategories(): Category[] {
    if (this.showOnlyActive) {
      return this.categories().filter((category) => category.active);
    }

    return this.categories();
  }

  toggleActiveFilter(): void {
    this.showOnlyActive = !this.showOnlyActive;
  }

  openCreateModal(): void {
    this.editingCategory = undefined;
    this.categoryName = '';
    this.message = '';
    this.showModal = true;
  }

  openEditModal(category: Category): void {
    this.editingCategory = category;
    this.categoryName = category.name;
    this.message = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingCategory = undefined;
    this.categoryName = '';
    this.message = '';
  }

  save(): void {
    const name = this.categoryName.trim();

    if (!name) {
      this.message = 'Digite o nome da categoria.';
      return;
    }

    const categoryAlreadyExists = this.categories().some(
      (category) =>
        category.id !== this.editingCategory?.id &&
        category.name.trim().toLowerCase() === name.toLowerCase(),
    );

    if (categoryAlreadyExists) {
      this.message = 'Já existe uma categoria com esse nome.';
      return;
    }

    if (this.editingCategory) {
      const categoriaAtualizada = new Category(
        this.editingCategory.id,
        name,
        this.editingCategory.active,
      );

      this.categoryService.update(categoriaAtualizada).subscribe({
        next: (resposta) => {
          if (resposta.success) {
            this.listAll();
            this.closeModal();
          } else {
            this.message = resposta.message;
          }
        },
        error: (err) => {
          this.message = err.error?.message || 'Erro ao atualizar categoria.';
        },
      });
    } else {
      const novaCategoria = new Category(0, name, true);

      this.categoryService.insert(novaCategoria).subscribe({
        next: (resposta) => {
          if (resposta.success) {
            this.listAll();
            this.closeModal();
          } else {
            this.message = resposta.message;
          }
        },
        error: (err) => {
          this.message = err.error?.message || 'Erro ao criar categoria.';
        },
      });
    }
  }

  openDeactivateModal(category: Category): void {
    this.categoryToDeactivate = category;
    this.showDeactivateModal = true;
  }

  closeDeactivateModal(): void {
    this.showDeactivateModal = false;
    this.categoryToDeactivate = undefined;
  }

  confirmDeactivation(): void {
    if (this.categoryToDeactivate) {
      this.categoryService.remove(this.categoryToDeactivate.id).subscribe({
        next: (resposta) => {
          if (resposta.success) {
            this.listAll();
          }
          this.closeDeactivateModal();
        },
        error: (err) => {
          console.error('Erro ao desativar categoria:', err);
          this.closeDeactivateModal();
        },
      });
    } else {
      this.closeDeactivateModal();
    }
  }

  activate(category: Category): void {
    const categoriaAtivada = new Category(category.id, category.name, true);

    this.categoryService.update(categoriaAtivada).subscribe({
      next: (resposta) => {
        if (resposta.success) {
          this.listAll();
        }
      },
      error: (err) => console.error('Erro ao reativar categoria:', err),
    });
  }
}
