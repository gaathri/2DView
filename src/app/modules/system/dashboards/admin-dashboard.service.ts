import { Injectable } from '@angular/core';
import { HttpService } from "../../core/services/http.service";
import { environment } from "src/environments/environment";
import { LoggerService } from "../../core/services/logger.service";
import { AppConstants } from "src/app/constants/AppConstants";

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {

  /** Variables declarations - START */
  private apiUrl = environment.apiUrl;
  private apiUrlLocal = environment.apiUrlLocal;
  isLocal = environment.isLocal;
  /** Variables declarations - END */

  constructor(private http: HttpService, private logger: LoggerService) { }

  getStudio(id: any) {
    let endPoint = this.apiUrl + AppConstants.STUDIO + "/" + id;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "studio";
    }
    this.logger.log("AdminDashboardService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  updateStudio(studioIn: any) {
    const endPoint = this.apiUrl + AppConstants.STUDIO + "/" + studioIn.id;
    this.logger.log("Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, studioIn);
  }
}
