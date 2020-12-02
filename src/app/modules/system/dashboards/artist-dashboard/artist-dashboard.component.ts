import { Component, OnInit, Input } from "@angular/core";
import { ArtistDashboardService } from "../artist-dashboard.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { NotificationService } from "src/app/modules/core/services/notification.service";

@Component({
  selector: "app-artist-dashboard",
  templateUrl: "./artist-dashboard.component.html",
  styleUrls: ["./artist-dashboard.component.scss"],
})
export class ArtistDashboardComponent implements OnInit {
  @Input() starStatus: any;
  @Input() overallStatus: any;
  isDataReady: boolean;
  activityLogs: any;
  activityEntities: any;
  storageSpace: any;
  overallTaskProgress: any;
  progressEntities: any;
  starShots: any;
  favoriteShots: any;
  starEntities: any;
  starShotId: any;
  isVisible: boolean;
  selectedStarShot: any;
  taskProgressByShot: any;
  taskProgressEntities: any;
  panelHeight = 0;

  constructor(
    private dashboardService: ArtistDashboardService,
    private helperService: HelperService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.prepareData();
  }

  async prepareData() {
    await this.getOverallTaskProgress();
    //await this.getActivityLogs();
    await this.getStorageSpace();
    await this.getStarShots();
    //await this.getFavoriteShots();
    this.isDataReady = true;
    setTimeout(() => {
      this.panelHeight = document.getElementsByClassName(
        "dashboard-right"
      )[0].clientHeight;
    }, 200);
  }

  frameStarEntities() {
    this.starEntities = {
      title: "Star Shots",
      items: this.starShots,
      titleKey: "shotCode",
    };
  }

  updateOverallStatus(overallStatus: any) {
    this.overallStatus = overallStatus;
    this.frameProgressEntities();
  }
  updateStarStatus(starStatus: any) {
    this.starStatus = starStatus;
    this.frameTaskProgressEntities();
  }
  frameProgressEntities() {
    let items = [];
    for (let i = 0; i < this.overallStatus.length; i++) {
      let item = this.helperService.findObjectInArrayByKey(
        this.overallTaskProgress,
        "name",
        this.overallStatus[i]["name"]
      );
      if (item) {
        items.push(item);
      } else {
        item = {
          name: this.overallStatus[i]["name"],
          code: this.overallStatus[i]["code"],
          value: 0,
          per: 0,
        };
        items.push(item);
      }
    }
    this.progressEntities = {
      title: "Task Progress",
      items: items,
    };
  }

  frameActivityEntities() {
    this.activityEntities = {
      title: "Activity Log",
      items: this.activityLogs,
      //items: [...this.activityLogs, ...this.activityLogs, ...this.activityLogs, ...this.activityLogs, ...this.activityLogs, ...this.activityLogs, ...this.activityLogs, ...this.activityLogs, ...this.activityLogs, ...this.activityLogs, ...this.activityLogs, ...this.activityLogs, ...this.activityLogs, ...this.activityLogs, ...this.activityLogs, ...this.activityLogs, ...this.activityLogs, ...this.activityLogs, ...this.activityLogs, ...this.activityLogs, ...this.activityLogs, ...this.activityLogs, ...this.activityLogs, ...this.activityLogs, ...this.activityLogs, ...this.activityLogs, ...this.activityLogs, ...this.activityLogs, ...this.activityLogs, ...this.activityLogs, ...this.activityLogs, ...this.activityLogs, ...this.activityLogs, ...this.activityLogs, ...this.activityLogs, ...this.activityLogs, ...this.activityLogs, ...this.activityLogs, ...this.activityLogs]
    };
  }

  frameTaskProgressEntities() {
    let items = [];
    for (let i = 0; i < this.starStatus.length; i++) {
      let item = this.helperService.findObjectInArrayByKey(
        this.taskProgressByShot,
        "name",
        this.starStatus[i]["name"]
      );
      if (item) {
        items.push(item);
      } else {
        item = {
          name: this.starStatus[i]["name"],
          code: this.starStatus[i]["code"],
          value: 0,
          per: 0,
        };
        items.push(item);
      }
    }
    this.taskProgressEntities = {
      subTitle: "Tasks",
      title:
        this.selectedStarShot && this.selectedStarShot.shotCode
          ? this.selectedStarShot.shotCode
          : "",
      items: items,
    };
  }

  /*getName(item: any) {
    return item && item.name ? item.name : "";
  }

  getValue(item: any) {
    return item && item.value ? item.value : 0;
  }

  getPercent(item: any) {
    return item && item.per ? Math.round(item.per) : 0;
  }

  getColor(item: any) {
    return item && item.code ? item.code : "#fff";
  }

  getProgressConfig(item: any) {
    return {
      showInfo: false,
      type: "line",
      strokeLinecap: "round",
      strokeWidth: 8,
      strokeColor: this.getColor(item)
    };
  } 
  */

