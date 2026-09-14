import { Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { RegisterClientComponent } from './components/client/register-client/register-client.component';
import { ClientHomeComponent } from './components/client/client-home/client-home.component';
import { EmployeeHomeComponent } from './components/employee/employee-home/employee-home.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'client/register',
    component: RegisterClientComponent
  },
  {
    path: 'client/home',
    component: ClientHomeComponent
  },
  {
    path: 'employee/home',
    component: EmployeeHomeComponent
  }
];