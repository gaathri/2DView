import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { InteractionService } from "../../core/services/interaction.service";
import { Subscription } from "rxjs";
import { HelperService } from '../../core/services/helper.service';

@Component({
  selector: "app-breadcrumb",
  templateUrl: "./breadcrumb.component.html",
  styleUrls: ["./breadcrumb.component.scss"]
})
export class BreadcrumbComponent implements OnInit {
  @ViewChild("titleSpan", { static: true }) titleSpan;
  subscription: Subscription;
  currentListing = "";
  showName = "";
  shotName = "";
  info: any;
  LINK_TYPE = {
    LISTING: "listing",
    SHOW: "show-listing",
    SHOT: "shot-listing",
    TASK: "shot-task-listing",
    ASSET_TASK: "asset-task-listing",
  };
  showBreadcrumb: boolean = true;
  constructor(
    private interactionService: InteractionService,
    private router: Router
  ) { }

  ngOnInit() {
    this.subscription = this.interactionService
      .getInteraction()
      .subscribe(interaction => {
        this.showBreadcrumb = true;
        if (interaction.type === 'breadcrumb') {
          this.currentListing = interaction.text;
          this.info = interaction.info;
          if (interaction.text === "hide_breadcrumb") {
            this.showBreadcrumb = false;
          }
        }
      });
  }

  linkClickHandler(type: any) {
    let routerLink = "";
    switch (type) {
      case this.LINK_TYPE.LISTING:
        routerLink = "/system/listing";
        break;
      case this.LINK_TYPE.SHOW:
        routerLink = "/system/listing/shows";
        break;
      case this.LINK_TYPE.SHOT:
        routerLink = "/system/listing/shows/" + this.info.showId + "/shots";
        break;
      case this.LINK_TYPE.TASK:
        routerLink =
          "/system/listing/shows/" +
          this.info.showId +
          "/shots" +
          this.info.shotId;
        break;
      default:
        break;
    }
    //let routerLink = this.router.url + "/" + row.id;
    //let routerLink = "";
    this.router.navigate([routerLink]);
  }
  getShowName() {
    return this.info && this.info.showName ? this.info.showName : "";
  }
  getShotName() {
    return this.info && this.info.shotName ? this.info.shotName : "";
  }
  getAssetName() {
    return this.info && this.info.assetName ? this.info.assetName : "";
  }
}
