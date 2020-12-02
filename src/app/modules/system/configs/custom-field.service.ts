import { Injectable } from "@angular/core";
import { HttpService } from "../../core/services/http.service";
import { environment } from "src/environments/environment";
import { AppConstants } from "src/app/constants/AppConstants";

@Injectable({
  providedIn: "root",
})
export class CustomFieldService {
  /** Variables declarations - START */
  private apiUrl = environment.apiUrl;
  /** Variables declarations - END */

  constructor(private http: HttpService) {}

  /** CustomField APIs START */

  createCustomField(customFieldIn: any) {
    const endPoint = this.apiUrl + AppConstants.CUSTOM_FIELD;

    return this.http.post<any>(endPoint, customFieldIn);
  }

  getCustomField(id: any) {
    let endPoint = this.apiUrl + AppConstants.CUSTOM_FIELD + "/" + id;

    return this.http.get<any>(endPoint);
  }

  updateCustomField(customFieldIn: any) {
    const endPoint =
      this.apiUrl + AppConstants.CUSTOM_FIELD + "/" + customFieldIn.id;

    return this.http.put<any>(endPoint, customFieldIn);
  }

  deleteCustomField(id: any) {
    const endPoint =
      this.apiUrl + AppConstants.CUSTOM_FIELD + "/" + id + "/delete";

    return this.http.put<any>(endPoint, null);
  }

  getCustomFieldTableList(page: any) {
    let params = ``;
    if (page) {
      params += `search=${page.search}&pageNo=${page.pageNumber}&pageSize=${page.size}&sortBy=${page.sortBy}&orderBy=${page.orderBy}`;
    }
    let endPoint = this.apiUrl + AppConstants.CUSTOM_FIELD_LIST + "/?" + params;

    return this.http.get<any>(endPoint);
  }

  toggleActivate(id: any) {
    const endPoint =
      this.apiUrl + AppConstants.CUSTOM_FIELD + "/" + id + "/toggle-activate";

    return this.http.get<any>(endPoint);
  }

  getCustomfieldsByEntityId(entityId: any, level: any) {
    let endPoint =
      this.apiUrl +
      AppConstants.CUSTOM_FIELD_LIST +
      "/" +
      entityId +
      "?level=" +
      level;

    return this.http.get<any>(endPoint);
  }

  /** CustomField APIs END */
}
