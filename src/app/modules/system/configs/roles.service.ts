import { Injectable } from "@angular/core";
import { HttpService } from "../../core/services/http.service";
import { environment } from "src/environments/environment";
import { LoggerService } from "../../core/services/logger.service";
import { AppConstants } from "src/app/constants/AppConstants";

@Injectable({
  providedIn: "root",
})
export class RolesService {
  /** Variables declarations - START */
  private apiUrl = environment.apiUrl;
  /** Variables declarations - END */

  constructor(private http: HttpService, private logger: LoggerService) {}

  /** Role APIs START */
  createRole(roleIn: any) {
    const endPoint = this.apiUrl + AppConstants.ROLE;
    this.logger.log("RolesService Calling endpoint " + endPoint);
    return this.http.post<any>(endPoint, roleIn);
  }

  updateRole(roleIn: any) {
    const endPoint = this.apiUrl + AppConstants.ROLE + "/" + roleIn.id;
    this.logger.log("Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, roleIn);
  }

  deleteRole(id: any) {
    /*const endPoint = this.apiUrl + AppConstants.ROLE + "/" + id;
    this.logger.log("Calling endpoint " + endPoint);
    return this.http.delete<any>(endPoint);*/
    const endPoint = this.apiUrl + AppConstants.ROLE + "/" + id + "/delete";
    this.logger.log("Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, null);
  }

  getRole(id: any) {
    let endPoint = this.apiUrl + AppConstants.ROLE + "/" + id;
    this.logger.log("RolesService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  cloneRole(id: any) {
    let endPoint = this.apiUrl + AppConstants.ROLE + "/clone/" + id;
    this.logger.log("RolesService Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, null);
  }

  getRoles() {
    let endPoint = this.apiUrl + AppConstants.ROLE;
    this.logger.log("RolesService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getRoleList(page) {
    let params = `?search=${page.search}&pageNo=${page.pageNumber}&pageSize=${page.size}&sortBy=${page.sortBy}&orderBy=${page.orderBy}`;
    let endPoint = this.apiUrl + AppConstants.ROLE_LIST + params;
    this.logger.log("RolesService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  /** Role APIs END */

  /** Others APIs START */

  getActionList() {
    let endPoint = this.apiUrl + AppConstants.ACTION_LIST;
    this.logger.log("RolesService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getFunctionalGroup() {
    let endPoint = this.apiUrl + "functionalgroup";
    this.logger.log("RolesService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getPrivilegeInfo(privilegeId) {
    let endPoint = this.apiUrl + "roleprivilege/permissions/" + privilegeId;
    this.logger.log("RolesService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getReportList() {
    let endPoint = this.apiUrl + AppConstants.REPORT_LIST;
    this.logger.log("RolesService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getUsersByRole(roleId) {
    let endPoint = this.apiUrl + AppConstants.USER_LIST_BY_ROLE + "/" + roleId;
    this.logger.log("ShowsService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getUsersByPrivilege(privilegeId) {
    let endPoint =
      this.apiUrl + AppConstants.USER_LIST_BY_PRIVILEGE + "/" + privilegeId;
    this.logger.log("ShowsService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  toggleActivate(id: any) {
    const endPoint =
      this.apiUrl + AppConstants.ROLE + "/" + id + "/toggle-activate";
    this.logger.log("ClientService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  /** Others APIs END */
}
