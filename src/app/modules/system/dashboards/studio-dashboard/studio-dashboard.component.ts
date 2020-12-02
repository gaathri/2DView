import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { StudioDashboardService } from "../studio-dashboard.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { AppConstants } from "src/app/constants/AppConstants";

@Component({
  selector: "app-studio-dashboard",
  templateUrl: "./studio-dashboard.component.html",
  styleUrls: ["./studio-dashboard.component.scss"],
})
export class StudioDashboardComponent implements OnInit {
  @Input() starStatus: any;
  @Input() overallStatus: any;
  @Input() overallAssetStatus: any;
  @Input() overallTaskStatus: any;
  @Input() starUserStatus: any;
  @Input() progressType: any;

  @ViewChild("activityLogPanel", { static: false }) activityLogPanel: any;
  isDataReady: boolean;
  activityLogs: any;
  activityEntities: any;

  overallShotProgress: any;
  progressEntities: any;

  overallAssetProgress: any;
  assetProgressEntities: any;

  overallTaskProgress;
  taskProgressEntities: any;

  starShows: any;
  favoriteShows: any;
  starShowEntities: any;
  starShowId: any;
  selectedStarShow: any;
  shotProgressByShow: any;
  shotProgressEntities: any;

  starSupervisors: any;
  favoriteSupervisors: any;
  starSupervisorEntities: any;
  starSupervisorId: any;
  selectedStarSupervisor: any;
  shotProgressBySupervisor: any;
  shotProgressEntitiesBySupervisor: any;
  addType: any;
  isVisible: boolean;
  modalTitle: any;
  STAR_TYPE = {
    SHOW: "Show",
    SUPERVISOR: "Supervisor",
  };

  manpowerEntity: any;
  artistAvailability: any;
  panelHeight = 0;

  constructor(
    private dashboardService: StudioDashboardService,
    private helperService: HelperService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.prepareData();
  }

  async prepareData() {
    await this.getManpowerDetails();
    await this.getArtistAvailability();
    await this.getOverallShotProgress();
    await this.getOverallAssetProgress();
    await this.getOverallTaskProgress();
    //await this.getActivityLogs();
    await this.getStarShows();
    await this.getStarSupervisors();
    this.isDataReady = true;
    setTimeout(() => {
      this.panelHeight = document.getElementsByClassName(
        "dashboard-right"
      )[0].clientHeight;
    }, 200);
  }

  frameStarEntities() {
    this.starShowEntities = {
      title: "Star Shows",
      items: this.starShows,
      titleKey: "showName",
    };
  }

  frameSupervisorStarEntities() {
    this.starSupervisorEntities = {
      title: "Star Users",
      items: this.starSupervisors,
      titleKey: "firstName",
    };
  }

  updateOverallStatus(overallStatus: any) {
    this.overallStatus = overallStatus;
    this.frameProgressEntities();
  }

  updateOverallAssetStatus(overallAssetStatus: any) {
    this.overallAssetStatus = overallAssetStatus;
    this.frameAssetProgressEntities();
  }

  updateOverallTaskStatus(overallTaskStatus: any) {
    this.overallTaskStatus = overallTaskStatus;
    this.frameTaskProgressEntities();
  }

