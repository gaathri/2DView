import { Injectable } from "@angular/core";
import { HttpService } from "../../core/services/http.service";
import { LoggerService } from "../../core/services/logger.service";
import { environment } from "src/environments/environment";
import { AppConstants } from "src/app/constants/AppConstants";

@Injectable({
  providedIn: "root",
})
export class AssetsService {
  /** Variables declarations - START */
  private apiUrl = environment.apiUrl;
  private apiUrlLocal = environment.apiUrlLocal;
  isLocal = environment.isLocal;
  /** Variables declarations - END */

  constructor(private http: HttpService, private logger: LoggerService) {}

  /** Asset APIs START */

  createAsset(assetIn: any) {
    const endPoint = this.apiUrl + AppConstants.ASSET;
    return this.http.post<any>(endPoint, assetIn);
  }

  getAsset(id: any) {
    let endPoint = this.apiUrl + AppConstants.ASSET + "/" + id;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "asset";
    }
    return this.http.get<any>(endPoint);
  }

  updateAsset(assetIn: any) {
    const endPoint = this.apiUrl + AppConstants.ASSET + "/" + assetIn.id;
    return this.http.put<any>(endPoint, assetIn);
  }
  bulkUpdate(bulkIn: any) {
    console.log(bulkIn);
    let endPoint = this.apiUrl + AppConstants.ASSET + "/bulk-update";
    console.log(endPoint);
    this.logger.log("AssetService Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, bulkIn);
  }
  deleteAsset(id: any) {
    const endPoint = this.apiUrl + AppConstants.ASSET + "/" + id + "/delete";
    return this.http.put<any>(endPoint, null);
  }

  getAssetListByShowId(showId: any) {
    let endPoint = this.apiUrl + AppConstants.ASSET_LIST + "/" + showId;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "asset-list";
    }
    return this.http.get<any>(endPoint);
  }

  getDaybookAssets(showId: any) {
    let endPoint = this.apiUrl + "asset/list-assets";
    if (showId) {
      endPoint = endPoint + "?showId=" + showId;
    }

    return this.http.get<any>(endPoint);
  }

  getAssetsByView(viewType: any, params: any) {
    let endPoint =
      this.apiUrl +
      AppConstants.ASSET_LIST +
      "/filter/" +
      viewType +
      "?" +
      params;
    return this.http.get<any>(endPoint);
  }

  getAssetTableListNew(params: any) {
    let endPoint = this.apiUrl + AppConstants.ASSET_LIST + "?" + params;
    return this.http.get<any>(endPoint);
  }

  getAssetTableList(page: any, showId: any, filterParams?: any) {
    //let params = `search=&showId=${showId}`;
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
    let endPoint = this.apiUrl + AppConstants.ASSET_LIST + "?" + params;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "asset-list-table";
    }
    return this.http.get<any>(endPoint);
  }

  inlineEdit(id: any, assetIn: any) {
    const endPoint = this.apiUrl + AppConstants.ASSET_INLINE_EDIT + "/" + id;
    return this.http.patch<any>(endPoint, assetIn);
  }

  getAssetTypes() {
    let endPoint = this.apiUrl + AppConstants.ASSET_TYPES;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "asset-types";
    }
    return this.http.get<any>(endPoint);
  }

  getAssetInfo(id: any) {
    let endPoint = this.apiUrl + AppConstants.ASSET_INFO + "/" + id;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "asset-info";
    }
    return this.http.get<any>(endPoint);
  }

  getAssetStatus(id: any) {
    let endPoint = this.apiUrl + AppConstants.ASSET_STATUS + "/" + id;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "asset-status";
    }
    return this.http.get<any>(endPoint);
  }

  getSubAssetList(showId: any) {
    let endPoint = this.apiUrl + AppConstants.ASSET_LIST + "/" + showId;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "asset-list";
    }
    return this.http.get<any>(endPoint);
  }

  getParentAssetList(showId: any) {
    let endPoint = this.apiUrl + AppConstants.ASSET_LIST + "/" + showId;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "asset-list";
    }
    return this.http.get<any>(endPoint);
  }

  getFavoriteAssetsByArtist(page: any) {
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
      this.apiUrl + AppConstants.ASSET + "/favorite-by-artist?" + params;
    return this.http.get<any>(endPoint);
  }

  likeAsset(likeIn: any) {
    const endPoint = this.apiUrl + AppConstants.FAVORITE;
    return this.http.post<any>(endPoint, likeIn);
  }

  dislikeAsset(id: any) {
    const endPoint =
      this.apiUrl + AppConstants.REMOVE_FAVORITE + "/Asset/" + id;
    return this.http.put<any>(endPoint, null);
  }

  getAssetsByArist(id: any) {
    let endPoint = this.apiUrl + AppConstants.ASSET + "/list-by-arist/" + id;
    return this.http.get<any>(endPoint);
  }

  getUsersettings() {
    let endPoint = this.apiUrl + "usersettings/list/Asset";
    return this.http.get<any>(endPoint);
  }

  getAssetColumnList(params) {
    let endPoint = this.apiUrl + AppConstants.ASSET_COLUMN_LIST + params;
    return this.http.get<any>(endPoint);
  }

  createUsersettings(settingsIn: any) {
    const endPoint = this.apiUrl + "usersettings";
    return this.http.post<any>(endPoint, settingsIn);
  }

  updateUsersettings(settingsId: any, settingsIn: any) {
    const endPoint = this.apiUrl + "usersettings/" + settingsId;
    this.logger.log("ShotsService Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, settingsIn);
  }

  /** Asset APIs END */
}
