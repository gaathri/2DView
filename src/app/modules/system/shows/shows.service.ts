import { Injectable } from "@angular/core";
import { HttpService } from "../../core/services/http.service";
import { environment } from "src/environments/environment";
import { AppConstants } from "src/app/constants/AppConstants";

@Injectable({
  providedIn: "root",
})
export class ShowsService {
  /** Variables declarations - START */
  private apiUrl = environment.apiUrl;
  /** Variables declarations - END */

  constructor(private http: HttpService) {}

  /** Show APIs START */

  createShow(showIn: any) {
    const endPoint = this.apiUrl + AppConstants.SHOW;
    return this.http.post<any>(endPoint, showIn);
  }

  likeShow(likeIn: any) {
    const endPoint = this.apiUrl + AppConstants.FAVORITE;
    return this.http.post<any>(endPoint, likeIn);
  }

  dislikeShow(id: any) {
    const endPoint = this.apiUrl + AppConstants.REMOVE_FAVORITE + "/Show/" + id;
    return this.http.put<any>(endPoint, null);
  }

  getShow(id: any) {
    let endPoint = this.apiUrl + AppConstants.SHOW + "/" + id;
    return this.http.get<any>(endPoint);
  }

  updateShow(showIn: any) {
    const endPoint = this.apiUrl + AppConstants.SHOW + "/" + showIn.id;
    return this.http.put<any>(endPoint, showIn);
  }

  deleteShow(id: any) {
    const endPoint = this.apiUrl + AppConstants.SHOW + "/" + id + "/delete";
    return this.http.put<any>(endPoint, null);
  }

  getShowList() {
    let endPoint = this.apiUrl + AppConstants.SHOW_LIST;
    return this.http.get<any>(endPoint);
  }

  getShowListByClient() {
    let endPoint = this.apiUrl + AppConstants.CLIENT_SHOWS;
    return this.http.get<any>(endPoint);
  }

  getShows() {
    let endPoint = this.apiUrl + AppConstants.SHOWS;
    return this.http.get<any>(endPoint);
  }

  getShowsByArist() {
    let endPoint = this.apiUrl + AppConstants.ARIST_SHOWS;
    return this.http.get<any>(endPoint);
  }

  getShowsByClient(clientId) {
    let endPoint = this.apiUrl + "show/list/" + clientId + "?search=";
    return this.http.get<any>(endPoint);
  }

  getShowInfo(id: any) {
    let endPoint = this.apiUrl + AppConstants.SHOW_INFO + "/" + id;
    return this.http.get<any>(endPoint);
  }

  getShowStatus(id: any) {
    let endPoint = this.apiUrl + AppConstants.SHOW_STATUS + "/" + id;
    return this.http.get<any>(endPoint);
  }

  getFiletypes() {
    let endPoint = this.apiUrl + "filetype";
    return this.http.get<any>(endPoint);
  }

  backupShow(postObj: any) {
    let endPoint = this.apiUrl + "backup";
    return this.http.post<any>(endPoint, postObj);
  }

  getTaskTypes() {
    let endPoint = this.apiUrl + "task-type";
    return this.http.get<any>(endPoint);
  }

  getTaskTypesByShowId(showId) {
    let endPoint =
      this.apiUrl + AppConstants.SHOW_LIST_TASK_TYPES + "/" + showId;
    return this.http.get<any>(endPoint);
  }

  getTaskTypesByShotId(shotId) {
    let endPoint = this.apiUrl + "shot/list-task-types/" + shotId;
    return this.http.get<any>(endPoint);
  }
  getTaskTypesByAssetId(assetId) {
    let endPoint = this.apiUrl + "asset/list-task-types/" + assetId;
    return this.http.get<any>(endPoint);
  }

  getDaybookSupervisors(showId: any) {
    let endPoint = this.apiUrl + "task/assigned-supervisors";
    if (showId) {
      endPoint = endPoint + "?showId=" + showId;
    }

    return this.http.get<any>(endPoint);
  }