  updateStarStatus(starStatus: any) {
    this.starStatus = starStatus;
    this.frameShotProgressEntities();
  }
  updateStarUserStatus(starUserStatus: any) {
    this.starUserStatus = starUserStatus;
    this.frameSupervisorShotProgressEntities();
  }
  frameProgressEntities() {
    let items = [];
    for (let i = 0; i < this.overallStatus.length; i++) {
      let item = this.helperService.findObjectInArrayByKey(
        this.overallShotProgress,
        "name",
        this.overallStatus[i]["name"]
      );
      if (item) {
        item.code = this.overallStatus[i]["code"];
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
      title: "Shot Progress",
      items: items,
    };
  }

  frameAssetProgressEntities() {
    let items = [];
    for (let i = 0; i < this.overallAssetStatus.length; i++) {
      let item = this.helperService.findObjectInArrayByKey(
        this.overallAssetProgress,
        "name",
        this.overallAssetStatus[i]["name"]
      );
      if (item) {
        item.code = this.overallAssetStatus[i]["code"];
        items.push(item);
      } else {
        item = {
          name: this.overallAssetStatus[i]["name"],
          code: this.overallAssetStatus[i]["code"],
          value: 0,
          per: 0,
        };
        items.push(item);
      }
    }
    this.assetProgressEntities = {
      title: "Asset Progress",
      items: items,
    };
  }

  frameTaskProgressEntities() {
    let items = [];
    for (let i = 0; i < this.overallTaskStatus.length; i++) {
      let item = this.helperService.findObjectInArrayByKey(
        this.overallTaskProgress,
        "name",
        this.overallTaskStatus[i]["name"]
      );
      if (item) {
        item.code = this.overallTaskStatus[i]["code"];
        items.push(item);
      } else {
        item = {
          name: this.overallTaskStatus[i]["name"],
          code: this.overallTaskStatus[i]["code"],
          value: 0,
          per: 0,
        };
        items.push(item);
      }
    }
    this.taskProgressEntities = {
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

  frameShotProgressEntities() {
    let items = [];
    for (let i = 0; i < this.starStatus.length; i++) {
      let item = this.helperService.findObjectInArrayByKey(
        this.shotProgressByShow,
        "name",
        this.starStatus[i]["name"]
      );
      if (item) {
        item.code = this.starStatus[i]["code"];
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
    this.shotProgressEntities = {
      subTitle: "Shots",
      title:
        this.selectedStarShow && this.selectedStarShow.showName
          ? this.selectedStarShow.showName
          : "",
      items: items,
    };
  }

  frameSupervisorShotProgressEntities() {
    let items = [];
    for (let i = 0; i < this.starUserStatus.length; i++) {
      let item = null;
      if (
        this.shotProgressBySupervisor &&
        this.shotProgressBySupervisor.workStatusCount
      ) {
        item = this.helperService.findObjectInArrayByKey(
          this.shotProgressBySupervisor.workStatusCount,
          "name",
          this.starUserStatus[i]["name"]
        );
      }
      if (item) {
        item.code = this.starUserStatus[i]["code"];
        items.push(item);
      } else {
        item = {
          name: this.starUserStatus[i]["name"],
          code: this.starUserStatus[i]["code"],
          value: 0,
          per: 0,
        };
        items.push(item);
      }
    }
    this.shotProgressEntitiesBySupervisor = {
      subTitle: "Shots",
      title: this.getSupervisorName(this.selectedStarSupervisor),
      items: items,
      activeShows: this.shotProgressBySupervisor.activeShows,
      handlingArtist: this.shotProgressBySupervisor.handlingArtist,
    };
  }

  getSupervisorName(supervisor: any) {
    let name = "";
    if (supervisor && supervisor.firstName) {
      name += supervisor.firstName + " ";
    }
    if (supervisor && supervisor.lastName) {
      name += supervisor.lastName;
    }
    return name;
  }

  /*refreshActivityLogs() {
    this.getActivityLogs();
  }*/

  starAdd(type: any) {
    this.modalTitle = `Add ${type}`;
    this.addType = type;
    this.isVisible = true;
    if (type == this.STAR_TYPE.SHOW) {
      this.getFavoriteShows();
    } else if (type == this.STAR_TYPE.SUPERVISOR) {
      this.getFavoriteSupervisors();
    }
  }

  starSelect(item: any, type: any) {
    if (type == this.STAR_TYPE.SHOW) {
      this.selectedStarShow = item;
      this.getShotProgressByShow(item.id);
    } else if (type == this.STAR_TYPE.SUPERVISOR) {
      this.selectedStarSupervisor = item;
      this.getShotProgressBySupervisor(item.id);
    }
  }

  starClose(item: any, type: any) {
    if (type == this.STAR_TYPE.SHOW) {
      this.removeShowFromStarList(item.id);
    } else if (type == this.STAR_TYPE.SUPERVISOR) {
      this.removeSupervisorFromStarList(item.id);
    }
  }

  onConfirm() {
    if (this.addType == this.STAR_TYPE.SHOW) {
      if (this.starShowId) {
        this.addShowToStarList(this.starShowId);
      }
    } else if (this.addType == this.STAR_TYPE.SUPERVISOR) {
      if (this.starSupervisorId) {
        this.addSupervisorToStarList(this.starSupervisorId);
      }
    }
    this.isVisible = false;
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

  async getManpowerDetails() {
    await this.dashboardService
      .getManpowerDetails()
      .toPromise()
      .then((resp) => {
        //resp = { "entity": { "data": { "LAST_WEEK": { "data": [["2020-02-10", "Track", 8.0000], ["2020-02-11", "Track", 2.0000], ["2020-02-12", "Track", 2.5000], ["2020-02-13", "Track", 3.5000], ["2020-02-14", "2D", 4.0000], ["2020-02-14", "3d", 7.0000], ["2020-02-14", "Asset", 5.0000], ["2020-02-14", "Digital Env", 4.0000], ["2020-02-14", "Edit", 8.0000], ["2020-02-14", "Track", 6.0000]], "startDate": "2020-02-10", "endDate": "2020-02-16", "days": 6 }, "LAST_7_DAYS": { "data": [["2020-02-11", "Track", 2.0000], ["2020-02-12", "Track", 2.5000], ["2020-02-13", "Track", 3.5000], ["2020-02-14", "2D", 4.0000], ["2020-02-14", "3d", 7.0000], ["2020-02-14", "Asset", 5.0000], ["2020-02-14", "Digital Env", 4.0000], ["2020-02-14", "Edit", 8.0000], ["2020-02-14", "Track", 6.0000], ["2020-02-17", "Track", 2.2000]], "startDate": "2020-02-11", "endDate": "2020-02-18", "days": 7 }, "LAST_MONTH": { "data": [["2020-01-02", "Digital Env", 4.0000], ["2020-01-22", "Digital Env", 4.0000], ["2020-01-25", "Digital Env", 4.0000], ["2020-01-25", "Edit", 4.0000]], "startDate": "2020-01-01", "endDate": "2020-01-31", "days": 30 }, "CURRENT_MONTH": { "data": [["2020-02-01", "Edit", 6.0000], ["2020-02-01", "Track", 8.0000], ["2020-02-02", "Track", 8.0000], ["2020-02-03", "Edit", 6.0000], ["2020-02-04", "Edit", 6.0000], ["2020-02-04", "Track", 3.0000], ["2020-02-05", "Track", 3.0000], ["2020-02-06", "Track", 8.0000], ["2020-02-07", "Track", 3.0000], ["2020-02-10", "Track", 8.0000], ["2020-02-11", "Track", 2.0000], ["2020-02-12", "Track", 2.5000], ["2020-02-13", "Track", 3.5000], ["2020-02-14", "2D", 4.0000], ["2020-02-14", "3d", 7.0000], ["2020-02-14", "Asset", 5.0000], ["2020-02-14", "Digital Env", 4.0000], ["2020-02-14", "Edit", 8.0000], ["2020-02-14", "Track", 6.0000], ["2020-02-17", "Track", 2.2000]], "startDate": "2020-02-01", "endDate": "2020-02-18", "days": 17 } } }, "errorProperties": [], "httpStatus": "OK", "errMsg": "", "total": 1, "valid": true };
        //resp = { "entity": { "data": { "LAST_WEEK": { "startDate": "2020-02-10", "endDate": "2020-02-16", "days": 6 }, "LAST_7_DAYS": { "data": [["2020-02-17", "2D", 1.9464], ["2020-02-17", "3d", 1.9607], ["2020-02-17", "Art", 1.9971], ["2020-02-17", "Asset", 2.0286], ["2020-02-17", "Digital Env", 1.9800], ["2020-02-17", "Edit", 2.0373], ["2020-02-17", "Track", 1.9673], ["2020-02-17", "VIZ", 2.0031], ["2020-02-18", "2D", 1.9670], ["2020-02-18", "3d", 1.9607], ["2020-02-18", "Art", 2.0086], ["2020-02-18", "Asset", 2.0443], ["2020-02-18", "Digital Env", 2.0275], ["2020-02-18", "Edit", 2.0000], ["2020-02-18", "Track", 2.0049], ["2020-02-18", "VIZ", 2.0248]], "startDate": "2020-02-12", "endDate": "2020-02-19", "days": 7 }, "LAST_MONTH": { "startDate": "2020-01-01", "endDate": "2020-01-31", "days": 30 }, "CURRENT_MONTH": { "data": [["2020-02-17", "2D", 1.9464], ["2020-02-17", "3d", 1.9607], ["2020-02-17", "Art", 1.9971], ["2020-02-17", "Asset", 2.0286], ["2020-02-17", "Digital Env", 1.9800], ["2020-02-17", "Edit", 2.0373], ["2020-02-17", "Track", 1.9673], ["2020-02-17", "VIZ", 2.0031], ["2020-02-18", "2D", 1.9670], ["2020-02-18", "3d", 1.9607], ["2020-02-18", "Art", 2.0086], ["2020-02-18", "Asset", 2.0443], ["2020-02-18", "Digital Env", 2.0275], ["2020-02-18", "Edit", 2.0000], ["2020-02-18", "Track", 2.0049], ["2020-02-18", "VIZ", 2.0248]], "startDate": "2020-02-01", "endDate": "2020-02-18", "days": 17 } } }, "errorProperties": [], "httpStatus": "OK", "errMsg": "", "total": 1, "valid": true };
        this.manpowerEntity = resp.entity;
      })
      .catch((error) => {
        this.manpowerEntity = null;
      });
  }

  async getArtistAvailability() {
    await this.dashboardService
      .getArtistAvailability()
      .toPromise()
      .then((resp) => {
        this.artistAvailability = resp.entity;
      })
      .catch((error) => {
        this.artistAvailability = null;
      });
  }

  async getOverallShotProgress() {
    await this.dashboardService
      .getOverallShotProgress()
      .toPromise()
      .then((resp) => {
        this.overallShotProgress = resp.entity;
        this.frameProgressEntities();
      })
      .catch((error) => {
        this.overallShotProgress = null;
      });
  }

  async getOverallAssetProgress() {
    await this.dashboardService
      .getOverallAssetProgress()
      .toPromise()
      .then((resp) => {
        this.overallAssetProgress = resp.entity;
        this.frameAssetProgressEntities();
      })
      .catch((error) => {
        this.overallAssetProgress = null;
      });
  }
  async getOverallTaskProgress() {
    await this.dashboardService
      .getOverallTaskProgress()
      .toPromise()
      .then((resp) => {
        this.overallTaskProgress = resp.entity;
        this.frameTaskProgressEntities();
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

  async getShotProgressByShow(showId: any) {
    await this.dashboardService
      .getShotProgressByShow(showId)
      .toPromise()
      .then((resp) => {
        this.shotProgressByShow = resp.entity;
        this.frameShotProgressEntities();
      })
      .catch((error) => {
        this.shotProgressByShow = null;
      });
  }

  async getShotProgressBySupervisor(id: any) {
    await this.dashboardService
      .getShotProgressBySupervisor(id)
      .toPromise()
      .then((resp) => {
        //resp = { "entity": { "workStatusCount": [{ "name": "Offline", "value": 8, "per": 25.8065 }, { "name": "Online", "value": 2, "per": 6.4516 }, { "name": "Omit", "value": 4, "per": 12.9032 }, { "name": "On hold", "value": 5, "per": 16.129 }, { "name": "Not Started", "value": 4, "per": 12.9032 }, { "name": "WIP", "value": 5, "per": 16.129 }, { "name": "Approved", "value": 3, "per": 9.6774 }], "activeShows": 1, "handlingArtist": 7 }, "errorProperties": [], "httpStatus": "OK", "errMsg": "", "total": 1, "valid": true };
        this.shotProgressBySupervisor = resp.entity;
        this.frameSupervisorShotProgressEntities();
      })
      .catch((error) => {
        this.shotProgressByShow = null;
      });
  }

  async getStarShows() {
    await this.dashboardService
      .getStarShows()
      .toPromise()
      .then((resp) => {
        this.starShows = resp.entity;
      })
      .catch((error) => {
        this.starShows = null;
      });
    this.frameStarEntities();
  }

  async getStarSupervisors() {
    await this.dashboardService
      .getStarSupervisors()
      .toPromise()
      .then((resp) => {
        this.starSupervisors = resp.entity;
      })
      .catch((error) => {
        this.starSupervisors = null;
      });
    this.frameSupervisorStarEntities();
  }

  async getFavoriteShows() {
    await this.dashboardService
      .getFavoriteShows()
      .toPromise()
      .then((resp) => {
        let entity = resp.entity.filter((item) => {
          if (item && item.marked != 1) {
            return item;
          }
        });
        this.favoriteShows = entity;
      })
      .catch((error) => {
        this.favoriteShows = null;
      });
  }

  async getFavoriteSupervisors() {
    await this.dashboardService
      .getFavoriteSupervisors()
      .toPromise()
      .then((resp) => {
        let entity = resp.entity.filter((item) => {
          if (item && item.marked != 1) {
            return item;
          }
        });
        this.favoriteSupervisors = entity;
      })
      .catch((error) => {
        this.favoriteSupervisors = null;
      });
  }

  async addShowToStarList(showId: any) {
    let isActionSuccess = false;
    let errorMessage = "Operation failed.";
    await this.dashboardService
      .addShowToStarList(showId)
      .toPromise()
      .then((resp) => {
        isActionSuccess = true;
        this.getStarShows();
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
    this.starShowId = null;
  }

  async addSupervisorToStarList(id: any) {
    let isActionSuccess = false;
    let errorMessage = "Operation failed.";
    await this.dashboardService
      .addSupervisorToStarList(id)
      .toPromise()
      .then((resp) => {
        isActionSuccess = true;
        this.getStarSupervisors();
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
    this.starSupervisorId = null;
  }

  async removeShowFromStarList(showId: any) {
    let isActionSuccess = false;
    let errorMessage = "Operation failed.";
    await this.dashboardService
      .removeShowFromStarList(showId)
      .toPromise()
      .then((resp) => {
        isActionSuccess = true;
        this.getStarShows();
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

  async removeSupervisorFromStarList(id: any) {
    let isActionSuccess = false;
    let errorMessage = "Operation failed.";
    await this.dashboardService
      .removeSupervisorFromStarList(id)
      .toPromise()
      .then((resp) => {
        isActionSuccess = true;
        this.getStarSupervisors();
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
