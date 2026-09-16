import { Injectable } from '@angular/core';
import { MaintenanceRequest } from '../shared/models/maintenance-request';
import { RequestStatus } from '../shared/enum/request-status.enum';

const LS_KEY = 'maintenance-request';

@Injectable({
  providedIn: 'root'
})

export class MaintenanceRequestService {

  listAll(): MaintenanceRequest[]{
    const requests = localStorage.getItem(LS_KEY);

  if(!requests){
    return [];
  }
  return JSON.parse(requests);
  }

  insert(request: MaintenanceRequest){
    const requests = this.listAll()

    request.id = this.generateId(requests);

    requests.push(request);

    localStorage.setItem(LS_KEY, JSON.stringify(requests));

  }

  findById(id: number): MaintenanceRequest | undefined{
    return this.listAll().find(
      request => request.id === id
    );
  }

  findByClientId(clientId: number):MaintenanceRequest[]{
    return this.listAll().filter(
      request => request.clientId === clientId
    );
  }

  findOpenRequest(): MaintenanceRequest[]{
    return this.listAll().filter(
      request => request.status === RequestStatus.OPEN
    );
  }

  private generateId(requests: MaintenanceRequest[]):number{
    if (requests.length === 0) {
      return 1;
    }

    const highestId = Math.max(
      ...requests.map(request => request.id)
    );

    return highestId + 1;
  }

}

