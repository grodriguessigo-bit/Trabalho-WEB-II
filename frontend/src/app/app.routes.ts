import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { RegisterClientComponent } from './components/client/register-client/register-client.component';
import { ClientEquipmentRepairComponent } from './components/client/client-equipment-repair/client-equipment-repair.component';
import { ClientHomeComponent } from './components/client/client-home/client-home.component';
import { QuoteApprovalComponent } from './components/client/quote-approval/quote-approval.component';
import { RequestDetailsComponentComponent } from './components/client/request-details.component/request-details.component.component';
import { PayRequestComponent } from './components/client/pay-request/pay-request.component';
import { EmployeeHomeComponent } from './components/employee/employee-home/employee-home.component';
import { ListEmployeeComponent } from './components/employee/list-employee/list-employee.component';
import { InsertEmployeeComponent } from './components/employee/insert-employee/insert-employee.component';
import { EditEmployeeComponent } from './components/employee/edit-employee/edit-employee.component';
import { ViewRevenueReportByCategoryComponent } from './components/employee/view-revenue-report-by-category/view-revenue-report-by-category.component';
import { ViewRevenueReportComponent } from './components/employee/view-revenue-report/view-revenue-report.component';
import { CategoriesComponent } from './components/employee/categories/categories.component';
import { QuoteFormComponent } from './components/employee/quote-form/quote-form.component';
import { BudgetComponent } from './components/employee/budget/budget.component';
import { PerformMaintenanceComponent } from './components/employee/perform-maintenance/perform-maintenance.component';
import { RedirectMaintenanceComponent } from './components/employee/redirect-maintenance/redirect-maintenance.component';
import { FinalizeRequestComponent } from './components/employee/finalize-request/finalize-request.component';
import { BudgetRejectedComponent } from './components/employee/budget_rejected/budget_rejected.component';

