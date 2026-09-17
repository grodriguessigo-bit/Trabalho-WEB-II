import { Injectable } from '@angular/core';

export interface RequestItem {
  id: number;
  equipment: string;
  defect: string;
  status: string;
  maintenanceDescription?: string;
  clientGuidelines?: string;
  maintenanceDate?: string;
  employeeId?: number;
  sourceEmployeeId?: number;
  targetEmployeeId?: number;
  client: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class RequestService {

  private requests: RequestItem[] = [
    {
      id: 1,
      equipment: 'Notebook Dell Inspiron',
      defect: 'Não liga após queda de energia',
      status: 'EM ANDAMENTO',
      client: {
        id: 10,
        name: 'Joao Oliveira',
        email: 'joao@email.com',
        phone: '(41) 98888-8888'
      }
    }
  ];

  constructor() {}

  findById(id: number): RequestItem | undefined {
    return this.requests.find(r => r.id === id);
  }

  performMaintenance(id: number, description: string, guidelines: string, employeeId: number): boolean {
    const request = this.findById(id);
    if (request) {
      request.status = 'ARRUMADO';
      request.maintenanceDescription = description;
      request.clientGuidelines = guidelines;
      request.maintenanceDate = new Date().toISOString();
      request.employeeId = employeeId;
      return true;
    }
    return false;
  }

  redirectMaintenance(redirectionData: any): boolean {
    const numericId = typeof redirectionData.requestId === 'string' 
      ? parseInt(redirectionData.requestId, 10) 
      : redirectionData.requestId;
      
    const request = this.findById(numericId);
    if (request) {
      request.status = 'REDIRECIONADA';
      request.sourceEmployeeId = redirectionData.sourceEmployeeId;
      request.targetEmployeeId = redirectionData.targetEmployeeId;
      return true;
    }
    return false;
  }
}