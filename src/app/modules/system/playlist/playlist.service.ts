import { Injectable } from "@angular/core";
import { AppConstants } from "src/app/constants/AppConstants";
import { environment } from "src/environments/environment";
import { HttpService } from "../../core/services/http.service";
import { LoggerService } from "../../core/services/logger.service";

@Injectable({
  providedIn: "root",
})
export class PlaylistService {
  /** Variables declarations - START */
  private apiUrl = environment.apiUrl;
  private apiUrlLocal = environment.apiUrlLocal;
  isLocal = environment.isLocal;
  /** Variables declarations - END */

  constructor(private http: HttpService, private logger: LoggerService) {}

  createPlaylist(playlistIn: any) {
    const endPoint = this.apiUrl + AppConstants.PLAYLIST;
    this.logger.log("PlaylistsService Calling endpoint " + endPoint);
    return this.http.post<any>(endPoint, playlistIn);
  }

  updatePlaylist(playlistIn: any) {
    const endPoint = this.apiUrl + AppConstants.PLAYLIST + "/" + playlistIn.id;
    this.logger.log("Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, playlistIn);
  }

  getPlaylist(id: any) {
    let endPoint = this.apiUrl + AppConstants.PLAYLIST + "/" + id;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "playlist";
    }
    this.logger.log("PlaylistService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getPlaylists(type: any, params: any) {
    let endPoint =
      this.apiUrl + AppConstants.PLAYLIST + "/list/" + type + "?" + params;
    this.logger.log("PlaylistService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  deletePlaylist(id: any) {
    const endPoint = this.apiUrl + AppConstants.PLAYLIST + "/" + id + "/delete";
    this.logger.log("PlaylistService Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, null);
  }

  sharePlaylist(id: any, userIds: any) {
    let endPoint =
      this.apiUrl +
      AppConstants.PLAYLIST +
      "/share/" +
      id +
      "?userIds=" +
      userIds;
    return this.http.put<any>(endPoint, null);
  }

  sendPlaylist(id: any, userIds: any) {
    let endPoint =
      this.apiUrl +
      AppConstants.PLAYLIST +
      "/send/" +
      id +
      "?userIds=" +
      userIds;
    return this.http.put<any>(endPoint, null);
  }

  lockPlaylist(id: any) {
    let endPoint = this.apiUrl + AppConstants.PLAYLIST + "/lock/" + id;
    return this.http.put<any>(endPoint, null);
  }

  getSharedUsers(id: any) {
    let endPoint = this.apiUrl + AppConstants.PLAYLIST + "/share/" + id;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "playlist-share";
    }
    this.logger.log("PlaylistService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getSentUsers(id: any) {
    let endPoint = this.apiUrl + AppConstants.PLAYLIST + "/send/" + id;
    this.logger.log("PlaylistService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  addToDailies(id: any) {
    const endPoint =
      this.apiUrl + AppConstants.PLAYLIST + "/addToDailies/" + id;
    this.logger.log("PlaylistService Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, null);
  }

  addToInternal(id: any, playlistId: any) {
    const endPoint =
      this.apiUrl +
      AppConstants.PLAYLIST +
      "/addToInternal/" +
      id +
      "/" +
      playlistId;
    this.logger.log("PlaylistService Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, null);
  }

  addToExternal(id: any, playlistId: any) {
    const endPoint =
      this.apiUrl +
      AppConstants.PLAYLIST +
      "/addToExternal/" +
      id +
      "/" +
      playlistId;
    this.logger.log("PlaylistService Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, null);
  }

  archivePlaylist(id: any) {
    const endPoint = this.apiUrl + AppConstants.PLAYLIST + "/archive/" + id;
    this.logger.log("PlaylistService Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, null);
  }

  approvePlaylist(id: any) {
    const endPoint =
      this.apiUrl + AppConstants.TASK + "/revision/review/" + id + "/APPROVED";
    this.logger.log("PlaylistService Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, null);
  }

  rejectPlaylist(id: any) {
    const endPoint =
      this.apiUrl + AppConstants.TASK + "/revision/review/" + id + "/REJECTED";
    this.logger.log("PlaylistService Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, null);
  }

  deleteRevision(revisionId: any, playlistId: any) {
    const endPoint =
      this.apiUrl +
      AppConstants.PLAYLIST +
      "/remove/" +
      revisionId +
      "/" +
      playlistId;
    this.logger.log("PlaylistService Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, null);
  }

  restorePlaylist(id: any) {
    const endPoint = this.apiUrl + AppConstants.PLAYLIST + "/restore/" + id;
    this.logger.log("PlaylistService Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, null);
  }

  downloadFeedback(id: any) {
    const endPoint =
      this.apiUrl + AppConstants.PLAYLIST + "/downloadAsPdf/" + id;
    this.logger.log("PlaylistService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint, {
      responseType: "blob",
      observe: "response",
    });
  }

  emailFeedback(id: any, userIds: any) {
    const endPoint =
      this.apiUrl +
      AppConstants.PLAYLIST +
      "/email-feedback/" +
      id +
      "?userIds=" +
      userIds;
    this.logger.log("PlaylistService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getDailiesPlaylist(params: any) {
    let endPoint = this.apiUrl + AppConstants.PLAYLIST_DAILIES + "?" + params;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "playlist-dailies" + "?" + params;
    }
    this.logger.log("PlaylistService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getInternalPlaylist(params: any) {
    let endPoint = this.apiUrl + AppConstants.PLAYLIST_INTERNAL + "?" + params;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "playlist-dailies" + "?" + params;
    }
    this.logger.log("PlaylistService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getExternalPlaylist(params: any) {
    let endPoint = this.apiUrl + AppConstants.PLAYLIST_EXTERNAL + "?" + params;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "playlist-dailies" + "?" + params;
    }
    this.logger.log("PlaylistService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getArchivePlaylist(params: any) {
    let endPoint = this.apiUrl + AppConstants.PLAYLIST_ARCHIVE + "?" + params;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "playlist-dailies" + "?" + params;
    }
    this.logger.log("PlaylistService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getVersionsByPlaylist(id: any, params: any) {
    let endPoint =
      this.apiUrl + AppConstants.PLAYLIST + "/versions/" + id + "?" + params;
    this.logger.log("PlaylistService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getSharedPlaylists(type) {
    let endPoint =
      this.apiUrl + AppConstants.PLAYLIST + "/shared-playlist/" + type;
    this.logger.log("PlaylistService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  publishTask(publishIn) {
    let endPoint = this.apiUrl + "app/publish";
    return this.http.post<any>(endPoint, publishIn);
  }
}
