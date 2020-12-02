import { Injectable } from '@angular/core';
import { HttpService } from "../../core/services/http.service";
import { LoggerService } from "../../core/services/logger.service";
import { environment } from "src/environments/environment";
import { AppConstants } from "src/app/constants/AppConstants";

@Injectable({
  providedIn: 'root'
})
export class TasktypesService {

  /** Variables declarations - START */
  private apiUrl = environment.apiUrl;
  private apiUrlLocal = environment.apiUrlLocal;
  isLocal = environment.isLocal;
  /** Variables declarations - END */

  constructor(private http: HttpService, private logger: LoggerService) { }

  /** Tasktype APIs START */

  getTasktypes() {
    let endPoint = this.apiUrl + AppConstants.TASKTYPE;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "tasktype";
    }
    this.logger.log("TasktypesService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  createTasktype(tasktypeIn: any) {
    const endPoint = this.apiUrl + AppConstants.TASKTYPE;
    this.logger.log("TasktypesService Calling endpoint " + endPoint);
    return this.http.post<any>(endPoint, tasktypeIn);
  }

  getTasktype(id: any) {
    let endPoint = this.apiUrl + AppConstants.TASKTYPE + "/" + id;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "tasktype";
    }
    this.logger.log("TasktypesService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  updateTasktype(tasktypeIn: any) {
    const endPoint = this.apiUrl + AppConstants.TASKTYPE + "/" + tasktypeIn.id;
    this.logger.log("Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, tasktypeIn);
  }

  deleteTasktype(id: any) {
    const endPoint = this.apiUrl + AppConstants.TASKTYPE + "/" + id + '/delete';
    this.logger.log("TasktypesService Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, null);
  }

  getTasktypeList() {
    let endPoint = this.apiUrl + AppConstants.TASKTYPE_LIST;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "tasktype-list";
    }
    this.logger.log("ShowsService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getTasktypeTableList(page: any) {
    let params = ``;
    if (page) {
      params += `search=${page.search}&pageNo=${page.pageNumber}&pageSize=${page.size}&sortBy=${page.sortBy}&orderBy=${page.orderBy}`;
    }
    let endPoint = this.apiUrl + AppConstants.TASKTYPE_SEARCH + "/?" + params;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "tasktype-list-table";
    }
    this.logger.log("TasktypesService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  inlineEdit(id: any, tasktypeIn: any) {
    const endPoint = this.apiUrl + AppConstants.TASKTYPE_INLINE_EDIT + "/" + id;
    this.logger.log("Calling endpoint " + endPoint);
    return this.http.patch<any>(endPoint, tasktypeIn);
  }

  toggleActivate(id: any) {
    const endPoint = this.apiUrl + AppConstants.TASKTYPE + "/" + id + '/toggle-activate';
    this.logger.log("Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  /** Tasktype APIs END */
}
