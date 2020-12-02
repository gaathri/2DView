import { Injectable } from "@angular/core";
import { HttpService } from "../../core/services/http.service";
import { environment } from "src/environments/environment";
import { LoggerService } from "../../core/services/logger.service";
import { AppConstants } from "src/app/constants/AppConstants";

@Injectable({
  providedIn: "root",
})
export class ArtistDashboardService {
  /** Variables declarations - START */
  private apiUrl = environment.apiUrl;
  private apiUrlLocal = environment.apiUrlLocal;
  isLocal = environment.isLocal;
  /** Variables declarations - END */

  constructor(private http: HttpService, private logger: LoggerService) {}

  getOverallTaskProgress() {
    let endPoint = this.apiUrl + AppConstants.ARTIST_OVERALL_TASK_PROGRESS;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "overall-task-progress";
    }
    this.logger.log("ArtistDashboardService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getActivityLogs(page: any) {
    let params = ``;
    if (page) {
      params += `pageNo=${page.pageNumber}&pageSize=${page.size}`;
    }
    let endPoint =
      this.apiUrl + AppConstants.ARTIST_ACTIVITY_LOGS + "/?" + params;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "activity-logs";
    }
    this.logger.log("ArtistDashboardService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getStorageSpace() {
    let endPoint = this.apiUrl + AppConstants.ARTIST_STORAGE_SPACE;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "storage-space";
    }
    this.logger.log("ArtistDashboardService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getTaskProgressByShot(shotId: any) {
    let endPoint =
      this.apiUrl + AppConstants.ARTIST_TASK_PROGRESS_BY_SHOT + "/" + shotId;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "task-progress-by-shot";
    }
    this.logger.log("ArtistDashboardService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getStarShots() {
    let endPoint = this.apiUrl + AppConstants.ARTIST_STAR_SHOTS;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "star-shots";
    }
    this.logger.log("ArtistDashboardService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getFavoriteShots() {
    let endPoint = this.apiUrl + AppConstants.ARTIST_FAVORITE_SHOTS;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "favorite-shots";
    }
    this.logger.log("ArtistDashboardService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  addShotToStarList(shotId: any) {
    let endPoint =
      this.apiUrl + AppConstants.ARTIST_SHOT_ADD_STAR + "/" + shotId;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "shot-add-start";
    }
    this.logger.log("ArtistDashboardService Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, null);
  }

  removeShotFromStarList(shotId: any) {
    let endPoint =
      this.apiUrl + AppConstants.ARTIST_SHOT_REMOVE_STAR + "/" + shotId;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "shot-remove-start";
    }
    this.logger.log("ArtistDashboardService Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, null);
  }

  getKanbanUserSettings() {
    let endPoint = this.apiUrl + "usersettings/list/Kanban";
    this.logger.log("ArtistDashboardService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getUsersettings() {
    let endPoint = this.apiUrl + "usersettings/list/Dashboard";
    this.logger.log("ArtistDashboardService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  createUsersettings(settingsIn: any) {
    const endPoint = this.apiUrl + "usersettings";
    this.logger.log("ArtistDashboardService Calling endpoint " + endPoint);
    return this.http.post<any>(endPoint, settingsIn);
  }

  updateUsersettings(settingsId: any, settingsIn: any) {
    const endPoint = this.apiUrl + "usersettings/" + settingsId;
    this.logger.log("ArtistDashboardService Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, settingsIn);
  }
}
