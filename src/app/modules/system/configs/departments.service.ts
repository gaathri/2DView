import { Injectable } from "@angular/core";
import { HttpService } from "../../core/services/http.service";

import { environment } from "src/environments/environment";
import { AppConstants } from "src/app/constants/AppConstants";

@Injectable({
  providedIn: "root",
})
export class DepartmentsService {
  /** Variables declarations - START */
  private apiUrl = environment.apiUrl;

  /** Variables declarations - END */

  constructor(private http: HttpService) {}

  /** Department APIs START */

  createDepartment(departmentIn: any) {
    const endPoint = this.apiUrl + AppConstants.DEPARTMENT;

    return this.http.post<any>(endPoint, departmentIn);
  }

  getDepartment(id: any) {
    let endPoint = this.apiUrl + AppConstants.DEPARTMENT + "/" + id;

    return this.http.get<any>(endPoint);
  }

  updateDepartment(departmentIn: any) {
    const endPoint =
      this.apiUrl + AppConstants.DEPARTMENT + "/" + departmentIn.id;

    return this.http.put<any>(endPoint, departmentIn);
  }

  deleteDepartment(id: any) {
    const endPoint =
      this.apiUrl + AppConstants.DEPARTMENT + "/" + id + "/delete";
    return this.http.put<any>(endPoint, null);
  }

  getDepartmentTableList(page: any) {
    let params = ``;
    if (page) {
      params += `search=${page.search}&pageNo=${page.pageNumber}&pageSize=${page.size}&sortBy=${page.sortBy}&orderBy=${page.orderBy}`;
    }
    let endPoint = this.apiUrl + AppConstants.DEPARTMENT_SEARCH + "/?" + params;

    return this.http.get<any>(endPoint);
  }

  getDepartmentList() {
    let endPoint = this.apiUrl + AppConstants.DEPARTMENT_LIST;

    return this.http.get<any>(endPoint);
  }

  getDepartmentListSearch() {
    let endPoint =
      this.apiUrl + AppConstants.DEPARTMENT_LIST_SEARCH + "?search=";

    return this.http.get<any>(endPoint);
  }

  inlineEdit(id: any, groupIn: any) {
    const endPoint =
      this.apiUrl + AppConstants.DEPARTMENT_INLINE_EDIT + "/" + id;

    return this.http.patch<any>(endPoint, groupIn);
  }

  toggleActivate(id: any) {
    const endPoint =
      this.apiUrl + AppConstants.DEPARTMENT + "/" + id + "/toggle-activate";

    return this.http.get<any>(endPoint);
  }

  /** Department APIs END */
}
