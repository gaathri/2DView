import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class InteractionService {
  private subject = new Subject<any>();

  sendInteraction(type: string, text: string, info?: any, err?: string) {
    if (!err) {
      err = "";
    }
    if (!info) {
      info = "";
    }
    this.subject.next({ type: type, text: text, info: info, err: err });
  }

  clearInteraction() {
    this.subject.next();
  }

  getInteraction(): Observable<any> {
    return this.subject.asObservable();
  }
}
