import { Injectable } from '@angular/core';
import { HttpService } from "../../core/services/http.service";
import { LoggerService } from "../../core/services/logger.service";
import { environment } from "src/environments/environment";
import { AppConstants } from "src/app/constants/AppConstants";

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  /** Variables declarations - START */
  private apiUrl = environment.apiUrl;
  private apiUrlLocal = environment.apiUrlLocal;
  isLocal = environment.isLocal;
  /** Variables declarations - END */

  constructor(private http: HttpService, private logger: LoggerService) { }

  /** Note APIs START */

  createNote(noteIn: any) {
    let endPoint = this.apiUrl + AppConstants.NOTES;
    this.logger.log("NotesService Calling endpoint " + endPoint);
    return this.http.post<any>(endPoint, noteIn);
  }

  getNotesByTask(id: any) {
    let endPoint = this.apiUrl + AppConstants.NOTES + '/' + AppConstants.TASK_ENTITY_ID + '/' + id;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "task-notes";
    }
    this.logger.log("NotesService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getNotesByRevision(id: any) {
    let endPoint = this.apiUrl + AppConstants.NOTES + '/' + AppConstants.REVISION_ENTITY_ID + '/' + id;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "revision-notes";
    }
    this.logger.log("NotesService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  createFeedback(feedbackIn: any) {
    let endPoint = this.apiUrl + AppConstants.FEEDBACK;
    this.logger.log("NotesService Calling endpoint " + endPoint);
    return this.http.post<any>(endPoint, feedbackIn);
  }

  getFeedbackByTask(id: any) {
    let endPoint = this.apiUrl + AppConstants.FEEDBACK + '/' + AppConstants.TASK_ENTITY_ID + '/' + id;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "task-feedback";
    }
    this.logger.log("NotesService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getFeedbackByRevision(id: any) {
    let endPoint = this.apiUrl + AppConstants.FEEDBACK + '/' + AppConstants.REVISION_ENTITY_ID + '/' + id;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "revision-feedback";
    }
    this.logger.log("NotesService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }



  /*createNote(noteIn: any) {
    const endPoint = this.apiUrl + AppConstants.NOTE;
    this.logger.log("NotesService Calling endpoint " + endPoint);
    return this.http.post<any>(endPoint, noteIn);
  }

  getNote(id: any) {
    let endPoint = this.apiUrl + AppConstants.NOTE + "/" + id;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "note";
    }
    this.logger.log("NotesService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  updateNote(noteIn: any) {
    const endPoint = this.apiUrl + AppConstants.NOTE + "/" + noteIn.id;
    this.logger.log("Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, noteIn);
  }

  deleteNote(id: any) {
    const endPoint = this.apiUrl + AppConstants.NOTE + "/" + id + '/delete';
    this.logger.log("NotesService Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, null);
  }

  getNoteList(showId: any) {
    let endPoint = this.apiUrl + AppConstants.NOTE_LIST + "/" + showId;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "note-list";
    }
    this.logger.log("NotesService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getNoteTableList(page: any, showId: any) {
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
    let endPoint = this.apiUrl + AppConstants.NOTE_SEARCH + "/" + showId + "?" + params;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "note-list-table";
    }
    this.logger.log("NotesService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }*/

  /** Note APIs END */
}
