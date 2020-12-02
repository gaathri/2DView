import { Injectable } from "@angular/core";
import { HttpService } from "../../core/services/http.service";
import { LoggerService } from "../../core/services/logger.service";
import { environment } from "src/environments/environment";
import { AppConstants } from "src/app/constants/AppConstants";

@Injectable({
  providedIn: "root",
})
export class SystemSettingsService {
  /** Variables declarations - START */
  private apiUrl = environment.apiUrl;
  private apiUrlLocal = environment.apiUrlLocal;
  isLocal = environment.isLocal;
  /** Variables declarations - END */

  constructor(private http: HttpService, private logger: LoggerService) {}

  getConfig() {
    let endPoint = this.apiUrl + AppConstants.CONFIG;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "config";
    }
    this.logger.log("SystemSettingsService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  addSettings(postObj: any) {
    let endPoint = this.apiUrl + AppConstants.SETTINGS_ADD;
    this.logger.log("SystemSettingsService Calling endpoint " + endPoint);
    return this.http.post<any>(endPoint, postObj);
  }

  getStorageServers() {
    let endPoint = this.apiUrl + AppConstants.SETTINGS + "/get/STORAGE_SERVER";
    this.logger.log("SystemSettingsService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getBackupServers() {
    let endPoint = this.apiUrl + AppConstants.SETTINGS + "/get/BACKUP_SERVER";
    this.logger.log("SystemSettingsService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getPasswordComplexityList() {
    let endPoint = this.apiUrl + "password-complexity/list";
    this.logger.log("SystemSettingsService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }
}
