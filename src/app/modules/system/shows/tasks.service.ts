import { Injectable } from "@angular/core";
import { HttpService } from "../../core/services/http.service";
import { LoggerService } from "../../core/services/logger.service";
import { environment } from "src/environments/environment";
import { AppConstants } from "src/app/constants/AppConstants";

@Injectable({
  providedIn: "root",
})
export class TasksService {
  /** Variables declarations - START */
  private apiUrl = environment.apiUrl;
  private apiUrlLocal = environment.apiUrlLocal;
  isLocal = environment.isLocal;
  /** Variables declarations - END */

  constructor(private http: HttpService, private logger: LoggerService) {}

  getTaskProgressByShot(ids: any) {
    let endPoint = this.apiUrl + AppConstants.TASK_PROGRESS_SHOT + ids;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "task-progress-shot";
    }
    this.logger.log("TasksService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getTaskProgressByAsset(ids: any) {
    let endPoint = this.apiUrl + AppConstants.TASK_PROGRESS_ASSET + ids;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "task-progress-asset";
    }
    this.logger.log("TasksService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getTaskProgressByTask(ids: any) {
    let endPoint = this.apiUrl + AppConstants.TASK_PROGRESS_TASK + ids;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "task-progress-task";
    }
    this.logger.log("TasksService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getShotTasks(params?: any) {
    let endPoint = this.apiUrl + AppConstants.TASK_LIST_VIEW + "/SHOT_VIEW";
    if (params) {
      endPoint += "?" + params;
    }
    if (this.isLocal) {
      endPoint = "http://localhost:4200/assets/shots.json";
    }
    this.logger.log("TasksService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getAssetTasks(params?: any) {
    let endPoint = this.apiUrl + AppConstants.TASK_LIST_VIEW + "/ASSET_VIEW";
    if (params) {
      endPoint += "?" + params;
    }
    if (this.isLocal) {
      endPoint = "http://localhost:4200/assets/assets.json";
    }
    this.logger.log("TasksService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getAssetTasksById(id: any) {
    let endPoint =
      this.apiUrl + AppConstants.TASK + "/list-by-asset-artist/" + id;
    this.logger.log("TasksService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getShotTasksById(id: any) {
    let endPoint =
      this.apiUrl + AppConstants.TASK + "/list-by-shot-artist/" + id;
    this.logger.log("TasksService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  bulkUpdate(bulkIn: any) {
    let endPoint = this.apiUrl + AppConstants.TASK + "/bulk-update";
    this.logger.log("TasksService Calling endpoint " + endPoint);
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
    let endPoint = this.apiUrl + "usersettings/list/Task";
    this.logger.log("ShotsService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getActivityLogs(page: any, taskId: any) {
    let params = ``;
    if (page) {
      params += `pageNo=${page.pageNumber}&pageSize=${page.size}`;
    }
    let endPoint = this.apiUrl + "task/activitylogs/" + taskId + "/?" + params;

    return this.http.get<any>(endPoint);
  }

  getArtistData() {
    let endPoint = this.apiUrl + "users/list-artist-data";
    return this.http.get<any>(endPoint);
  }

  /*getTaskNotesByTask(id: any) {
    let endPoint = this.apiUrl + AppConstants.NOTES + '/6/' + id;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "task-notes";
    }
    this.logger.log("TasksService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  createNote(noteIn: any) {
    let endPoint = this.apiUrl + AppConstants.NOTES;
    this.logger.log("TasksService Calling endpoint " + endPoint);
    return this.http.post<any>(endPoint, noteIn);
  }*/
}
