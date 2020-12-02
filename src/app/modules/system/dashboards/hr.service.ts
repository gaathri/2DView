import { Injectable } from "@angular/core";
import { HttpService } from "../../core/services/http.service";
import { LoggerService } from "../../core/services/logger.service";
import { environment } from "src/environments/environment";
import { AppConstants } from "src/app/constants/AppConstants";

@Injectable({
  providedIn: "root",
})
export class HrService {
  /** Variables declarations - START */
  private apiUrl = environment.apiUrl;
  private apiUrlLocal = environment.apiUrlLocal;
  isLocal = environment.isLocal;
  /** Variables declarations - END */

  constructor(private http: HttpService, private logger: LoggerService) {}

  createHoliday(holidayIn: any) {
    const endPoint = this.apiUrl + AppConstants.HOLIDAY;
    this.logger.log("HrService Calling endpoint " + endPoint);
    return this.http.post<any>(endPoint, holidayIn);
  }

  getHoliday(id: any) {
    let endPoint = this.apiUrl + AppConstants.HOLIDAY + "/" + id;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "holiday";
    }
    this.logger.log("HrService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  updateHoliday(holidayIn: any) {
    const endPoint = this.apiUrl + AppConstants.HOLIDAY + "/" + holidayIn.id;
    this.logger.log("Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, holidayIn);
  }

  deleteHoliday(id: any) {
    const endPoint = this.apiUrl + AppConstants.HOLIDAY + "/" + id + "/delete";
    this.logger.log("HolidaysService Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, null);
  }

  getHolidayTableList(page: any, year: any) {
    let params = ``;
    if (page) {
      params += `pageNo=${page.pageNumber}&pageSize=${page.size}&sortBy=${page.sortBy}&orderBy=${page.orderBy}`;
      //params += `pageNo=&pageSize=&sortBy=${page.sortBy}&orderBy=${page.orderBy}`;
      if (page.search) {
        params += `&search=${page.search}`;
      } else {
        params += `&search=`;
      }
    } else {
      params = `search=`;
    }
    let endPoint =
      this.apiUrl + AppConstants.HOLIDAY_LIST + "/" + year + "?" + params;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "holiday-list-table";
    }
    this.logger.log("HrService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getKPIInfo(year: any) {
    let endPoint = this.apiUrl + AppConstants.HOLIDAY_KPI + "/" + year;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "holiday-kpi";
    }
    this.logger.log("HrService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  createLeave(leaveIn: any) {
    const endPoint = this.apiUrl + AppConstants.LEAVE;
    this.logger.log("HrService Calling endpoint " + endPoint);
    return this.http.post<any>(endPoint, leaveIn);
  }

  getLeave(id: any) {
    let endPoint = this.apiUrl + AppConstants.LEAVE + "/" + id;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "leave";
    }
    this.logger.log("HrService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  updateLeave(leaveIn: any) {
    const endPoint = this.apiUrl + AppConstants.LEAVE + "/" + leaveIn.id;
    this.logger.log("Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, leaveIn);
  }

  deleteLeave(id: any) {
    const endPoint = this.apiUrl + AppConstants.LEAVE + "/" + id + "/delete";
    this.logger.log("LeavesService Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, null);
  }

  getLeaveTableList(page: any, date: any, status: any) {
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

    params += `&date=${date}`;

    if (status) {
      params += `&status=${status}`;
    }

    let endPoint = this.apiUrl + AppConstants.LEAVE_LIST + "?" + params;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "leave-list-table";
    }
    this.logger.log("HrService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getLeaveTableListByUser(page: any, month: any, year: any, userId: any) {
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
      this.apiUrl +
      AppConstants.LEAVE_LIST +
      "/" +
      userId +
      "/" +
      month +
      "/" +
      year +
      "?" +
      params;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "leave-list-table";
    }
    this.logger.log("HrService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getWeekendList(month: any, year: any) {
    let endPoint =
      this.apiUrl + AppConstants.WEEKEND_INFO + "/" + month + "/" + year;
    this.logger.log("HrService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getLeaveInfo(month: any, year: any) {
    let endPoint =
      this.apiUrl + AppConstants.LEAVE_INFO + "/" + month + "/" + year;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "leave-info";
    }
    this.logger.log("HrService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getLeaveInfoByArtist(month: any, year: any, artistId: any) {
    let endPoint =
      this.apiUrl +
      AppConstants.LEAVE_INFO +
      "/" +
      month +
      "/" +
      year +
      "?artistId=" +
      artistId;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "leave-info";
    }
    this.logger.log("HrService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }
}
