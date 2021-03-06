import { Injectable } from "@angular/core";
import { HttpService } from "../../core/services/http.service";
import { LoggerService } from "../../core/services/logger.service";
import { environment } from "src/environments/environment";
import { AppConstants } from "src/app/constants/AppConstants";

@Injectable({
  providedIn: "root",
})
export class StatusService {
  /** Variables declarations - START */
  private apiUrl = environment.apiUrl;
  private apiUrlLocal = environment.apiUrlLocal;
  isLocal = environment.isLocal;
  /** Variables declarations - END */

  constructor(private http: HttpService, private logger: LoggerService) {}

  /** Status APIs START */

  createStatus(statusIn: any) {
    const endPoint = this.apiUrl + AppConstants.STATUS;
    this.logger.log("StatusService Calling endpoint " + endPoint);
    return this.http.post<any>(endPoint, statusIn);
  }

  getStatus(id: any) {
    let endPoint = this.apiUrl + AppConstants.STATUS + "/" + id;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "status";
    }
    this.logger.log("StatusService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  updateStatus(statusIn: any) {
    const endPoint = this.apiUrl + AppConstants.STATUS + "/" + statusIn.id;
    this.logger.log("StatusService Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, statusIn);
  }

  deleteStatus(id: any) {
    const endPoint = this.apiUrl + AppConstants.STATUS + "/" + id + "/delete";
    this.logger.log("StatusService Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, null);
  }

  getStatusList() {
    let endPoint = this.apiUrl + AppConstants.STATUS;
    this.logger.log("StatusService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getStatusByRole() {
    let endPoint = this.apiUrl + AppConstants.STATUS + "/list-by-role";
    this.logger.log("StatusService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getKanbanStatus() {
    let endPoint = this.apiUrl + AppConstants.STATUS + "/list-kanban";
    this.logger.log("StatusService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getStatusTableList(page: any) {
    let params = ``;
    if (page) {
      params += `search=${page.search}&pageNo=${page.pageNumber}&pageSize=${page.size}&sortBy=${page.sortBy}&orderBy=${page.orderBy}`;
    }
    let endPoint = this.apiUrl + AppConstants.STATUS_SEARCH + "/?" + params;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "status-list-table";
    }
    this.logger.log("StatusService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  toggleActivate(id: any) {
    const endPoint =
      this.apiUrl + AppConstants.STATUS + "/" + id + "/toggle-activate";
    this.logger.log("StatusService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  /** Status APIs END */
}