/*
 * Arquitetura planejada para a navegacao principal (sem implementar aqui):
 *
 * Navbar global:
 * - Cliente (loggedUserType === 'CLIENT'):
 *   - Minhas Solicitacoes -> /client/home
 *   - Nova Solicitacao -> /client/equipment-repair
 * - Funcionario (loggedUserType === 'EMPLOYEE'):
 *   - Solicitacoes Abertas -> /employee/home?status=OPEN
 *   - Todas as Solicitacoes -> /employee/home
 *   - Categorias -> /employee/categories
 *   - Funcionarios -> /employee/list
 *   - Relatorio por Periodo -> /employee/revenue-report
 *   - Relatorio por Categoria -> /employee/revenue-report-category
 * - Identificacao do usuario e logout ficam na Navbar global.
 *
 * A Navbar deve ser implementada no componente raiz (App); esta configuracao
 * apenas define as rotas de destino. As rotas abaixo permanecem inalteradas.
 *
 * Separacao de responsabilidades prevista:
 * - App decide se a sessao atual permite mostrar a area de navegacao.
 * - O servico de login fornece o tipo e o identificador da sessao.
 * - Os servicos de cliente e funcionario fornecem o nome para identificacao.
 * - O RouterLink realiza a navegacao sem recarregar a aplicacao.
 * - O RouterOutlet continua exibindo o componente associado a rota atual.
 *
 * Comportamento esperado para sessao:
 * - Sem usuario autenticado, nao exibir links de areas restritas.
 * - Para CLIENT, mostrar somente os atalhos destinados ao cliente.
 * - Para EMPLOYEE, mostrar somente os atalhos destinados ao funcionario.
 * - Ao encerrar sessao, limpar os dados de autenticacao existentes.
 * - Apos o logout, direcionar o usuario para a tela de login.
 * - A identificacao deve acompanhar a sessao atual, nao um nome fixo.
 *
 * Comportamento esperado para navegacao:
 * - Os links devem apontar para rotas existentes nesta configuracao.
 * - Rotas com parametros, como detalhes e orcamentos, continuam sendo abertas
 *   pelas telas de origem que conhecem o identificador da solicitacao.
 * - Links globais devem levar apenas a telas de entrada de cada funcionalidade.
 * - A tela inicial do funcionario pode apresentar todas as solicitacoes.
 * - O filtro de solicitacoes abertas pode ser indicado por query parameter.
 * - A tela inicial do cliente permanece como acesso as suas solicitacoes.
 * - O formulario de reparo permanece separado da lista de solicitacoes.
 *
 * Acesso e autorizacao:
 * - A exibicao de um link nao substitui a protecao de uma rota.
 * - O authGuard continua responsavel por validar o usuario ao acessar a rota.
 * - O campo data.role informa qual perfil pode acessar cada area protegida.
 * - Uma navegacao manual para uma URL tambem deve passar pelo guard.
 * - Rotas publicas, como login e cadastro, nao dependem da Navbar autenticada.
 * - Esta documentacao nao adiciona nem remove guards existentes.
 *
 * Layout responsivo previsto:
 * - Em telas largas, os itens podem ficar dispostos na mesma linha.
 * - Em telas estreitas, os itens devem ser agrupados em menu recolhivel.
 * - O controle do menu deve ter nome acessivel para leitores de tela.
 * - Cada link deve manter um texto compreensivel sem depender apenas do icone.
 * - O nome do usuario e o comando de logout devem permanecer localizaveis.
 *
 * Integracao visual prevista:
 * - Reutilizar Bootstrap 5 ja configurado no projeto.
 * - Reutilizar FontAwesome ja carregado na configuracao de estilos.
 * - Os icones sao complementares e nao substituem os nomes dos links.
 * - A Navbar global nao deve duplicar o conteudo das paginas.
 * - As telas de cliente e funcionario continuam responsaveis por suas tarefas.
 *
 * Esta anotacao descreve uma proposta para uma alteracao futura no App.
 * Nenhum componente, template, estilo ou servico e modificado por este bloco.
 * A tabela routes abaixo continua sendo a unica configuracao executavel aqui.
 */
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
    path: 'client/equipment-repair',
    component: ClientEquipmentRepairComponent,
    canActivate: [authGuard],
    data: {
      role: 'CLIENT'
    }
  },

  {
    path: 'client/home',
    component: ClientHomeComponent,
    canActivate: [authGuard],
    data: {
      role: 'CLIENT'
    }
  },

  {
    path: 'client/request-details/:id',
    component: RequestDetailsComponentComponent,
    canActivate: [authGuard],
    data: {
      role: 'CLIENT'
    }
  },

  {
    path: 'client/quote-approval/:id',
    component: QuoteApprovalComponent,
    canActivate: [authGuard],
    data: {
      role: 'CLIENT'
    }
  },

  {
    path: 'client/pay-request/:id',
    component: PayRequestComponent,
    canActivate: [authGuard],
    data: {
      role: 'CLIENT'
    }
  },

  {
    path: 'employee/home',
    component: EmployeeHomeComponent,
    canActivate: [authGuard],
    data: {
      role: 'EMPLOYEE'
    }
  },

  {
    path: 'employee/list',
    component: ListEmployeeComponent,
    canActivate: [authGuard],
    data: {
      role: 'EMPLOYEE'
    }
  },

  {
    path: 'employee/insert',
    component: InsertEmployeeComponent,
    canActivate: [authGuard],
    data: {
      role: 'EMPLOYEE'
    }
  },

  {
    path: 'employee/edit/:id',
    component: EditEmployeeComponent,
    canActivate: [authGuard],
    data: {
      role: 'EMPLOYEE'
    }
  },

  {
    path: 'employee/revenue-report',
    component: ViewRevenueReportComponent,
    canActivate: [authGuard],
    data: {
      role: 'EMPLOYEE'
    }
  },

  {
    path: 'employee/revenue-report-category',
    component: ViewRevenueReportByCategoryComponent,
    canActivate: [authGuard],
    data: {
      role: 'EMPLOYEE'
    }
  },

  {
    path: 'employee/categories',
    component: CategoriesComponent,
    canActivate: [authGuard],
    data: {
      role: 'EMPLOYEE'
    }
  },

  {
    path: 'employee/quote-form/:id',
    component: QuoteFormComponent,
    canActivate: [authGuard],
    data: {
      role: 'EMPLOYEE'
    }
  },

  {
    path: 'employee/budget/:id',
    component: BudgetComponent,
    canActivate: [authGuard],
    data: {
      role: 'EMPLOYEE'
    }
  },
  {
    path: 'employee/budget-rejected/:id',
    component: BudgetRejectedComponent
  },
  {
    path: 'employee/request/maintenance/:id',
    component: PerformMaintenanceComponent,
    canActivate: [authGuard],
    data: {
      role: 'EMPLOYEE'
    }
  },

  {
    path: 'employee/request/redirect/:id',
    component: RedirectMaintenanceComponent,
    canActivate: [authGuard],
    data: {
      role: 'EMPLOYEE'
    }
  },

  {
    path: 'employee/finalize-request/:id',
    component: FinalizeRequestComponent,
    canActivate: [authGuard],
    data: {
      role: 'EMPLOYEE'
    }
  }

];