  getUsedPercentage() {
    return this.storageSpace && this.storageSpace.usedPercentage
      ? Math.round(this.storageSpace.usedPercentage)
      : 0;
  }

  starShotAdd() {
    this.isVisible = true;
    this.getFavoriteShots();
  }

  starShotSelect(shot: any) {
    this.selectedStarShot = shot;
    this.getTaskProgressByShot(shot.id);
  }

  starShotClose(shot: any) {
    this.removeShotFromStarList(shot.id);
  }

  /*refreshActivityLogs() {
    this.getActivityLogs();
  }*/

  onConfirm() {
    this.isVisible = false;
    if (this.starShotId) {
      this.addShotToStarList(this.starShotId);
    }
  }

  onCancel() {
    this.isVisible = false;
  }

  isValidArr(arr: any) {
    return this.helperService.isValidArr(arr);
  }

  showNotification(info: any) {
    this.notificationService.showNotification(info);
  }

  async getOverallTaskProgress() {
    await this.dashboardService
      .getOverallTaskProgress()
      .toPromise()
      .then((resp) => {
        this.overallTaskProgress = resp.entity;
        this.frameProgressEntities();
      })
      .catch((error) => {
        this.overallTaskProgress = null;
      });
  }

  /*async getActivityLogs() {
    await this.dashboardService
      .getActivityLogs()
      .toPromise()
      .then(resp => {
        this.activityLogs = resp.entity;
        this.frameActivityEntities();
      })
      .catch(error => {
        this.activityLogs = null;
      });
  }*/

  async getStorageSpace() {
    this.storageSpace = {
      storageUnit: 0,
      allocatedDiskSpace: 0,
      usedPercentage: 0,
    };
    await this.dashboardService
      .getStorageSpace()
      .toPromise()
      .then((resp) => {
        if (resp.entity) {
          this.storageSpace = resp.entity;
        }
      })
      .catch((error) => {
        //this.storageSpace = null;
      });
  }

  async getTaskProgressByShot(shotId: any) {
    await this.dashboardService
      .getTaskProgressByShot(shotId)
      .toPromise()
      .then((resp) => {
        this.taskProgressByShot = resp.entity;
        this.frameTaskProgressEntities();
      })
      .catch((error) => {
        this.taskProgressByShot = null;
      });
  }

  async getStarShots() {
    await this.dashboardService
      .getStarShots()
      .toPromise()
      .then((resp) => {
        this.starShots = resp.entity;
        this.frameStarEntities();
      })
      .catch((error) => {
        this.starShots = null;
      });
  }

  async getFavoriteShots() {
    await this.dashboardService
      .getFavoriteShots()
      .toPromise()
      .then((resp) => {
        let entity = resp.entity.filter((item) => {
          if (item && item.marked != 1) {
            return item;
          }
        });
        this.favoriteShots = entity;
      })
      .catch((error) => {
        this.favoriteShots = null;
      });
  }

  async addShotToStarList(shotId: any) {
    let isActionSuccess = false;
    let errorMessage = "Operation failed.";
    await this.dashboardService
      .addShotToStarList(shotId)
      .toPromise()
      .then((resp) => {
        isActionSuccess = true;
        this.getStarShots();
      })
      .catch((error) => {
        let errorDetails = this.helperService.getErrorDetails(error);
        if (errorDetails !== "") {
          errorMessage = `<b>${errorMessage}</b>` + errorDetails;
        }
      });
    if (isActionSuccess) {
      this.showNotification({
        type: "success",
        title: "Success",
        content: "Operation successful.",
        duration: AppConstants.NOTIFICATION_DURATION,
      });
    } else {
      this.showNotification({
        type: "error",
        title: "Error",
        content: errorMessage,
        duration: AppConstants.NOTIFICATION_DURATION,
      });
    }
    this.starShotId = null;
  }

  async removeShotFromStarList(shotId: any) {
    let isActionSuccess = false;
    let errorMessage = "Operation failed.";
    await this.dashboardService
      .removeShotFromStarList(shotId)
      .toPromise()
      .then((resp) => {
        isActionSuccess = true;
        this.getStarShots();
      })
      .catch((error) => {
        let errorDetails = this.helperService.getErrorDetails(error);
        if (errorDetails !== "") {
          errorMessage = `<b>${errorMessage}</b>` + errorDetails;
        }
      });
    if (isActionSuccess) {
      this.showNotification({
        type: "success",
        title: "Success",
        content: "Operation successful.",
        duration: AppConstants.NOTIFICATION_DURATION,
      });
    } else {
      this.showNotification({
        type: "error",
        title: "Error",
        content: errorMessage,
        duration: AppConstants.NOTIFICATION_DURATION,
      });
    }
  }
}
