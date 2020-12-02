import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpService } from "../core/services/http.service";

@Injectable({
  providedIn: "root",
})
export class HomeService {
  /** Variables declarations - START */
  private apiUrl = environment.apiUrl;
  /** Variables declarations - END */

  constructor(private http: HttpService) {}

  getAddMenu() {
    let endPoint = this.apiUrl + "action/addmenu";
    return this.http.get<any>(endPoint);
  }

  getListMenu() {
    let endPoint = this.apiUrl + "action/menu";
    return this.http.get<any>(endPoint);
  }

  getVersion() {
    let endPoint = this.apiUrl + "session/version";
    return this.http.get<any>(endPoint, { responseType: "text" });
  }

  getWorklogLimit() {
    let endPoint = this.apiUrl + "settings/get/WORKLOG_LIMIT";
    return this.http.get<any>(endPoint);
  }

  getWeekends() {
    let endPoint = this.apiUrl + "settings/weekends";
    return this.http.get<any>(endPoint);
  }

  reportCheck() {
    let endPoint = this.apiUrl + "reportType/list";
    return this.http.get<any>(endPoint);
  }

  getMaxUser() {
    let endPoint = this.apiUrl + "studio/getMaxUser/1";
    return this.http.get<any>(endPoint);
  }

  inlineEdit(studioIn: any) {
    const endPoint = this.apiUrl + "studio/inline-edit/1";
    return this.http.patch<any>(endPoint, studioIn);
  }
}