  getSupervisorsByShowId(showId) {
    let endPoint =
      this.apiUrl + AppConstants.SHOW_LIST_SUPERVISORS + "/" + showId;
    return this.http.get<any>(endPoint);
  }

  getDaybookArtists(showId: any) {
    let endPoint = this.apiUrl + "task/assigned-artist";
    if (showId) {
      endPoint = endPoint + "?showId=" + showId;
    }

    return this.http.get<any>(endPoint);
  }

  getArtistsByShowId(showId) {
    let endPoint = this.apiUrl + AppConstants.SHOW_ARTIST_LIST + "/" + showId;
    return this.http.get<any>(endPoint);
  }

  getFavoriteShowsByUser(page: any) {
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
      this.apiUrl + AppConstants.SHOW + "/favorite-by-user?" + params;
    return this.http.get<any>(endPoint);
  }

  setPageSize(info: any) {
    let endPoint = this.apiUrl + "usersettings";
    return this.http.post<any>(endPoint, info);
  }

  updatePageSize(id: any, info: any) {
    let endPoint = this.apiUrl + "usersettings/" + id;
    return this.http.put<any>(endPoint, info);
  }

  getPageSize() {
    let endPoint = this.apiUrl + "usersettings/list/Paging/";
    return this.http.get<any>(endPoint);
  }

  /** Show APIs END */

  /** Shot APIs START */

  createShot(shotIn: any) {
    const endPoint = this.apiUrl + AppConstants.SHOT;
    return this.http.post<any>(endPoint, shotIn);
  }

  manualInsertion(info: any) {
    const endPoint = this.apiUrl + AppConstants.MANUAL_INSERTION;
    return this.http.post<any>(endPoint, info);
  }

  getShot(id: any) {
    let endPoint = this.apiUrl + AppConstants.SHOT + "/" + id;
    return this.http.get<any>(endPoint);
  }

  updateShot(shotIn: any) {
    const endPoint = this.apiUrl + AppConstants.SHOT + "/" + shotIn.id;

    return this.http.put<any>(endPoint, shotIn);
  }

  deleteShot(id: any) {
    const endPoint = this.apiUrl + AppConstants.SHOT + "/" + id + "/delete";

    return this.http.put<any>(endPoint, null);
  }

  inlineEditShot(id: any, shotIn: any) {
    const endPoint = this.apiUrl + AppConstants.SHOT_INLINE_EDIT + "/" + id;

    return this.http.patch<any>(endPoint, shotIn);
  }

  getShotList(page: any, showId: any, filterParams?: any) {
    let params = `showId=${showId}`;
    if (page) {
      if (page.search) {
        params += `&search=${page.search}`;
      } else {
        params += `&search=`;
      }
      params += `&pageNo=${page.pageNumber}&pageSize=${page.size}&sortBy=${page.sortBy}&orderBy=${page.orderBy}`;
    }
    if (filterParams && filterParams !== "") {
      params += `&${filterParams}`;
    }
    let endPoint = this.apiUrl + AppConstants.SHOT_LIST + "?" + params;

    return this.http.get<any>(endPoint);
  }

  getShotInfo(id: any) {
    let endPoint = this.apiUrl + AppConstants.SHOT_INFO + "/" + id;

    return this.http.get<any>(endPoint);
  }

  getShotStatus(id: any) {
    let endPoint = this.apiUrl + AppConstants.SHOT_STATUS + "/" + id;

    return this.http.get<any>(endPoint);
  }

  getShotColumnList(params) {
    let endPoint = this.apiUrl + AppConstants.SHOT_COLUMN_LIST + params;

    return this.http.get<any>(endPoint);
  }

  getAllStatus() {
    let endPoint = this.apiUrl + AppConstants.SHOT_ALL_STATUS;

    return this.http.get<any>(endPoint);
  }

  getAllStatusNew() {
    let endPoint = this.apiUrl + "status";
    return this.http.get<any>(endPoint);
  }

  /** Shot APIs END */

  /** Task APIs START */

  createTask(taskIn: any) {
    const endPoint = this.apiUrl + AppConstants.TASK;

    return this.http.post<any>(endPoint, taskIn);
  }

