import { RequestHistory } from './request-history.model';
import { RequestStatus } from '../enum/request-status.enum';

export class MaintenanceRequest {
  constructor(
    public id: number = 0,
    public clientId: number = 0,
    public categoryId: number = 0,
    public equipmentDescription: string = '',
    public defectDescription: string = '',
    public requestDateTime: string = '',
    public status: RequestStatus = RequestStatus.OPEN,
    public requestHistory: RequestHistory[] = [],
  ) {}
}
