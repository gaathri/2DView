import { Injectable } from "@angular/core";
import { HttpService } from "../../core/services/http.service";
import { LoggerService } from "../../core/services/logger.service";
import { environment } from "src/environments/environment";
import { AppConstants } from "src/app/constants/AppConstants";

@Injectable({
  providedIn: "root",
})
export class OfficeLocationService {
  /** Variables declarations - START */
  private apiUrl = environment.apiUrl;
  private apiUrlLocal = environment.apiUrlLocal;
  isLocal = environment.isLocal;
  /** Variables declarations - END */

  constructor(private http: HttpService, private logger: LoggerService) {}

  /** OfficeLocation APIs START */

  createOfficeLocation(officeLocationIn: any) {
    const endPoint = this.apiUrl + AppConstants.OFFICE_LOCATION;
    this.logger.log("OfficeLocationService Calling endpoint " + endPoint);
    return this.http.post<any>(endPoint, officeLocationIn);
  }

  getOfficeLocation(id: any) {
    let endPoint = this.apiUrl + AppConstants.OFFICE_LOCATION + "/" + id;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "officeLocation";
    }
    this.logger.log("OfficeLocationService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  updateOfficeLocation(officeLocationIn: any) {
    const endPoint =
      this.apiUrl + AppConstants.OFFICE_LOCATION + "/" + officeLocationIn.id;
    this.logger.log("OfficeLocationService Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, officeLocationIn);
  }

  deleteOfficeLocation(id: any) {
    const endPoint =
      this.apiUrl + AppConstants.OFFICE_LOCATION + "/" + id + "/delete";
    this.logger.log("OfficeLocationService Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, null);
  }

  getOfficeLocationList() {
    let endPoint = this.apiUrl + AppConstants.OFFICE_LOCATION;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "list-officeLocation";
    }
    this.logger.log("OfficeLocationService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getOfficeLocationTableList(page: any) {
    let params = ``;
    if (page) {
      params += `search=${page.search}&pageNo=${page.pageNumber}&pageSize=${page.size}&sortBy=${page.sortBy}&orderBy=${page.orderBy}`;
    }
    let endPoint =
      this.apiUrl + AppConstants.OFFICE_LOCATION_LIST + "/?" + params;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "officeLocation-list-table";
    }
    this.logger.log("OfficeLocationService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  toggleActivate(id: any) {
    const endPoint =
      this.apiUrl +
      AppConstants.OFFICE_LOCATION +
      "/" +
      id +
      "/toggle-activate";
    this.logger.log("OfficeLocationService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  /** OfficeLocation APIs END */
}