  getTask(id: any) {
    let endPoint = this.apiUrl + AppConstants.TASK + "/" + id;

    return this.http.get<any>(endPoint);
  }

  getTaskInfo(id: any) {
    let endPoint = this.apiUrl + AppConstants.TASK + "/info/" + id;

    return this.http.get<any>(endPoint);
  }

  updateTask(taskIn: any) {
    const endPoint = this.apiUrl + AppConstants.TASK + "/" + taskIn.id;

    return this.http.put<any>(endPoint, taskIn);
  }

  deleteTask(id: any) {
    const endPoint = this.apiUrl + AppConstants.TASK + "/" + id + "/delete";

    return this.http.put<any>(endPoint, null);
  }

  cloneTask(id: any) {
    const endPoint = this.apiUrl + AppConstants.TASK + "/clone/" + id;

    return this.http.put<any>(endPoint, null);
  }

  inlineEditTask(id: any, taskIn: any) {
    const endPoint = this.apiUrl + AppConstants.TASK_INLINE_EDIT + "/" + id;

    return this.http.patch<any>(endPoint, taskIn);
  }

  multipleEditTask(id: any, taskIn: any) {
    const endPoint = this.apiUrl + AppConstants.TASK_MULTIPLE_EDIT + "/" + id;
    return this.http.put<any>(endPoint, taskIn);
  }

  getTasksByShowId(page: any, showId: any) {
    let params = `search=&showId=${showId}&pageNo=${page.pageNumber}&pageSize=${page.size}`;
    let endPoint = this.apiUrl + AppConstants.TASK_LIST_FILTER + "?" + params;

    return this.http.get<any>(endPoint);
  }

  getTasksByView(page: any, params: any, viewType: any, taskIn: any) {
    let endPoint =
      this.apiUrl +
      AppConstants.TASK_LIST_FILTER_NEW +
      "/" +
      viewType +
      "?" +
      params;

    return this.http.post<any>(endPoint, taskIn);
  }

  getTasksByShowAndShotIds(page: any, params: any) {
    /*let params = `search=&showId=${showId}&pageNo=${page.pageNumber}&pageSize=${page.size}`;
    if (shotId) {
      params += `&shotId=${shotId}`;
    }*/
    let endPoint = this.apiUrl + AppConstants.TASK_LIST_FILTER + "?" + params;

    return this.http.get<any>(endPoint);
  }

  getTasksByAssetId(page: any, params: any) {
    let endPoint =
      this.apiUrl + AppConstants.TASK_LIST_ASSET_FILTER + "?" + params;

    return this.http.get<any>(endPoint);
  }

  getTasksByArtistId(id: any) {
    let endPoint = this.apiUrl + AppConstants.TASK_BY_ARTIST + "/" + id;

    return this.http.get<any>(endPoint);
  }

  getTaskColumnList(params) {
    let endPoint = this.apiUrl + AppConstants.TASK_COLUMN_LIST + params;

    return this.http.get<any>(endPoint);
  }

  getLocations() {
    let endPoint = this.apiUrl + "location";

    return this.http.get<any>(endPoint);
  }

  getTaskPriorities() {
    let endPoint = this.apiUrl + AppConstants.TASK_PRIORITIES;

    return this.http.get<any>(endPoint);
  }

  getMyTaskShotView(showId: any, params: any) {
    //let endPoint = this.apiUrl + AppConstants.MY_TASK + '/' + showId + '/SHOT_VIEW' + "?" + params;
    let endPoint =
      this.apiUrl + AppConstants.MY_TASK + "/SHOT_VIEW" + "?" + params;

    return this.http.get<any>(endPoint);
  }

  getMyTaskAssetView(showId: any, params: any) {
    //let endPoint = this.apiUrl + AppConstants.MY_TASK + '/' + showId + '/ASSET_VIEW' + "?" + params;
    let endPoint =
      this.apiUrl + AppConstants.MY_TASK + "/ASSET_VIEW" + "?" + params;

    return this.http.get<any>(endPoint);
  }

