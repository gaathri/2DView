import { Injectable } from '@angular/core';
import { HttpService } from "../../core/services/http.service";
import { LoggerService } from "../../core/services/logger.service";
import { environment } from "src/environments/environment";
import { AppConstants } from "src/app/constants/AppConstants";


@Injectable({
  providedIn: 'root'
})
export class SequencesService {

  /** Variables declarations - START */
  private apiUrl = environment.apiUrl;
  private apiUrlLocal = environment.apiUrlLocal;
  isLocal = environment.isLocal;
  /** Variables declarations - END */

  constructor(private http: HttpService, private logger: LoggerService) { }

  /** Sequence APIs START */

  createSequence(sequenceIn: any) {
    const endPoint = this.apiUrl + AppConstants.SEQUENCE;
    this.logger.log("SequencesService Calling endpoint " + endPoint);
    return this.http.post<any>(endPoint, sequenceIn);
  }

  getSequence(id: any) {
    let endPoint = this.apiUrl + AppConstants.SEQUENCE + "/" + id;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "sequence";
    }
    this.logger.log("SequencesService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  updateSequence(sequenceIn: any) {
    const endPoint = this.apiUrl + AppConstants.SEQUENCE + "/" + sequenceIn.id;
    this.logger.log("Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, sequenceIn);
  }

  deleteSequence(id: any) {
    const endPoint = this.apiUrl + AppConstants.SEQUENCE + "/" + id + '/delete';
    this.logger.log("SequencesService Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, null);
  }

  getSequenceList(showId: any) {
    let endPoint = this.apiUrl + AppConstants.SEQUENCE_LIST + "/" + showId;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "sequence-list";
    }
    this.logger.log("SequencesService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getSequenceTableList(page: any, showId: any) {
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


    let endPoint = this.apiUrl + AppConstants.SEQUENCE_SEARCH + "/" + showId + "?" + params;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "sequence-list-table";
    }
    this.logger.log("SequencesService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  inlineEdit(id: any, sequenceIn: any) {
    const endPoint = this.apiUrl + AppConstants.SEQUENCE_INLINE_EDIT + "/" + id;
    this.logger.log("Calling endpoint " + endPoint);
    return this.http.patch<any>(endPoint, sequenceIn);
  }

  /** Sequence APIs END */

}
