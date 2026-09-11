export enum MaintenanceStatus {
  OPEN = 'OPEN',
  QUOTED = 'QUOTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  IN_MAINTENANCE = 'IN_MAINTENANCE',
  REDIRECTED = 'REDIRECTED',
  FINISHED = 'FINISHED',
  PAID = 'PAID',
}

export const MAINTENANCE_STATUS_LABELS: Record<MaintenanceStatus, string> = {
  [MaintenanceStatus.OPEN]: 'Aberta',

  [MaintenanceStatus.QUOTED]: 'Orçada',

  [MaintenanceStatus.APPROVED]: 'Aprovada',

  [MaintenanceStatus.REJECTED]: 'Rejeitada',

  [MaintenanceStatus.IN_MAINTENANCE]: 'Em manutenção',

  [MaintenanceStatus.REDIRECTED]: 'Redirecionada',

  [MaintenanceStatus.FINISHED]: 'Finalizada',

  [MaintenanceStatus.PAID]: 'Paga',
};

export const MAINTENANCE_STATUS_DESCRIPTIONS: Record<MaintenanceStatus, string> = {
  [MaintenanceStatus.OPEN]: 'Solicitação criada e aguardando atendimento.',

  [MaintenanceStatus.QUOTED]: 'Solicitação que recebeu um orçamento.',

  [MaintenanceStatus.APPROVED]: 'Orçamento aprovado pelo cliente.',

  [MaintenanceStatus.REJECTED]: 'Orçamento rejeitado pelo cliente.',

  [MaintenanceStatus.IN_MAINTENANCE]: 'Equipamento em processo de manutenção.',

  [MaintenanceStatus.REDIRECTED]: 'Solicitação encaminhada para outro responsável.',

  [MaintenanceStatus.FINISHED]: 'Manutenção concluída.',

  [MaintenanceStatus.PAID]: 'Serviço concluído e pago.',
};

export function getMaintenanceStatusLabel(status: MaintenanceStatus): string {
  return MAINTENANCE_STATUS_LABELS[status];
}

export function getMaintenanceStatusDescription(status: MaintenanceStatus): string {
  return MAINTENANCE_STATUS_DESCRIPTIONS[status];
}

export function isMaintenanceFinished(status: MaintenanceStatus): boolean {
  return status === MaintenanceStatus.FINISHED;
}

export function isMaintenancePaid(status: MaintenanceStatus): boolean {
  return status === MaintenanceStatus.PAID;
}