  getArtistTaskList(params?: any) {
    let endPoint = this.apiUrl + AppConstants.TASK + "/list/artist";
    if (params) {
      endPoint += "?" + params;
    }

    return this.http.get<any>(endPoint);
  }

  getVersionsByTaskId(page: any, taskId: any, versionTypes: any) {
    let params = `search=${page.search}&pageNo=${page.pageNumber}&pageSize=${page.size}&sortBy=${page.sortBy}&orderBy=${page.orderBy}&versionTypes=${versionTypes}`;
    let endPoint =
      this.apiUrl + AppConstants.TASK_VERSIONS + "/" + taskId + "?" + params;

    return this.http.get<any>(endPoint);
  }

  /** Task APIs END */

  /** User APIs START */

  getClientList() {
    let endPoint = this.apiUrl + AppConstants.CLIENT_LIST;
    return this.http.get<any>(endPoint);
  }

  getClientActiveList() {
    let endPoint = this.apiUrl + AppConstants.CLIENT_ACTIVE;
    return this.http.get<any>(endPoint);
  }

  getUserList() {
    let endPoint = this.apiUrl + AppConstants.USER_LIST;

    return this.http.get<any>(endPoint);
  }

  getSupervisorList() {
    let endPoint = this.apiUrl + AppConstants.SUPERVISOR_LIST;

    return this.http.get<any>(endPoint);
  }

  getProducerList() {
    let endPoint = this.apiUrl + AppConstants.PRODUCER_LIST;

    return this.http.get<any>(endPoint);
  }

  /** User APIs END */

  /** Template APIs START */

  getShowTemplates() {
    let endPoint = this.apiUrl + AppConstants.SHOW_TEMPLATES;
    return this.http.get<any>(endPoint);
  }

  getShotTemplates() {
    let endPoint = this.apiUrl + AppConstants.SHOT_TEMPLATES;

    return this.http.get<any>(endPoint);
  }

  getPackingTemplates() {
    let endPoint = this.apiUrl + AppConstants.PACKING_TEMPLATES;

    return this.http.get<any>(endPoint);
  }

  getTaskTemplates() {
    let endPoint = this.apiUrl + AppConstants.TASK_TEMPLATES;

    return this.http.get<any>(endPoint);
  }

  getPackingTemplatesNew(showId) {
    let endPoint = this.apiUrl + "show/list-templates/" + showId;
    return this.http.get<any>(endPoint);
  }

  /** Template APIs END */

  /** Others APIs START */

  getShotAttributes() {
    let endPoint = this.apiUrl + AppConstants.SHOT_ATTRIBUTES;

    return this.http.get<any>(endPoint);
  }

  uploadFile(formData: any) {
    let endPoint = this.apiUrl + AppConstants.UPLOAD_FILE;
    return this.http.post<any>(endPoint, formData);
  }

  uploadFavIcon(formData: any) {
    let endPoint = this.apiUrl + AppConstants.UPLOAD_FAV_ICON;
    return this.http.post<any>(endPoint, formData);
  }

  uploadFileEndPoint() {
    return this.apiUrl + AppConstants.UPLOAD_FILE;
  }
  uploadCSVFileEndPoint() {
    return this.apiUrl + AppConstants.UPLOAD_CSV_FILE;
    // + "csv/upload/1";
  }
  getCSVHeaders() {
    let endPoint = this.apiUrl + AppConstants.CSV_HEADERS;

    return this.http.get<any>(endPoint);
  }

  validateCSV(csvIn: any, showId: any, processId: any) {
    let endPoint = this.apiUrl + `csv/upload/${showId}/${processId}/validate`;

    return this.http.post<any>(endPoint, csvIn);
  }

  validateData(dataIn: any, showId: any, processId: any) {
    let endPoint =
      this.apiUrl + `csv/upload/${showId}/${processId}/validate-data`;

    return this.http.post<any>(endPoint, dataIn);
  }

  submitData(showId: any, processId: any) {
    let endPoint = this.apiUrl + `csv/upload/${showId}/${processId}/submit`;

    return this.http.post<any>(endPoint, null);
  }

  /** Others APIs END */
}
