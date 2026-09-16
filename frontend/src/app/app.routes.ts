import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterClientComponent } from './components/client/register-client/register-client.component';
import { ClientEquipamentRepairComponent } from './components/client/client-equipament-repair/client-equipament-repair.component';
import { ClientHomeComponent } from './components/client/client-home/client-home.component';
import { EmployeeHomeComponent } from './components/employee/employee-home/employee-home.component';
import { ListEmployeeComponent } from './components/employee/list-employee/list-employee.component';
import { InsertEmployeeComponent } from './components/employee/insert-employee/insert-employee.component';
import { EditEmployeeComponent } from './components/employee/edit-employee/edit-employee.component';
import { ViewRevenueReportByCategoryComponent } from './components/employee/view-revenue-report-by-category/view-revenue-report-by-category.component';
import { ViewRevenueReportComponent } from './components/employee/view-revenue-report/view-revenue-report.component';
import{ BudgetComponent } from './components/employee/budget/budget.component';


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
    path: 'client/equipament-repair',
    component: ClientEquipamentRepairComponent
  },
  {
    path: 'client/home',
    component: ClientHomeComponent
  },

  {
    path: 'employee/home',
    component: EmployeeHomeComponent
  },

  {
    path: 'employee/list',
    component: ListEmployeeComponent
  },

  {
    path: 'employee/insert',
    component: InsertEmployeeComponent
  },

  {
    path: 'employee/edit/:id',
    component: EditEmployeeComponent
  },
  
  {
    path: 'employee/revenue-report',
    component: ViewRevenueReportComponent
  },

  {
    path: 'employee/revenue-report-category',
    component: ViewRevenueReportByCategoryComponent
  },

  {
    path: 'employee/budget/:id',
    component: BudgetComponent
  }

];