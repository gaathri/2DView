import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-task-detail",
  templateUrl: "./task-detail.component.html",
  styleUrls: ["./task-detail.component.scss"]
})
export class TaskDetailComponent implements OnInit {
  taskId: any;

  constructor(
    private activatedRouter: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.activatedRouter.params.subscribe(params => {
      this.taskId = params["taskId"];
    });
  }
}

/**
 import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AssetsService } from "../assets.service";
import { ShowsService } from "../shows.service";

@Component({
  selector: "app-task-detail",
  templateUrl: "./task-detail.component.html",
  styleUrls: ["./task-detail.component.scss"]
})
export class TaskDetailComponent implements OnInit {
  showName: any;
  showId: any;
  assetId: any;
  assetIn: any;
  shotId: any;
  shotIn: any;
  taskId: any;
  taskIn: any;
  isDataReady: boolean;

  constructor(
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private showsService: ShowsService,
    private assetsService: AssetsService
  ) { }

  ngOnInit() {
    this.activatedRouter.params.subscribe(params => {
      this.showId = params["showId"];
      this.assetId = params["assetId"];
      this.shotId = params["shotId"];
      this.taskId = params["taskId"];
      this.prepareData();
    });
  }

  linkClickHandler(type: any) {
    let routerLink = "";
    if (type === "show-listing") {
      routerLink = "/system/listing/shows";
    } else if (type === "shot-listing") {
      routerLink = "/system/listing/shows/" + this.showId + "/shots";
    } else if (type === "task-listing") {
      if (this.assetIn) {
        routerLink =
          "/system/listing/shows/" + this.showId + "/assets/" + this.assetId;
      } else {
        routerLink =
          "/system/listing/shows/" + this.showId + "/shots/" + this.shotId;
      }
    }
    if (routerLink !== "") {
      this.router.navigate([routerLink]);
    }
  }

  async prepareData() {
    await this.getTask(this.taskId);
    if (this.taskIn) {
      if (this.assetId) {
        await this.getAssetInfo();
        if (this.assetIn) {
          this.showName = this.assetIn.showName;
        }
        this.isDataReady = true;
      } else if (this.shotId) {
        await this.getShotInfo();
        if (this.shotIn) {
          this.showName = this.shotIn.showName;
        }
        this.isDataReady = true;
      }
    }
  }

  async getTask(id: any) {
    this.taskIn = null;
    await this.showsService
      .getTask(id)
      .toPromise()
      .then(resp => {
        if (resp && resp.valid && resp.entity) {
          this.taskIn = resp.entity;
        }
      })
      .catch(error => { });
  }

  async getAssetInfo() {
    await this.assetsService
      .getAssetInfo(this.assetId)
      .toPromise()
      .then((resp: any) => {
        this.assetIn = resp.entity;
      })
      .catch((error: any) => {
        this.assetIn = null;
      });
  }

  async getShotInfo() {
    await this.showsService
      .getShotInfo(this.shotId)
      .toPromise()
      .then((resp: any) => {
        this.shotIn = resp.entity;
      })
      .catch((error: any) => {
        this.shotIn = null;
      });
  }
}
*/