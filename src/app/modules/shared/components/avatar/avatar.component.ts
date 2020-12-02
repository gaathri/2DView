import { Component, OnInit, Input, OnDestroy, ViewChild } from "@angular/core";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-avatar",
  templateUrl: "./avatar.component.html",
  styleUrls: ["./avatar.component.scss"],
})
export class AvatarComponent implements OnInit, OnDestroy {
  @ViewChild("myAvatar", { static: false }) myAvatar: any;
  @Input() info: any;
  isDestroy = false;
  size = "large";
  constructor() {}

  ngOnInit() {
    if (this.info && this.info.size) {
      this.size = this.info.size;
    }
  }

  ngOnDestroy(): void {
    this.isDestroy = true;
  }

  getSrc() {
    //return "https://www.cricbuzz.com/a/img/v1/152x152/i1/c170677/ms-dhoni.jpg";
    /*if (environment.production === false) {
      return "";
    }*/
    return this.info.thumbnail;
  }
  getText() {
    return this.info.firstName.charAt(0) + "" + this.info.lastName.charAt(0);
  }
}
