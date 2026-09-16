import { Injectable } from '@angular/core';
import { MaintenanceRequest } from '../shared/models/maintenance-request';
import { RequestStatus } from '../shared/enum/request-status.enum';
import { RequestHistory } from '../shared/models/request-history.model';
import { HistoryActions } from '../shared/enum/history-actions.enum';

const LS_KEY = 'maintenance-request';

@Injectable({
  providedIn: 'root',
})
export class MaintenanceRequestService {
  listAll(): MaintenanceRequest[] {
    const requests = localStorage.getItem(LS_KEY);

    // if (!requests) {
    //   return [];
    // }

    //tirar isso aqui de dentro do if depois e tirar o comentario do de cima
    if(requests){
      return JSON.parse(requests);
    }

    return [
      new MaintenanceRequest(
        1,
        1,
        3,
        'Notebook Dell',
        'Não liga',
        '2026-09-10T10:00:00',
        RequestStatus.OPEN,
        [],
      ),

      new MaintenanceRequest(
        2,
        1,
        2,
        'Tablet Samsung',
        'Tela quebrada',
        '2026-09-11T14:30:00',
        RequestStatus.REJECTED,
        [],
      ),

      new MaintenanceRequest(
        3,
        1,
        4,
        'Computador Gamer',
        'Desliga sozinho',
        '2026-09-12T09:15:00',
        RequestStatus.APPROVED,
        [],
      ),

      new MaintenanceRequest(
        4,
        1,
        1,
        'Celular Motorola',
        'Não carrega',
        '2026-09-13T17:40:00',
        RequestStatus.FIXED,
        [],
      ),

      new MaintenanceRequest(
        5,
        1,
        3,
        'Notebook Lenovo',
        'Teclado falhando',
        '2026-09-14T11:20:00',
        RequestStatus.QUOTED,
        [],
      ),
    ];
  }

  insert(request: MaintenanceRequest) {
    const requests = this.listAll();

    request.id = this.generateId(requests);

    requests.push(request);

    this.saveAll(requests);
  }

  update(request: MaintenanceRequest) {
    const requests = this.listAll();
    const index = requests.findIndex(
      item => item.id === request.id
    );

    if (index !== -1) {
      requests[index] = request;

      this.saveAll(requests);
    }
  }

  findById(id: number): MaintenanceRequest | undefined {
    return this.listAll().find((request) => request.id === id);
  }

  findByClientId(clientId: number): MaintenanceRequest[] {
    return this.listAll()
      .filter((request) => request.clientId === clientId)
      .sort(
        (a, b) => new Date(a.requestDateTime).getTime() - new Date(b.requestDateTime).getTime(),
      );
  }

  findOpenRequest(): MaintenanceRequest[] {
    return this.listAll().filter((request) => request.status === RequestStatus.OPEN);
  }

  rescueRequest(requestId: number): boolean {
    const requests = this.listAll();

    const request = requests.find((request) => request.id === requestId);

    if (!request) {
      return false;
    }

    if (request.status !== RequestStatus.REJECTED) {
      return false;
    }

    const previousStatus = request.status;
    const changeDateTime = new Date().toISOString();

    request.status = RequestStatus.APPROVED;

    const history = new RequestHistory(
      request.requestHistory.length + 1,
      HistoryActions.REQUEST_RESCUED,
      previousStatus,
      RequestStatus.APPROVED,
      changeDateTime,
      'Maintenance request rescued',
    );

    request.requestHistory.push(history);

    this.saveAll(requests);

    return true;
  }

  private saveAll(requests: MaintenanceRequest[]): void {
    localStorage.setItem(LS_KEY, JSON.stringify(requests));
  }

  private generateId(requests: MaintenanceRequest[]): number {
    if (requests.length === 0) {
      return 1;
    }

    const highestId = Math.max(...requests.map((request) => request.id));

    return highestId + 1;
  }
}
