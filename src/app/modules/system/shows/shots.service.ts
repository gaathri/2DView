import { Injectable } from "@angular/core";
import { HttpService } from "../../core/services/http.service";
import { LoggerService } from "../../core/services/logger.service";
import { environment } from "src/environments/environment";
import { AppConstants } from "src/app/constants/AppConstants";

@Injectable({
  providedIn: "root",
})
export class ShotsService {
  /** Variables declarations - START */
  private apiUrl = environment.apiUrl;
  private apiUrlLocal = environment.apiUrlLocal;
  isLocal = environment.isLocal;
  /** Variables declarations - END */

  constructor(private http: HttpService, private logger: LoggerService) {}

  getShotsByView(viewType: any, params: any) {
    let endPoint =
      this.apiUrl +
      AppConstants.SHOT_LIST +
      "/filter/" +
      viewType +
      "?" +
      params;
    this.logger.log("ShowsService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getShotsByShowId(showId: any) {
    let endPoint = this.apiUrl + AppConstants.SHOT_LIST + "/" + showId;
    this.logger.log("ShotsService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getDaybookShots(showId: any) {
    let endPoint = this.apiUrl + "shot/list-shots";
    if (showId) {
      endPoint = endPoint + "?showId=" + showId;
    }

    return this.http.get<any>(endPoint);
  }

  getLinkedShotList(showId: any) {
    let endPoint = this.apiUrl + AppConstants.SHOT_LIST + "/" + showId;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "shot-list";
    }
    this.logger.log("ShowsService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getSubShotList(showId: any) {
    let endPoint = this.apiUrl + AppConstants.SHOT_LIST + "/" + showId;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "shot-list";
    }
    this.logger.log("ShowsService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getParentShotList(showId: any) {
    let endPoint = this.apiUrl + AppConstants.SHOT_LIST + "/" + showId;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "shot-list";
    }
    this.logger.log("ShowsService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getFavoriteShotsByArtist(page: any) {
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
    let endPoint =
      this.apiUrl + AppConstants.SHOT + "/favorite-by-artist?" + params;
    this.logger.log("ShotsService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  likeShot(likeIn: any) {
    const endPoint = this.apiUrl + AppConstants.FAVORITE;
    this.logger.log("ShotsService Calling endpoint " + endPoint);
    return this.http.post<any>(endPoint, likeIn);
  }

  dislikeShot(id: any) {
    const endPoint = this.apiUrl + AppConstants.REMOVE_FAVORITE + "/Shot/" + id;
    this.logger.log("ShotsService Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, null);
  }

  getShotsByArist(id: any) {
    let endPoint = this.apiUrl + AppConstants.SHOT + "/list-by-arist/" + id;
    this.logger.log("ShotsService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  bulkUpdate(bulkIn: any) {
    console.log(bulkIn);
    let endPoint = this.apiUrl + AppConstants.SHOT + "/bulk-update";
    this.logger.log("ShotsService Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, bulkIn);
  }

  createUsersettings(settingsIn: any) {
    const endPoint = this.apiUrl + "usersettings";
    this.logger.log("ShotsService Calling endpoint " + endPoint);
    return this.http.post<any>(endPoint, settingsIn);
  }

  updateUsersettings(settingsId: any, settingsIn: any) {
    const endPoint = this.apiUrl + "usersettings/" + settingsId;
    this.logger.log("ShotsService Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, settingsIn);
  }

  getUsersettings() {
    let endPoint = this.apiUrl + "usersettings/list/Shot";
    this.logger.log("ShotsService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }
}
