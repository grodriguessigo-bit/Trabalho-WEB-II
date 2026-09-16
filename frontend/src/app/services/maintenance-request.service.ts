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

    if (!requests) {
      return [];
    }
    return JSON.parse(requests);
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
