import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class LoggerService {
  isDebug = true;
  constructor() {
    if (window.location.href.indexOf("debug=true") > -1) {
      this.isDebug = true;
    }
  }

  log(msg: any, args?: any) {
    if (this.isDebug) {
      if (args) {
      } else {
      }
    }
  }

  error(msg: any, args?: any) {
    if (this.isDebug) {
      if (args) {
      } else {
      }
    }
  }

  warn(msg: any, args?: any) {
    if (this.isDebug) {
      if (args) {
      } else {
        console.warn(msg);
      }
    }
  }
}
