import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'autocadastro',
    loadComponent: () => import('./pages/autocadastro/autocadastro').then((m) => m.AutocadastroComponent),
  },
  {
    path: 'categorias',
    loadComponent: () => import('./features/categories/categories').then((m) => m.Categories),
  },
];
