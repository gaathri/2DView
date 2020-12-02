import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { StudioDashboardService } from "src/app/modules/system/dashboards/studio-dashboard.service";
import { Page } from "../../model/page";
import { ArtistDashboardService } from "src/app/modules/system/dashboards/artist-dashboard.service";
import { TasksService } from "src/app/modules/system/shows/tasks.service";
import { AppConstants } from "src/app/constants/AppConstants";

@Component({
  selector: "app-activity-log-panel",
  templateUrl: "./activity-log-panel.component.html",
  styleUrls: ["./activity-log-panel.component.scss"],
})
export class ActivityLogPanelComponent implements OnInit {
  @Input() panelHeight: any;
  @Input() parent: any;
  @Input() taskId: any;

  isDataEmpty: boolean;
  activityLogs: any;

  isDataReady: boolean;
  isLoading: boolean;
  windowHeight: any;
  itemsCount: any;
  pageNumber: any;
  page = new Page();
  macroMap: any;
  macroArr: any;

  constructor(
    private helperService: HelperService,
    private sutdioDashboardService: StudioDashboardService,
    private artistDashboardService: ArtistDashboardService,
    private tasksService: TasksService
  ) {}

  ngOnInit() {
    this.macroArr = [
      "USER_NAME",
      "ENTITY_NAME",
      "ASSIGNED_USER_NAME",
      "STATUS",
      "PUBLISHED_VERSION",
      "FEEDBACK_DETAILS",
      "COMMENT_DETAILS",
    ];
    this.macroMap = {
      USER_NAME: {
        key: "userName",
        className: "n-user",
      },
      ENTITY_NAME: {
        key: "entityName",
        className: "n-entity",
      },
      ASSIGNED_USER_NAME: {
        key: "assignedUserName",
        className: "n-user",
      },
      STATUS: {
        key: "statusName",
        className: "n-user",
      },
      PUBLISHED_VERSION: {
        key: "versionName",
        className: "n-entity",
      },
      FEEDBACK_DETAILS: {
        key: "feedbackDetails",
        className: "n-entity",
      },
      COMMENT_DETAILS: {
        key: "commentDetails",
        className: "n-entity",
      },
    };
    this.pageNumber = 0;
    this.getActivityLogs();
  }

  onPageIndexChange(event: any) {
    this.pageNumber = event - 1;
    this.getActivityLogs();
  }

  async getActivityLogs() {
    let availHeight = this.panelHeight - 150;
    let itemHeight = 70;
    if (this.parent == "task") {
      itemHeight = 75;
    }
    this.itemsCount = Math.floor(availHeight / itemHeight);
    this.page.pageNumber = this.pageNumber;
    this.page.size = this.itemsCount;
    this.isLoading = true;
    if (this.parent === "artist") {
      await this.artistDashboardService
        .getActivityLogs(this.page)
        .toPromise()
        .then((resp) => {
          this.activityLogs = resp.coll;
          this.page.totalElements = resp.total;
          this.page.totalPages = Math.ceil(resp.total / this.page.size);
        })
        .catch((error) => {
          this.activityLogs = null;
        });
      if (this.activityLogs && this.activityLogs.length > 0) {
        this.isDataEmpty = false;
      } else {
        this.isDataEmpty = true;
      }
    } else if (this.parent === "studio") {
      await this.sutdioDashboardService
        .getActivityLogs(this.page)
        .toPromise()
        .then((resp) => {
          if (resp && resp.valid) {
            this.activityLogs = resp.coll;
            this.page.totalElements = resp.total;
            this.page.totalPages = Math.ceil(resp.total / this.page.size);
          }
        })
        .catch((error) => {
          this.activityLogs = null;
        });
      if (this.activityLogs && this.activityLogs.length > 0) {
        this.isDataEmpty = false;
      } else {
        this.isDataEmpty = true;
      }
    } else if (this.parent === "task") {
      await this.tasksService
        .getActivityLogs(this.page, this.taskId)
        .toPromise()
        .then((resp) => {
          if (resp && resp.valid) {
            this.activityLogs = resp.coll;
            this.page.totalElements = resp.total;
            this.page.totalPages = Math.ceil(resp.total / this.page.size);
          }
        })
        .catch((error) => {
          this.activityLogs = null;
        });
      if (this.activityLogs && this.activityLogs.length > 0) {
        this.isDataEmpty = false;
      } else {
        this.isDataEmpty = true;
      }
    }

    this.isLoading = false;
  }

  getLogType(item: any) {
    let logType = "";
    if (item.eventType === "WORK_STATUS" || item.eventType === "STATUS") {
      logType = "status_change";
    } else if (item.eventType === "ASSIGNED") {
      logType = "assign";
    }
    return logType;
  }

  getTitle(item: any) {
    try {
      if (this.getLogType(item) === "status_change") {
        return `${
          item.userName
        } changed status of ${item.entityType.toLowerCase()} ${
          item.entityName
        } to ${item.eventDetail}`;
      } else if (this.getLogType(item) === "assign") {
        return `${item.userName} assigned ${item.entityType.toLowerCase()} ${
          item.entityName
        } to ${item.eventDetail}`;
      }
    } catch (e) {
      return "";
    }
  }

  get12Format(item: any) {
    if (item && item.time) {
      let time = item.time;
      return this.helperService.convertFrom24To12Format(time);
    }
    return "";
  }

  displayDate(item: any) {
    if (item && item.logTime) {
      let logTime = item.logTime;
      return this.getDisplayDate(logTime.split(" ")[0]);
    }
    return "";
  }

  getDisplayDate(date: any) {
    return this.helperService.transformDate(
      date,
      AppConstants.DISPLAY_DATE_FORMAT
    );
  }

