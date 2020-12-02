import { Injectable } from "@angular/core";

import { environment } from "src/environments/environment";
import { AppConstants } from "src/app/constants/AppConstants";
import { HttpService } from "../core/services/http.service";

@Injectable({
  providedIn: "root",
})
export class NotificationsService {
  /** Variables declarations - START */
  private apiUrl = environment.apiUrl;
  /** Variables declarations - END */

  constructor(private http: HttpService) {}

  getNotificationList(page: any) {
    let params = ``;
    if (page) {
      params += `search=${page.search}&pageNo=${page.pageNumber}&pageSize=${page.size}&sortBy=${page.sortBy}&orderBy=${page.orderBy}`;
    }
    let endPoint = this.apiUrl + AppConstants.NOTIFICATION_LIST + "/?" + params;

    return this.http.get<any>(endPoint);
  }

  markNotificationAsRead(id: any) {
    const endPoint = this.apiUrl + AppConstants.NOTIFICATION_READ + "/" + id;

    return this.http.put<any>(endPoint, null);
  }

  checkNewNotifications(_time: any) {
    let time = "";
    if (_time) {
      time = _time;
    }
    let endPoint =
      this.apiUrl + AppConstants.NOTIFICATION_LATEST + "?date=" + time;

    return this.http.get<any>(endPoint);
  }

  getNotificationtypes() {
    let endPoint = this.apiUrl + "notificationtypes";
    return this.http.get<any>(endPoint);
  }

  addUserSettings(info) {
    let endPoint = this.apiUrl + "notificationtypes/addusersettings";
    return this.http.post<any>(endPoint, info);
  }

  getUserSettings() {
    let endPoint = this.apiUrl + "notificationtypes/getusersettings";
    return this.http.get<any>(endPoint);
  }
}
