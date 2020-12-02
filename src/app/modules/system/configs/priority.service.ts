import { Injectable } from '@angular/core';
import { HttpService } from "../../core/services/http.service";
import { LoggerService } from "../../core/services/logger.service";
import { environment } from "src/environments/environment";
import { AppConstants } from "src/app/constants/AppConstants";


@Injectable({
  providedIn: 'root'
})
export class PriorityService {

  /** Variables declarations - START */
  private apiUrl = environment.apiUrl;
  private apiUrlLocal = environment.apiUrlLocal;
  isLocal = environment.isLocal;
  /** Variables declarations - END */

  constructor(private http: HttpService, private logger: LoggerService) { }

  /** Priority APIs START */

  createPriority(priorityIn: any) {
    const endPoint = this.apiUrl + AppConstants.PRIORITY;
    this.logger.log("PriorityService Calling endpoint " + endPoint);
    return this.http.post<any>(endPoint, priorityIn);
  }

  getPriority(id: any) {
    let endPoint = this.apiUrl + AppConstants.PRIORITY + "/" + id;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "priority";
    }
    this.logger.log("PriorityService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  updatePriority(priorityIn: any) {
    const endPoint = this.apiUrl + AppConstants.PRIORITY + "/" + priorityIn.id;
    this.logger.log("PriorityService Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, priorityIn);
  }

  deletePriority(id: any) {
    const endPoint = this.apiUrl + AppConstants.PRIORITY + "/" + id + '/delete';
    this.logger.log("PriorityService Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, null);
  }

  getPriorityList() {
    let endPoint = this.apiUrl + AppConstants.PRIORITY;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "list-task-work-status";
    }
    this.logger.log("PriorityService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getPriorityTableList(page: any) {
    let params = ``;
    if (page) {
      params += `search=${page.search}&pageNo=${page.pageNumber}&pageSize=${page.size}&sortBy=${page.sortBy}&orderBy=${page.orderBy}`;
    }
    let endPoint = this.apiUrl + AppConstants.PRIORITY_SEARCH + "/?" + params;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "priority-list-table";
    }
    this.logger.log("PriorityService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  toggleActivate(id: any) {
    const endPoint = this.apiUrl + AppConstants.PRIORITY + "/" + id + '/toggle-activate';
    this.logger.log("PriorityService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  /** Priority APIs END */
}
