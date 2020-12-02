import { Injectable } from "@angular/core";
import { AppConstants } from "src/app/constants/AppConstants";
import { environment } from "src/environments/environment";
import { HttpService } from "../../core/services/http.service";
import { LoggerService } from "../../core/services/logger.service";

@Injectable({
  providedIn: "root",
})
export class DaybookService {
  /** Variables declarations - START */
  private apiUrl = environment.apiUrl;
  private apiUrlLocal = environment.apiUrlLocal;
  isLocal = environment.isLocal;
  /** Variables declarations - END */

  constructor(private http: HttpService, private logger: LoggerService) {}

  getShotViewReport(params: any) {
    let endPoint = this.apiUrl + AppConstants.DAYBOOK_SHOT_VIEW + "?" + params;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "daybook-shot-view";
    }
    this.logger.log("DaybookService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getAssetViewReport(params: any) {
    let endPoint = this.apiUrl + AppConstants.DAYBOOK_ASSET_VIEW + "?" + params;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "daybook-asset-view";
    }
    this.logger.log("DaybookService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getUsersettings() {
    let endPoint = this.apiUrl + "usersettings/list/Daybook";
    return this.http.get<any>(endPoint);
  }

  createUsersettings(settingsIn: any) {
    const endPoint = this.apiUrl + "usersettings";
    return this.http.post<any>(endPoint, settingsIn);
  }

  updateUsersettings(settingsId: any, settingsIn: any) {
    const endPoint = this.apiUrl + "usersettings/" + settingsId;
    return this.http.put<any>(endPoint, settingsIn);
  }

  getDaybookColumnList() {
    let endPoint = this.apiUrl + AppConstants.DAYBOOK_COLUMN_LIST;
    return this.http.get<any>(endPoint);
  }
}
