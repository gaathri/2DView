import { Injectable } from "@angular/core";
import { AppConstants } from "src/app/constants/AppConstants";
import { environment } from "src/environments/environment";
import { HttpService } from "../../core/services/http.service";
import { LoggerService } from "../../core/services/logger.service";

@Injectable({
  providedIn: "root",
})
export class WorklogService {
  /** Variables declarations - START */
  private apiUrl = environment.apiUrl;
  private apiUrlLocal = environment.apiUrlLocal;
  isLocal = environment.isLocal;
  /** Variables declarations - END */

  constructor(private http: HttpService, private logger: LoggerService) {}

  /**Artist Time Sheet - START */

  createWorklog(worklogIn: any) {
    const endPoint = this.apiUrl + AppConstants.WORK_LOG;
    this.logger.log("UsersService Calling endpoint " + endPoint);
    return this.http.post<any>(endPoint, worklogIn);
  }

  getWorklogList(params: any) {
    let endPoint = this.apiUrl + AppConstants.WORK_LOG_LIST + "?" + params;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "work-log-list";
    }
    this.logger.log("UsersService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getWorklog(id: any) {
    let endPoint = this.apiUrl + AppConstants.WORK_LOG + "/" + id;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "work-log";
    }
    this.logger.log("UsersService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  updateWorklog(worklogIn: any) {
    const endPoint = this.apiUrl + AppConstants.WORK_LOG + "/" + worklogIn.id;
    this.logger.log("Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, worklogIn);
  }

  getLogsByDate(date: any, userId: any) {
    let endPoint = this.apiUrl + AppConstants.MY_WORK_LOGS + "?date=" + date;
    if (userId) {
      endPoint = endPoint + "&userId=" + userId;
    }
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "my-work-logs";
    }
    this.logger.log("DaybookService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getTimesheet(month: any, year: any, userId: any) {
    let endPoint =
      this.apiUrl + AppConstants.TIME_SHEET + "/" + month + "/" + year;
    if (userId) {
      endPoint = endPoint + "?artistId=" + userId;
    }
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "time-sheet";
    }
    this.logger.log("DaybookService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  deleteWorklog(id: any) {
    const endPoint = this.apiUrl + AppConstants.WORK_LOG + "/" + id + "/delete";
    this.logger.log("Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, null);
  }

  /**Artist Time Sheet - END */
}