  refreshHandler() {
    this.pageNumber = 0;
    this.getActivityLogs();
  }

  getInfo(data: any) {
    let info = "";
    for (let i in data) {
      info += "<div>" + i + " : " + data[i] + "</div>";
    }
    return info;
  }

  getSpanInfo(data: any) {
    let info = "";
    for (let i in data) {
      if (i === "displayName") {
        info += "<span class='n-entity'>" + data[i] + "&nbsp;</span>";
      } else if (i === "oldValue") {
        info +=
          "<span>&nbsp;OLD : </span><span class='n-user'>" +
          data[i] +
          "</span>";
      } else if (i === "newValue") {
        info +=
          "<span>&nbsp;NEW : </span><span class='n-user'>" +
          data[i] +
          "</span>";
      }
      //info += "<span class='n-entity'>" + i + " : " + data[i] + "</span>";
    }
    return info;
  }

  getToolip(item: any) {
    let data = [];
    let data1 = [
      {
        displayName: "Client Bid",
        oldValue: "1353.00",
        newValue: "13",
      },
      {
        displayName: "Delta",
        oldValue: "0.00",
        newValue: "2",
      },
      {
        displayName: "Start Date",
        oldValue: "2020-08-18",
        newValue: "2020-08-17",
      },
      {
        displayName: "End Date",
        oldValue: "2020-08-23",
        newValue: "2020-08-26",
      },
      {
        displayName: "Client ETA",
        oldValue: "2020-08-20",
      },
      {
        displayName: "Delivery Date",
        oldValue: "2020-08-22",
      },
    ];

    if (item && item.eventDetail) {
      data = JSON.parse(item.eventDetail);
    }
    if (this.helperService.isValidArr(data)) {
      return data;
    }
    return [];
  }

  isValidArr(arr) {
    return this.helperService.isValidArr(arr);
  }

  getMsg(data: any, isRich: any) {
    let msg = "";
    try {
      if (
        data &&
        data.activityLogDetailVo &&
        data.activityLogDetailVo.message
      ) {
        msg = data.activityLogDetailVo.message;
        if (isRich) {
          msg = this.replaceMacros(data, msg) + "<br>";
          /*if (this.parent === "task") {
            if (data.showName) {
              msg +=
                "<span>&nbsp;&nbsp;</span><span class='n-entity'>Show Name : </span>" +
                data.showName;
            }
            if (data.activityLogDetailVo.assetName) {
              msg +=
                "<span>&nbsp;&nbsp;</span><span class='n-entity'>Asset Name : </span>" +
                data.activityLogDetailVo.assetName;
            }
            if (data.activityLogDetailVo.shotCode) {
              msg +=
                "<span>&nbsp;&nbsp;</span><span class='n-entity'>Shot Code : </span>" +
                data.activityLogDetailVo.shotCode;
            }
          }*/
          let toolTipArr = this.getToolip(data);
          let privilegeId = this.helperService.getPrivilegeId();
          if (this.parent === "task") {
            if (
              privilegeId != AppConstants.ARTIST_PRIVILEGE_ID &&
              privilegeId != AppConstants.IO_PRIVILEGE_ID
            ) {
              if (this.isValidArr(toolTipArr)) {
                let tipmsg = "";
                for (let i = 0; i < toolTipArr.length; i++) {
                  tipmsg += this.getSpanInfo(toolTipArr[i]);
                  if (i != toolTipArr.length - 1) {
                    tipmsg += " | ";
                  }
                }
                msg += tipmsg;
              }
            }
          }
        } else {
          msg = this.replaceMacros2(data, msg);

          if (data.showName) {
            msg += "\nShow Name : " + data.showName;
          }
          if (data.activityLogDetailVo.assetName) {
            msg += "\nAsset Name : " + data.activityLogDetailVo.assetName;
          }
          if (data.activityLogDetailVo.shotCode) {
            msg += "\nShot Code : " + data.activityLogDetailVo.shotCode;
          }
        }
      }
    } catch (e) {}
    return msg;
  }

  replaceMacros2(data: any, _msg: string) {
    let msg = _msg;
    let macroInfo = null;
    let macroKey = null;
    let macroStr = null;
    let replaceMacro = null;
    let macroValue = "";
    for (let i = 0; i < this.macroArr.length; i++) {
      macroKey = this.macroArr[i];
      macroInfo = this.macroMap[this.macroArr[i]];
      macroStr = `<${macroKey}>`;
      replaceMacro = macroStr;
      if (msg.indexOf(macroStr) > -1) {
        msg = msg.split(macroStr).join(replaceMacro);
        if (data.activityLogDetailVo[macroInfo.key]) {
          macroValue = data.activityLogDetailVo[macroInfo.key];
        }
        msg = msg.split(macroStr).join(macroValue);
      }
    }
    return msg;
  }

  replaceMacros(data: any, _msg: string) {
    let msg = _msg;
    let macroInfo = null;
    let macroKey = null;
    let macroStr = null;
    let replaceMacro = null;
    let macroValue = "";
    for (let i = 0; i < this.macroArr.length; i++) {
      macroKey = this.macroArr[i];
      macroInfo = this.macroMap[this.macroArr[i]];
      macroStr = `<${macroKey}>`;
      replaceMacro = `<span class='${macroInfo.className}'>${macroStr}</span>`;
      if (msg.indexOf(macroStr) > -1) {
        msg = msg.split(macroStr).join(replaceMacro);
        if (data.activityLogDetailVo[macroInfo.key]) {
          macroValue = data.activityLogDetailVo[macroInfo.key];
        }
        msg = msg.split(macroStr).join(macroValue);
      }
    }
    return msg;
  }
}
