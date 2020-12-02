import { Injectable } from "@angular/core";
import { HttpService } from "../../core/services/http.service";
import { LoggerService } from "../../core/services/logger.service";
import { environment } from "src/environments/environment";
import { AppConstants } from "src/app/constants/AppConstants";

@Injectable({
  providedIn: "root",
})
export class EpisodesService {
  /** Variables declarations - START */
  private apiUrl = environment.apiUrl;
  private apiUrlLocal = environment.apiUrlLocal;
  isLocal = environment.isLocal;
  /** Variables declarations - END */

  constructor(private http: HttpService, private logger: LoggerService) {}

  /** Episode APIs START */

  createEpisode(episodeIn: any) {
    const endPoint = this.apiUrl + AppConstants.EPISODE;
    this.logger.log("EpisodesService Calling endpoint " + endPoint);
    return this.http.post<any>(endPoint, episodeIn);
  }

  getEpisode(id: any) {
    let endPoint = this.apiUrl + AppConstants.EPISODE + "/" + id;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "episode";
    }
    this.logger.log("EpisodesService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  updateEpisode(episodeIn: any) {
    const endPoint = this.apiUrl + AppConstants.EPISODE + "/" + episodeIn.id;
    this.logger.log("Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, episodeIn);
  }

  deleteEpisode(id: any) {
    const endPoint = this.apiUrl + AppConstants.EPISODE + "/" + id + "/delete";
    this.logger.log("EpisodesService Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, null);
  }

  getEpisodeList(showId: any) {
    let endPoint = this.apiUrl + AppConstants.EPISODE_LIST + "/" + showId;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "episode-list";
    }
    this.logger.log("EpisodesService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getEpisodeListWithParent(showId: any) {
    let endPoint =
      this.apiUrl + AppConstants.EPISODE + "/list-with-parent/" + showId;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "episode-list";
    }
    this.logger.log("EpisodesService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getEpisodeTableList(page: any, showId: any) {
    let params = ``;
    if (page) {
      params += `&pageNo=${page.pageNumber}&pageSize=${page.size}&sortBy=${page.sortBy}&orderBy=${page.orderBy}`;
      if (page.search) {
        params += `&search=${page.search}`;
      } else {
        params += `&search=`;
      }
    } else {
      params = `search=`;
    }
    let endPoint =
      this.apiUrl + AppConstants.EPISODE_SEARCH + "/" + showId + "?" + params;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "episode-list-table";
    }
    this.logger.log("EpisodesService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  inlineEdit(id: any, episodeIn: any) {
    const endPoint = this.apiUrl + AppConstants.EPISODE_INLINE_EDIT + "/" + id;
    this.logger.log("Calling endpoint " + endPoint);
    return this.http.patch<any>(endPoint, episodeIn);
  }

  /** Episode APIs END */
}
