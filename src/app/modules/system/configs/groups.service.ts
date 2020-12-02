import { Injectable } from '@angular/core';
import { HttpService } from "../../core/services/http.service";
import { LoggerService } from "../../core/services/logger.service";
import { environment } from "src/environments/environment";
import { AppConstants } from "src/app/constants/AppConstants";

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  /** Variables declarations - START */
  private apiUrl = environment.apiUrl;
  private apiUrlLocal = environment.apiUrlLocal;
  isLocal = environment.isLocal;
  /** Variables declarations - END */

  constructor(private http: HttpService, private logger: LoggerService) { }

  /** Group APIs START */

  createGroup(groupIn: any) {
    const endPoint = this.apiUrl + AppConstants.GROUP;
    this.logger.log("GroupsService Calling endpoint " + endPoint);
    return this.http.post<any>(endPoint, groupIn);
  }

  getGroup(id: any) {
    let endPoint = this.apiUrl + AppConstants.GROUP + "/" + id;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "group";
    }
    this.logger.log("GroupsService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  updateGroup(groupIn: any) {
    const endPoint = this.apiUrl + AppConstants.GROUP + "/" + groupIn.id;
    this.logger.log("Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, groupIn);
  }

  deleteGroup(id: any) {
    const endPoint = this.apiUrl + AppConstants.GROUP + "/" + id + '/delete';
    this.logger.log("GroupsService Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, null);
  }

  getGroupList() {
    let endPoint = this.apiUrl + AppConstants.GROUP_LIST;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "group-list";
    }
    this.logger.log("ShowsService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getGroupTableList(page: any) {
    let params = ``;
    if (page) {
      params += `search=${page.search}&pageNo=${page.pageNumber}&pageSize=${page.size}&sortBy=${page.sortBy}&orderBy=${page.orderBy}`;
    }
    let endPoint = this.apiUrl + AppConstants.GROUP_SEARCH + "/?" + params;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "group-list-table";
    }
    this.logger.log("GroupsService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  inlineEdit(id: any, groupIn: any) {
    const endPoint = this.apiUrl + AppConstants.GROUP_INLINE_EDIT + "/" + id;
    this.logger.log("Calling endpoint " + endPoint);
    return this.http.patch<any>(endPoint, groupIn);
  }

  toggleActivate(id: any) {
    const endPoint = this.apiUrl + AppConstants.GROUP + "/" + id + '/toggle-activate';
    this.logger.log("Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  /** Group APIs END */
}
