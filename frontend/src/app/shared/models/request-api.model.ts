import { RequestStatus } from '../enum/request-status.enum';
import { HistoryActions } from '../enum/history-actions.enum';

export interface AddressDTO {
  zipCode: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface ClientDTO {
  clientId: number;
  cpf: string;
  name: string;
  email: string;
  phone: string;
  address: AddressDTO | null;
}

export interface ClientRequestSummaryDTO {
  maintenanceRequestId: number;
  requestDateTime: string;
  equipmentDescription: string;
  status: RequestStatus;
}

export interface EmployeeRequestSummaryDTO {
  maintenanceRequestId: number;
  status: RequestStatus;
  requestDateTime: string;
  clientName: string;
  equipmentDescription: string;
}

export interface QuoteDTO {
  price: number;
  quoteDateTime: string;
  employeeName: string | null;
}

export interface MaintenanceDTO {
  maintenanceDescription: string;
  clientInstructions: string;
  maintenanceDateTime: string;
  employeeName: string | null;
}

export interface PaymentDTO {
  amount: number;
  paymentDateTime: string;
}

export interface RedirectDTO {
  sourceEmployeeName: string | null;
  destinationEmployeeName: string | null;
}

export interface ClientRequestHistoryDTO {
  requestHistoryId: number;
  action: HistoryActions;
  previousStatus: RequestStatus | null;
  newStatus: RequestStatus;
  changeDateTime: string;
  performedByName: string | null;
  rejectionReason: string | null;
}

export interface EmployeeRequestHistoryDTO {
  requestHistoryId: number;
  action: HistoryActions;
  previousStatus: RequestStatus | null;
  newStatus: RequestStatus;
  changeDateTime: string;
  performedByName: string | null;
  redirect: RedirectDTO | null;
  rejectionReason: string | null;
}

export interface ClientRequestDetailsDTO {
  requestId: number;
  equipmentDescription: string;
  defectDescription: string;
  requestDateTime: string;
  status: RequestStatus;
  categoryName: string;
  quote: QuoteDTO | null;
  maintenance: MaintenanceDTO | null;
  payment: PaymentDTO | null;
  history: ClientRequestHistoryDTO[];
}

export interface EmployeeRequestDetailsDTO {
  requestId: number;
  equipmentDescription: string;
  defectDescription: string;
  requestDateTime: string;
  status: RequestStatus;
  categoryName: string;
  client: ClientDTO;
  quote: QuoteDTO | null;
  maintenance: MaintenanceDTO | null;
  payment: PaymentDTO | null;
  history: EmployeeRequestHistoryDTO[];
}

export interface CreateMaintenanceRequestDTO {
  equipmentDescription: string;
  defectDescription: string;
  categoryId: number;
}

export type RequestFilter =
  | 'ABERTAS'
  | 'TODAS'
  | 'HOJE'
  | 'PERIODO';

export interface RevenueDayDTO {
  date: string;
  total: number;
}

export interface RevenueCategoryDTO {
  categoryId: number;
  categoryName: string;
  requestsCount: number;
  total: number;
}

export const STATUS_LABELS: Record<RequestStatus, string> = {
  OPEN: 'ABERTA',
  QUOTED: 'ORÇADA',
  APPROVED: 'APROVADA',
  REJECTED: 'REJEITADA',
  REDIRECTED: 'REDIRECIONADA',
  FIXED: 'ARRUMADA',
  PAID: 'PAGA',
  FINALIZED: 'FINALIZADA'
};

export const ACTION_LABELS: Record<HistoryActions, string> = {
  REQUEST_CREATED: 'Solicitação criada',
  QUOTE_CREATED: 'Orçamento efetuado',
  QUOTE_APPROVED: 'Serviço aprovado',
  QUOTE_REJECTED: 'Serviço rejeitado',
  REQUEST_RESCUED: 'Serviço resgatado',
  MAINTENANCE_REDIRECTED: 'Manutenção redirecionada',
  MAINTENANCE_COMPLETED: 'Manutenção efetuada',
  PAYMENT_CONFIRMED: 'Pagamento confirmado',
  REQUEST_FINALIZED: 'Solicitação finalizada'
};