import { Injectable } from "@angular/core";
import { HttpService } from "../../core/services/http.service";
import { environment } from "src/environments/environment";
import { LoggerService } from "../../core/services/logger.service";
import { AppConstants } from "src/app/constants/AppConstants";

@Injectable({
  providedIn: "root",
})
export class StudioDashboardService {
  /** Variables declarations - START */
  private apiUrl = environment.apiUrl;
  private apiUrlLocal = environment.apiUrlLocal;
  isLocal = environment.isLocal;
  /** Variables declarations - END */

  constructor(private http: HttpService, private logger: LoggerService) {}

  getManpowerDetails() {
    let endPoint = this.apiUrl + AppConstants.STUDIO_MANPOWER;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "studio-manpower";
    }
    this.logger.log("StudioDashboardService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getArtistAvailability() {
    let endPoint = this.apiUrl + AppConstants.STUDIO_ARTIST_AVAILABILITY;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "artist-availability";
    }
    this.logger.log("StudioDashboardService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getOverallShotProgress() {
    let endPoint = this.apiUrl + AppConstants.STUDIO_OVERALL_SHOT_PROGRESS;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "overall-shot-progress";
    }
    this.logger.log("StudioDashboardService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getOverallAssetProgress() {
    let endPoint = this.apiUrl + AppConstants.STUDIO_OVERALL_ASSET_PROGRESS;
    return this.http.get<any>(endPoint);
  }
  getOverallTaskProgress() {
    let endPoint = this.apiUrl + AppConstants.STUDIO_OVERALL_TASK_PROGRESS;
    return this.http.get<any>(endPoint);
  }

  getActivityLogs(page: any) {
    let params = ``;
    if (page) {
      params += `pageNo=${page.pageNumber}&pageSize=${page.size}`;
    }
    let endPoint =
      this.apiUrl + AppConstants.STUDIO_ACTIVITY_LOGS + "/?" + params;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "activity-logs";
    }
    this.logger.log("StudioDashboardService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }
  getStarShows() {
    let endPoint = this.apiUrl + AppConstants.STUDIO_STAR_SHOWS;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "star-shows";
    }
    this.logger.log("StudioDashboardService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getStarSupervisors() {
    let endPoint = this.apiUrl + AppConstants.STUDIO_STAR_SUPERVISORS;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "star-supervisors";
    }
    this.logger.log("StudioDashboardService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getFavoriteShows() {
    let endPoint = this.apiUrl + AppConstants.STUDIO_FAVORITE_SHOWS;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "favorite-shows";
    }
    this.logger.log("StudioDashboardService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getFavoriteSupervisors() {
    let endPoint = this.apiUrl + AppConstants.STUDIO_FAVORITE_SUPERVISORS;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "favorite-supervisors";
    }
    this.logger.log("StudioDashboardService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getShotProgressByShow(showId: any) {
    let endPoint =
      this.apiUrl + AppConstants.STUDIO_SHOT_PROGRESS_BY_SHOW + "/" + showId;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "shot-progress-by-show";
    }
    this.logger.log("StudioDashboardService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getShotProgressBySupervisor(id: any) {
    let endPoint =
      this.apiUrl + AppConstants.STUDIO_SHOT_PROGRESS_BY_SUPERVISOR + "/" + id;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "shot-progress-by-supervisor";
    }
    this.logger.log("StudioDashboardService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  addShowToStarList(showId: any) {
    let endPoint =
      this.apiUrl + AppConstants.STUDIO_SHOW_ADD_STAR + "/" + showId;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "show-add-star";
    }
    this.logger.log("StudioDashboardService Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, null);
  }

  addSupervisorToStarList(id: any) {
    let endPoint =
      this.apiUrl + AppConstants.STUDIO_SUPERVISOR_ADD_STAR + "/" + id;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "show-add-star";
    }
    this.logger.log("StudioDashboardService Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, null);
  }

  removeShowFromStarList(showId: any) {
    let endPoint =
      this.apiUrl + AppConstants.STUDIO_SHOW_REMOVE_STAR + "/" + showId;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "show-remove-star";
    }
    this.logger.log("StudioDashboardService Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, null);
  }

  removeSupervisorFromStarList(id: any) {
    let endPoint =
      this.apiUrl + AppConstants.STUDIO_SUPERVISOR_REMOVE_STAR + "/" + id;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "supervisor-remove-star";
    }
    this.logger.log("StudioDashboardService Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, null);
  }

  getUsersettings() {
    let endPoint = this.apiUrl + "usersettings/list/Dashboard";
    this.logger.log("StudioDashboardService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  createUsersettings(settingsIn: any) {
    const endPoint = this.apiUrl + "usersettings";
    this.logger.log("StudioDashboardService Calling endpoint " + endPoint);
    return this.http.post<any>(endPoint, settingsIn);
  }

  updateUsersettings(settingsId: any, settingsIn: any) {
    const endPoint = this.apiUrl + "usersettings/" + settingsId;
    this.logger.log("StudioDashboardService Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, settingsIn);
  }
}
