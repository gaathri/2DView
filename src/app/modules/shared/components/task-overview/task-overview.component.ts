import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ShowsService } from "src/app/modules/system/shows/shows.service";
import { AssetsService } from "src/app/modules/system/shows/assets.service";

@Component({
  selector: "app-task-overview",
  templateUrl: "./task-overview.component.html",
  styleUrls: ["./task-overview.component.scss"],
})
export class TaskOverviewComponent implements OnInit {
  @Input() taskId: any;
  showName: any;
  showId: any;
  assetId: any;
  assetIn: any;
  shotId: any;
  shotIn: any;
  taskIn: any;
  taskInfo: any;
  isDataReady: boolean;
  showLinks: boolean;
  panelHeight: any;

  overviewPanel = {
    active: true,
    disabled: false,
    sname: "Shot Details",
    aname: "Asset Details",
    tname: "Task Details",
    customStyle: {
      "border-radius": "0px",
      "margin-bottom": "8px",
      border: "0px",
    },
  };

  constructor(
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private showsService: ShowsService,
    private assetsService: AssetsService
  ) {}

  ngOnInit() {
    this.activatedRouter.params.subscribe((params) => {
      if (params["showId"]) {
        this.showLinks = true;
      }
      /*this.assetId = params["assetId"];
      this.shotId = params["shotId"];
      this.taskId = params["taskId"];*/
      this.prepareData();
    });
    //this.prepareData();
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
    await this.getTaskInfo(this.taskId);
    if (this.taskIn && this.taskIn.showId) {
      this.showId = this.taskIn.showId;
      if (this.taskIn.shotId) {
        this.shotId = this.taskIn.shotId;
      } else if (this.taskIn.assetId) {
        this.assetId = this.taskIn.assetId;
      }
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
    setTimeout(() => {
      this.panelHeight = document.body.clientHeight - 240; //.height;
      /*this.panelHeight = document.getElementsByClassName(
        "studio-activity"
      )[0].clientHeight;*/
      //alert(document.body.clientHeight + " : " + this.panelHeight);
    }, 200);
  }

  getHeight() {
    let h = document.body.clientHeight - 240 + "px";
    return h;
  }

  async getTask(id: any) {
    this.taskIn = null;
    await this.showsService
      .getTask(id)
      .toPromise()
      .then((resp) => {
        if (resp && resp.valid && resp.entity) {
          this.taskIn = resp.entity;
        }
      })
      .catch((error) => {});
  }

  async getTaskInfo(id: any) {
    this.taskInfo = null;
    await this.showsService
      .getTaskInfo(id)
      .toPromise()
      .then((resp) => {
        if (resp && resp.valid && resp.entity) {
          this.taskInfo = resp.entity;
        }
      })
      .catch((error) => {});
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
