import { Injectable } from "@angular/core";
import { HttpService } from "../../core/services/http.service";
import { environment } from "src/environments/environment";
import { AppConstants } from "src/app/constants/AppConstants";

@Injectable({
  providedIn: "root",
})
export class ClientService {
  /** Variables declarations - START */
  private apiUrl = environment.apiUrl;
  /** Variables declarations - END */

  constructor(private http: HttpService) {}

  /** Client APIs START */

  createClient(clientIn: any) {
    const endPoint = this.apiUrl + AppConstants.CLIENT;
    return this.http.post<any>(endPoint, clientIn);
  }

  getClient(id: any) {
    let endPoint = this.apiUrl + AppConstants.CLIENT + "/" + id;

    return this.http.get<any>(endPoint);
  }

  updateClient(clientIn: any) {
    const endPoint = this.apiUrl + AppConstants.CLIENT + "/" + clientIn.id;

    return this.http.put<any>(endPoint, clientIn);
  }

  deleteClient(id: any) {
    const endPoint = this.apiUrl + AppConstants.CLIENT + "/" + id + "/delete";

    return this.http.put<any>(endPoint, null);
  }

  getClientList() {
    let endPoint = this.apiUrl + AppConstants.CLIENT;

    return this.http.get<any>(endPoint);
  }

  getClientTableList(page: any) {
    let params = ``;
    if (page) {
      params += `search=${page.search}&pageNo=${page.pageNumber}&pageSize=${page.size}&sortBy=${page.sortBy}&orderBy=${page.orderBy}`;
    }
    let endPoint = this.apiUrl + AppConstants.CLIENT_SEARCH + "/?" + params;

    return this.http.get<any>(endPoint);
  }

  toggleActivate(id: any) {
    const endPoint =
      this.apiUrl + AppConstants.CLIENT + "/" + id + "/toggle-activate";

    return this.http.get<any>(endPoint);
  }

  /** Client APIs END */
}
