import { HistoryActions } from '../enum/history-actions.enum';
import { RequestStatus } from '../enum/request-status.enum';

export class RequestHistory {
  constructor(
    public id: number = 0,
    public action: HistoryActions = HistoryActions.REQUEST_CREATED,
    public previousStatus: RequestStatus | null = null,
    public newStatus: RequestStatus = RequestStatus.OPEN,
    public changeDateTime: string = '',
    public description: string = '',
    public performedByName: string = '',
  ) {}
}
