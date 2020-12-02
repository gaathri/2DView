import { Injectable } from '@angular/core';
import { HttpService } from "../../core/services/http.service";
import { LoggerService } from "../../core/services/logger.service";
import { environment } from "src/environments/environment";
import { AppConstants } from "src/app/constants/AppConstants";


@Injectable({
  providedIn: 'root'
})
export class SeasonsService {

  /** Variables declarations - START */
  private apiUrl = environment.apiUrl;
  private apiUrlLocal = environment.apiUrlLocal;
  isLocal = environment.isLocal;
  /** Variables declarations - END */

  constructor(private http: HttpService, private logger: LoggerService) { }

  /** Season APIs START */

  createSeason(seasonIn: any) {
    const endPoint = this.apiUrl + AppConstants.SEASON;
    this.logger.log("SeasonsService Calling endpoint " + endPoint);
    return this.http.post<any>(endPoint, seasonIn);
  }

  getSeason(id: any) {
    let endPoint = this.apiUrl + AppConstants.SEASON + "/" + id;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "season";
    }
    this.logger.log("SeasonsService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  updateSeason(seasonIn: any) {
    const endPoint = this.apiUrl + AppConstants.SEASON + "/" + seasonIn.id;
    this.logger.log("Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, seasonIn);
  }

  deleteSeason(id: any) {
    const endPoint = this.apiUrl + AppConstants.SEASON + "/" + id + '/delete';
    this.logger.log("SeasonsService Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, null);
  }

  getSeasonList(showId: any) {
    let endPoint = this.apiUrl + AppConstants.SEASON_LIST + "/" + showId;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "season-list";
    }
    this.logger.log("SeasonsService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getSeasonTableList(page: any, showId: any) {
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
    let endPoint = this.apiUrl + AppConstants.SEASON_SEARCH + "/" + showId + "?" + params;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "season-list-table";
    }
    this.logger.log("SeasonsService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  inlineEdit(id: any, seasonIn: any) {
    const endPoint = this.apiUrl + AppConstants.SEASON_INLINE_EDIT + "/" + id;
    this.logger.log("Calling endpoint " + endPoint);
    return this.http.patch<any>(endPoint, seasonIn);
  }

  /** Season APIs END */

}
