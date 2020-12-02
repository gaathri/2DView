import { Injectable } from "@angular/core";
import { HttpService } from "../../core/services/http.service";
import { LoggerService } from "../../core/services/logger.service";
import { environment } from "src/environments/environment";
import { AppConstants } from "src/app/constants/AppConstants";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  /** Variables declarations - START */
  private apiUrl = environment.apiUrl;
  private apiUrlLocal = environment.apiUrlLocal;
  isLocal = environment.isLocal;
  /** Variables declarations - END */

  constructor(private http: HttpService, private logger: LoggerService) {}

  /** User APIs START */

  createUser(userIn: any) {
    const endPoint = this.apiUrl + AppConstants.USER;
    this.logger.log("UsersService Calling endpoint " + endPoint);
    return this.http.post<any>(endPoint, userIn);
  }

  getUser(id: any) {
   
    let endPoint = this.apiUrl + AppConstants.USER + "/" + id;
     console.log(endPoint);
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "user";
    }
    this.logger.log("UsersService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  updateUser(userIn: any) {
    const endPoint = this.apiUrl + AppConstants.USER + "/" + userIn.id;
    this.logger.log("Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, userIn);
  }

  deleteUser(id: any) {
    const endPoint = this.apiUrl + AppConstants.USER + "/" + id + "/delete";
    this.logger.log("UsersService Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, null);
  }

  getUserList() {
    let endPoint = this.apiUrl + AppConstants.USER_LIST;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "user-list";
    }
    this.logger.log("UsersService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getUserTableList(page: any) {
    let params = ``;
    if (page) {
      params += `search=${page.search}&pageNo=${page.pageNumber}&pageSize=${page.size}&sortBy=${page.sortBy}&orderBy=${page.orderBy}`;
    }
    let endPoint = this.apiUrl + AppConstants.USER_SEARCH + "/?" + params;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "user-list-table";
    }
    this.logger.log("UsersService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  toggleActivate(id: any) {
    const endPoint =
      this.apiUrl + AppConstants.USER + "/" + id + "/toggle-activate";
    this.logger.log("Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getRecipients() {
    const endPoint = this.apiUrl + AppConstants.USER + "/logins";
    this.logger.log("Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  downloadXLS() {
    return this.http.get<any>(`${this.apiUrl}daybook-report/downloadAsxls`, {
      responseType: "blob",
    });
  }
  downloadPDF() {
    return this.http.get<any>(`${this.apiUrl}daybook-report/downloadAsPdf`, {
      responseType: "blob",
    });
  }

  updateUserDetails(id: any, userIn: any) {
    const endPoint = this.apiUrl + AppConstants.USER + "/my-account";
    this.logger.log("Calling endpoint " + endPoint);
    return this.http.patch<any>(endPoint, userIn);
    //return this.http.get<any>(endPoint);
  }

  getFavoriteUsersByRole(page: any) {
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
      this.apiUrl + AppConstants.USER + "/favorite-by-role?" + params;
    this.logger.log("UsersService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  likeUser(likeIn: any) {
    const endPoint = this.apiUrl + AppConstants.FAVORITE;
    this.logger.log("UsersService Calling endpoint " + endPoint);
    return this.http.post<any>(endPoint, likeIn);
  }

  dislikeUser(id: any) {
    const endPoint = this.apiUrl + AppConstants.REMOVE_FAVORITE + "/User/" + id;
    this.logger.log("UsersService Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, null);
  }

  /** User APIs END */
}
