import { Injectable } from '@angular/core';
import { HttpService } from "../../core/services/http.service";
import { LoggerService } from "../../core/services/logger.service";
import { environment } from "src/environments/environment";
import { AppConstants } from "src/app/constants/AppConstants";

@Injectable({
  providedIn: 'root'
})
export class SpotsService {

  /** Variables declarations - START */
  private apiUrl = environment.apiUrl;
  private apiUrlLocal = environment.apiUrlLocal;
  isLocal = environment.isLocal;
  /** Variables declarations - END */

  constructor(private http: HttpService, private logger: LoggerService) { }

  /** Spot APIs START */

  createSpot(spotIn: any) {
    const endPoint = this.apiUrl + AppConstants.SPOT;
    this.logger.log("SpotsService Calling endpoint " + endPoint);
    return this.http.post<any>(endPoint, spotIn);
  }

  getSpot(id: any) {
    let endPoint = this.apiUrl + AppConstants.SPOT + "/" + id;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "spot";
    }
    this.logger.log("SpotsService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  updateSpot(spotIn: any) {
    const endPoint = this.apiUrl + AppConstants.SPOT + "/" + spotIn.id;
    this.logger.log("Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, spotIn);
  }

  deleteSpot(id: any) {
    const endPoint = this.apiUrl + AppConstants.SPOT + "/" + id + '/delete';
    this.logger.log("SpotsService Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, null);
  }

  getSpotList(showId: any) {
    let endPoint = this.apiUrl + AppConstants.SPOT_LIST + "/" + showId;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "spot-list";
    }
    this.logger.log("SpotsService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getSpotTableList(page: any, showId: any) {
    let params = ``;
    if (page) {
      params += `pageNo=${page.pageNumber}&pageSize=${page.size}&sortBy=${page.sortBy}&orderBy=${page.orderBy}`;
      if (page.search) {
        params += `&search=${page.search}`;
      } else {
        params += `&search=`;
      }
    } else {
      params = `search=`;
    }
    let endPoint = this.apiUrl + AppConstants.SPOT_SEARCH + "/" + showId + "?" + params;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "spot-list-table";
    }
    this.logger.log("SpotsService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  inlineEdit(id: any, spotIn: any) {
    const endPoint = this.apiUrl + AppConstants.SPOT_INLINE_EDIT + "/" + id;
    this.logger.log("Calling endpoint " + endPoint);
    return this.http.patch<any>(endPoint, spotIn);
  }

  /** Spot APIs END */
}
