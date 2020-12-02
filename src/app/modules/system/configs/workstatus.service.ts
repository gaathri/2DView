import { Injectable } from "@angular/core";
import { HttpService } from "../../core/services/http.service";
import { LoggerService } from "../../core/services/logger.service";
import { environment } from "src/environments/environment";
import { AppConstants } from "src/app/constants/AppConstants";

@Injectable({
  providedIn: "root",
})
export class WorkstatusService {
  /** Variables declarations - START */
  private apiUrl = environment.apiUrl;
  private apiUrlLocal = environment.apiUrlLocal;
  isLocal = environment.isLocal;
  /** Variables declarations - END */

  constructor(private http: HttpService, private logger: LoggerService) {}

  /** Workstatus APIs START */

  createWorkstatus(workstatusIn: any) {
    const endPoint = this.apiUrl + AppConstants.WORKSTATUS;
    this.logger.log("WorkstatusService Calling endpoint " + endPoint);
    return this.http.post<any>(endPoint, workstatusIn);
  }

  getWorkstatus(id: any) {
    let endPoint = this.apiUrl + AppConstants.WORKSTATUS + "/" + id;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "workstatus";
    }
    this.logger.log("WorkstatusService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  updateWorkstatus(workstatusIn: any) {
    const endPoint =
      this.apiUrl + AppConstants.WORKSTATUS + "/" + workstatusIn.id;
    this.logger.log("WorkstatusService Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, workstatusIn);
  }

  deleteWorkstatus(id: any) {
    const endPoint =
      this.apiUrl + AppConstants.WORKSTATUS + "/" + id + "/delete";
    this.logger.log("WorkstatusService Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, null);
  }

  getWorkstatusList() {
    let endPoint = this.apiUrl + AppConstants.WORKSTATUS;
    this.logger.log("WorkstatusService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getWorkstatusByRole() {
    let endPoint = this.apiUrl + AppConstants.WORKSTATUS + "/list-by-role";
    this.logger.log("WorkstatusService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getKanbanWorkstatus() {
    let endPoint = this.apiUrl + AppConstants.WORKSTATUS + "/list-kanban";
    this.logger.log("WorkstatusService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getWorkstatusTableList(page: any) {
    let params = ``;
    if (page) {
      params += `search=${page.search}&pageNo=${page.pageNumber}&pageSize=${page.size}&sortBy=${page.sortBy}&orderBy=${page.orderBy}`;
    }
    let endPoint = this.apiUrl + AppConstants.WORKSTATUS_SEARCH + "/?" + params;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "workstatus-list-table";
    }
    this.logger.log("WorkstatusService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  toggleActivate(id: any) {
    const endPoint =
      this.apiUrl + AppConstants.WORKSTATUS + "/" + id + "/toggle-activate";
    this.logger.log("WorkstatusService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  /** Workstatus APIs END */
}
