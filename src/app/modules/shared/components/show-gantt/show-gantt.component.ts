import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
  Input,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import CalendarScroll from "src/assets/js/CalendarScroll.plugin.js";
import ItemMovement from "src/assets/js/ItemMovement.plugin.js";
import WeekendHighlight from "src/assets/js/WeekendHighlight.plugin.js";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import addYears from "date-fns/addYears";
import subYears from "date-fns/subYears";
import startOfDay from "date-fns/startOfDay";
import endOfDay from "date-fns/endOfDay";
import format from "date-fns/format";

import { TasksService } from "src/app/modules/system/shows/tasks.service";
import { TasktypesService } from "src/app/modules/system/configs/tasktypes.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { differenceInDays } from "date-fns";
import { Router } from "@angular/router";
import { ShowsService } from "src/app/modules/system/shows/shows.service";
import { ShotsService } from "src/app/modules/system/shows/shots.service";
import { AssetsService } from "src/app/modules/system/shows/assets.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { NotificationService } from "src/app/modules/core/services/notification.service";

export class ShowObj {
  id = 0;
  name = "";
  shotObj = {};
  assetObj = {};
}

export class ShotObj {
  id = 0;
  name = "";
  taskArr = [];
}

export class AssetObj {
  id = 0;
  name = "";
  taskArr = [];
}

export class DepartmentObj {
  id = 0;
  name = "";
  resourceArr = [];
}

export class ResourceObj {
  id = 0;
  firstName = "";
  lastName = "";
  taskArr = [];
  leaveArr = [];
}

export class LeaveObj {
  id = 0;
  name = "";
  reason = "";
}

export class TaskObj {
  id = 0;
  name = "";
  startDate = 0;
  endDate = 0;
  days = 0;
  artist = "";
  taskType = "";
  status = "";
  taskColorCode = "";
  statusColorCode = "";
  completionPercentage = "0%";
}

declare function showToolTip(elem, evt, info): any;
declare function hideToolTip(): any;

@Component({
  selector: "app-show-gantt",
  templateUrl: "./show-gantt.component.html",
  styleUrls: ["./show-gantt.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ShowGanttComponent implements OnInit, OnDestroy {
  @ViewChild("scheduler", { static: false }) scheduler;

  disabled = false;
  value1 = 100;

  config: any;
  gstcState: any;
  ganttType: any = "show";

  rows = {};
  items = {};
  originalItems;
  dataArr = new Object();
  moveableArr = [];
  itemTimeout: any;
  t0;
  t1;

  //---[Changes Hariharan]---//
  @Input("") type: any = "shot";
  isEmptyData: boolean;
  shows: any;
  showId: any;
  shots: any;
  shotIds: any;
  assets: any;
  assetIds: any;
  isDataReady;
  period: any = "day";
  @Input("") filterParams;
  weekEnds = [];
  wHeight = 800;
  //---[Changes Hariharan]---//

  constructor(
    private http: HttpClient,
    private showsService: ShowsService,
    private shotsService: ShotsService,
    private assetsService: AssetsService,
    private tasksService: TasksService,
    private tasktypeService: TasktypesService,
    private router: Router,
    private helperService: HelperService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.prepareData();
  }

  ngOnDestroy() {
    hideToolTip();
  }

  getHeight() {
    if (window.innerHeight) {
      this.wHeight = window.innerHeight - 60 - 20 - 40 - 20 - 30;
      // top header - 60
      // top padding - 20
      // gantt header - 40
      // bottom padding - 20
      // footer - 30
    }
    return this.wHeight;
  }

  onSlider(e) {
    //if (e > 0) {
    this.gstcState.update("config.list.columns.percent", +e);
    //}
  }

  onZoomSlider(e) {
    //if (e > 0) {
    this.gstcState.update("config.chart.time.zoom", +e);
    //}
  }

  initChart() {
    this.t0 = performance.now();
    // this.ganttType = 'resource';
    //this.ganttType = "show";
    this.config = {
      plugins: this.getPlugin(),
      height: this.getHeight(),
      headerHeight: 72,
      list: {
        rows: this.rows,
        columns: this.getColumn(),
        expander: this.getExpanderConfig(),
      },
      chart: {
        time: {
          zoom: 21,
        },
        items: this.dummyItemConfig(),
      },
      actions: {
        "list-column-row": [
          (a1, a2) => {
            this.clickAction(a1, a2);
          },
        ],
        "list-column-row-expander-toggle": [this.clickActionToggle],
        "chart-timeline-items-row-item": [this.hoverAction],
      },
    };
    this.chartData(this.type);
  }

  changeDataType(type) {
    this.resetData();
    if (this.ganttType === "show") {
      if (type === "shot") {
        this.chartData("shot");
      } else if (type === "asset") {
        this.chartData("asset");
      }
    } else if (type === "resource") {
      this.chartData("resource");
    }
  }

  resetData() {
    this.rows = null;
    this.items = null;
    this.dataArr = null;
    while (this.moveableArr.length > 0) {
      this.moveableArr.pop();
    }
    this.moveableArr = [];
    this.rows = {};
    this.items = {};
    this.dataArr = new Object();
    this.originalItems = "";
  }

  hoverAction = (element, data) => {
    function toolTipEnter(event: any) {
      event.stopPropagation();
      event.preventDefault();
      showToolTip(element, event, data.item.details);
    }
    function toolTipLeave(event: any) {
      event.stopPropagation();
      event.preventDefault();
      hideToolTip();
    }
    element.addEventListener("mouseenter", toolTipEnter);
    element.addEventListener("mouseleave", toolTipLeave);
    return {
      update(element, newData) {
        data = newData;
      },
      destroy(element, data) {
        element.removeEventListener("mouseenter", toolTipEnter);
        element.removeEventListener("mouseleave", toolTipLeave);
      },
    };
  };

  clickActionToggle(element, data) {
    function onClick(event: any) {
      event.stopPropagation();
      event.preventDefault();
    }
    element.addEventListener("click", onClick);
    return {
      update(element, newData) {
        data = newData;
      },
      destroy(element, data) {
        element.removeEventListener("click", onClick);
      },
    };
  }

  clickAction(element, data) {
    /*function onClick(event: any) {      
      alert(`Event ${data.rowId} clicked!`);
      this.handleClick(data.rowId);
    }*/
    //element.addEventListener("click", this.onClick.bind(this));
    this.onClick = this.onClick.bind(this);
    element.addEventListener("click", this.onClick);
    element.data = data;
    return {
      update(element, newData) {
        data = newData;
      },
      destroy(element, data) {
        element.removeEventListener("click", this.onClick);
      },
    };
  }

  onClick(event: any) {
    let data = event.currentTarget.data;
    //alert(`Event ${data.rowId} clicked!`);
    this.handleClick(data.rowId);
  }

  handleClick(entityType) {
    if (entityType) {
      let entityArr = entityType.split("~");
      if (entityArr && entityArr.length > 0) {
        let routerLink = "";
        if (entityArr.length === 1) {
          let showId = entityArr[0].split("_")[1];
          routerLink = `/system/listing/shows/${showId}`;
        } else if (entityArr.length === 2) {
          routerLink = this.getLink(entityArr);
        } else if (entityArr.length === 3) {
          routerLink = this.getLink(entityArr);
          let taskId = entityArr[2].split("_")[1];
          routerLink += `/tasks/${taskId}`;
        }
        if (routerLink !== "") {
          this.router.navigate([routerLink]);
        }
      }
      /*//return;
      let routerLink = "";
      if (entityArr[0] === "show") {
        routerLink = `/system/listing/shows/${entityArr[1]}`;
      } else if (entityArr[0] === "shot") {
        routerLink = `/system/listing/shows/${entityArr[1]}/shots/${entityArr[2]}`;
      } else if (entityArr[0] === "asset") {
        routerLink = `/system/listing/shows/${entityArr[1]}/assets/${entityArr[2]}`;
      } else if (entityArr[0] === "shottask") {
        routerLink = `/system/listing/shows/${entityArr[1]}/shots/${entityArr[2]}/tasks/${entityArr[3]}`;
      } else if (entityArr[0] === "assettask") {
        routerLink = `/system/listing/shows/${entityArr[1]}/assets/${entityArr[2]}/tasks/${entityArr[3]}`;
      }
      if (routerLink !== "") {
        this.router.navigate([routerLink]);
      }*/
    }
  }

  getLink(entityArr) {
    let routerLink = "";
    let showId = entityArr[0].split("_")[1];
    routerLink = `/system/listing/shows/${showId}`;
    if (entityArr[1].indexOf("shot") > -1) {
      let shotId = entityArr[1].split("_")[1];
      routerLink += `/shots/${shotId}`;
    } else if (entityArr[1].indexOf("asset") > -1) {
      let assetId = entityArr[1].split("_")[1];
      routerLink += `/assets/${assetId}`;
    }
    return routerLink;
  }

  async chartData(type) {
    let serviceName = "";
    if (type === "shot") {
      serviceName = "getShotTasks";
    } else if (type === "asset") {
      serviceName = "getAssetTasks";
    }
    let params = "";
    let filterParams = this.filterParams;
    if (filterParams) {
      params += `${filterParams}`;
    }

    /*if (this.showId) {
      params += `showId=${this.showId}`;
      if (this.type == "shot") {
        if (this.isValidArr(this.shotIds)) {
          params += `&shotIds=${this.shotIds.toString()}`;
        }
      } else if (this.type == "asset") {
        if (this.isValidArr(this.assetIds)) {
          params += `&assetIds=${this.assetIds.toString()}`;
        }
      }
    }*/

    this.isEmptyData = false;
    if (serviceName) {
      await this.tasksService[serviceName](params)
        .toPromise()
        .then((response) => {
          response = {
            entity: [
              {
                id: 3615,
                shotId: 2313,
                taskName: "Track",
                startDate: "2020-12-01 00:00:00",
                endDate: "2020-12-01 23:59:59",
                workStatusId: 11,
                taskTypeName: "Track",
                taskColorCode: "#65CCAF",
                artistName: "Gray",
                workStatus: "WIP",
                shotCode: "PRR_505_002_0019",
                completionPercentage: "50.00",
                type: "shot",
                showId: 101,
                statusColorCode: "#27C5F5",
                showName: "SPA",
              },
            ],
            errorProperties: [],
            httpStatus: "OK",
            errMsg: "",
            total: 1,
            valid: true,
          };
          if (response && response.entity) {
            this.loadShowOrAssets(response.entity, type);
          } else {
            this.loadShowOrAssets([], type);
          }
        })
        .catch((error) => {
          this.loadShowOrAssets([], type);
        });
    }
  }

  // chartData2(type) {
  //   setTimeout(() => {
  //     if (type === "shot") {
  //       this.loadShowOrAssets(this.shots, type);
  //     } else {
  //       this.loadShowOrAssets(this.assets, type);
  //     }
  //   }, 200);
  //   return;
  //   let url = "";
  //   if (this.ganttType === "show") {
  //     if (type === "shot") {
  //       url = "http://localhost:4200/assets/shot.json";
  //     } else if (type === "asset") {
  //       url = "http://localhost:4200/assets/asset.json";
  //     }
  //   } else {
  //     type = "resource";
  //     url = "http://localhost:4200/assets/availability.json";
  //   }
  //   this.http.get(url).subscribe((response) => {
  //     if (this.ganttType === "show") {
  //       //this.loadShowOrAssets(response, type);
  //       if (type === "shot") {
  //         this.loadShowOrAssets(this.shots, type);
  //       } else {
  //         this.loadShowOrAssets(this.assets, type);
  //       }
  //     } else {
  //       this.loadResources(response, type);
  //     }
  //   });
  // }

  // loadResources(dataArray, type) {
  //   if (dataArray && dataArray.entity && dataArray.entity.length > 0) {
  //     dataArray.entity.map((entity) => {
  //       const department_id = "department_" + entity.id;
  //       this.rows[department_id] = {
  //         id: department_id,
  //         label: '<span class="showTextColor">' + entity.department + "</span>",
  //         firstName: "",
  //         lastName: "",
  //         expanded: true,
  //       };
  //       const resourceArr = entity.resources;
  //       if (resourceArr && resourceArr.length > 0) {
  //         resourceArr.forEach((resource) => {
  //           const resource_id = department_id + "~resource_" + resource.id;
  //           this.moveableArr.push(resource_id);
  //           this.rows[resource_id] = {
  //             id: resource_id,
  //             label: "",
  //             firstName: resource.firstName,
  //             lastName: resource.lastName,
  //             parentId: department_id,
  //             details:
  //               "Department : " +
  //               entity.department +
  //               "~First Name : " +
  //               resource.firstName +
  //               "~Last Name : " +
  //               resource.lastName,
  //             expanded: true,
  //           };
  //           const taskArr = resource.tasks;
  //           if (taskArr && taskArr.length > 0) {
  //             taskArr.forEach((task) => {
  //               const resourceStartDate =
  //                 task.startDate !== undefined && task.startDate !== ""
  //                   ? format(new Date(task.startDate), "LLL dd, yyyy")
  //                   : "-";
  //               const resourceEndDate =
  //                 task.endDate !== undefined && task.endDate !== ""
  //                   ? format(new Date(task.endDate), "LLL dd, yyyy")
  //                   : "-";

  //               const item_id = resource_id + "~item_" + task.id;
  //               this.items[item_id] = {
  //                 id: item_id,
  //                 label: task.taskName,
  //                 time: {
  //                   start: new Date(task.startDate).getTime(),
  //                   end: new Date(task.endDate).getTime(),
  //                 },
  //                 rowId: resource_id,
  //                 details:
  //                   "Department : " +
  //                   entity.department +
  //                   "~First Name : " +
  //                   resource.firstName +
  //                   "~Last Name : " +
  //                   resource.lastName +
  //                   "~Task Name : " +
  //                   task.taskName +
  //                   "~Task Type : " +
  //                   task.taskTypeName +
  //                   "~Progress : " +
  //                   task.completionPercentage +
  //                   "%" +
  //                   "~Start Date : " +
  //                   resourceStartDate +
  //                   "~End Date : " +
  //                   resourceEndDate,
  //                 moveable:
  //                   Number(task.completionPercentage) === 0
  //                     ? this.moveableArr
  //                     : false,
  //                 resizable:
  //                   Number(task.completionPercentage) === 100 ? false : true,
  //                 style: {
  //                   color:
  //                     Number(task.completionPercentage) === 0
  //                       ? "#000000"
  //                       : "#FFFFFF",
  //                   background:
  //                     Number(task.completionPercentage) === 0
  //                       ? "rgba(255,255,255,0.8)"
  //                       : task.taskColorCode,
  //                 },
  //               };
  //             });
  //           }
  //           const leaveArr = resource.leaves;
  //           if (leaveArr && leaveArr.length > 0) {
  //             leaveArr.forEach((leave) => {
  //               const resourceLeaveStartDate =
  //                 leave.appliedDate !== undefined && leave.appliedDate !== ""
  //                   ? format(new Date(leave.appliedDate), "LLL dd, yyyy")
  //                   : "-";
  //               const resourceLeaveEndDate = resourceLeaveStartDate;

  //               const leave_id = resource_id + "~leave_" + leave.id;
  //               this.items[leave_id] = {
  //                 id: leave_id,
  //                 label: "leave", // leave.reason,
  //                 time: {
  //                   start: startOfDay(new Date(leave.appliedDate)).getTime(),
  //                   end: endOfDay(new Date(leave.appliedDate)).getTime(),
  //                 },
  //                 rowId: resource_id,
  //                 details:
  //                   "Department : " +
  //                   entity.department +
  //                   "~First Name : " +
  //                   resource.firstName +
  //                   "~Last Name : " +
  //                   resource.lastName +
  //                   "~Leave Reason : " +
  //                   leave.reason +
  //                   "~Start Date : " +
  //                   resourceLeaveStartDate +
  //                   "~End Date : " +
  //                   resourceLeaveEndDate,
  //                 moveable: false,
  //                 resizable: false,
  //                 style: {
  //                   color: "#FFFFFF",
  //                   background: "#FF0000",
  //                 },
  //               };
  //             });
  //           }
  //         });
  //       }
  //     });
  //   }

  //   this.gstcState.update("config.chart.time.zoom", 21);
  //   this.gstcState.update("config.list.rows", this.rows);
  //   this.gstcState.update("config.chart.items", this.items);
  //   this.originalItems = JSON.stringify(this.items);

  //   this.scheduler.GSTC.api.scrollToTime(
  //     this.scheduler.GSTC.api.time.date().valueOf()
  //   );
  //   this.t1 = performance.now();
  //   console.log("Time took to render : " + (this.t1 - this.t0));
  // }

  loadShowOrAssets(_entity, type) {
    if (_entity && _entity.length > 0) {
      _entity.map((entity) => {
        const showId = Object.keys(this.dataArr);
        if (showId.indexOf(entity.showId + "") == -1) {
          var showObj = new ShowObj();
          showObj.id = entity.showId;
          showObj.name = entity.showName;
          this.dataArr[entity.showId] = showObj;
          showObj = null;
        }
        if (type === "shot") {
          const shotId = Object.keys(this.dataArr[entity.showId].shotObj);
          if (shotId.indexOf(entity.shotId + "") == -1) {
            var _shotObj = new ShotObj();
            _shotObj.id = entity.shotId;
            _shotObj.name = entity.shotCode;
            this.dataArr[entity.showId].shotObj[entity.shotId] = _shotObj;
            _shotObj = null;
          }
        } else if (type === "asset") {
          const assetId = Object.keys(this.dataArr[entity.showId].assetObj);
          if (assetId.indexOf(entity.assetId + "") == -1) {
            var _assetObj = new AssetObj();
            _assetObj.id = entity.assetId;
            _assetObj.name = entity.assetName;
            this.dataArr[entity.showId].assetObj[entity.assetId] = _assetObj;
            _assetObj = null;
          }
        }
        var _taskObj = new TaskObj();
        _taskObj.id = entity.id;
        _taskObj.name = entity.taskName;
        _taskObj.startDate = new Date(entity.startDate).getTime();
        _taskObj.endDate = new Date(entity.endDate).getTime();
        _taskObj.taskType = entity.taskTypeName;
        _taskObj.taskColorCode = entity.taskColorCode;
        _taskObj.statusColorCode = entity.statusColorCode;
        _taskObj.completionPercentage =
          entity.completionPercentage === undefined
            ? "0%"
            : entity.completionPercentage.split(".")[0] + "%";
        const dateDiff = differenceInCalendarDays(
          new Date(entity.endDate),
          new Date(entity.startDate)
        );
        let days = 0;
        if (!isNaN(dateDiff)) {
          days = dateDiff + 1;
        }
        //_taskObj.days = isNaN(dateDiff) ? 0 : dateDiff;
        _taskObj.days = days;
        _taskObj.artist = entity.artistName;
        _taskObj.status = entity.workStatus;
        if (type === "shot") {
          this.dataArr[entity.showId].shotObj[entity.shotId].taskArr.push(
            _taskObj
          );
        } else if (type === "asset") {
          this.dataArr[entity.showId].assetObj[entity.assetId].taskArr.push(
            _taskObj
          );
        }
        _taskObj = null;
      });
    }
    this.frameRows(type);
  }

  frameRows(type) {
    const shows = Object.keys(this.dataArr);
    for (const [i, showId] of shows.entries()) {
      const show_id = "show_" + this.dataArr[showId].id;
      this.rows[show_id] = {
        id: show_id,
        label:
          '<span class="showTextColor">' +
          this.dataArr[showId].name +
          "</span>",
        days: "",
        artist: "",
        taskType: "",
        status: "",
        expanded: true,
      };
      if (type === "shot") {
        const shots = Object.keys(this.dataArr[showId].shotObj);
        for (const [i, shotId] of shots.entries()) {
          const shot_id =
            show_id + "~shot_" + this.dataArr[showId].shotObj[shotId].id;
          this.rows[shot_id] = {
            id: shot_id,
            label:
              '<span class="shotTextColor">' +
              this.dataArr[showId].shotObj[shotId].name +
              "</span>",
            days: "",
            artist: "",
            taskType: "",
            status: "",
            parentId: show_id,
            expanded: true,
          };
          const taskArrays = this.dataArr[showId].shotObj[shotId].taskArr;
          taskArrays.forEach((element) => {
            const task_id = shot_id + "~task_" + element.id;
            this.rows[task_id] = {
              id: task_id,
              label: '<span class="showCursor">' + element.name + "</span>",
              days: element.days,
              artist: element.artist !== undefined ? element.artist : "",
              taskType:
                '<span style="color: ' +
                element.taskColorCode +
                '; font-size: 14px; font-weight: 500;">' +
                element.taskType +
                "</span>",
              status:
                '<div style="width:100%;height:100%;text-align:center;"><button style="background-color: ' +
                element.statusColorCode +
                '; font-weight: 400; line-height: 1.5; border: none;border-radius: 6px; color: white; font-size: 12px; margin: 5px;" title="' +
                element.status +
                '">' +
                element.status +
                "</button></div>",
              parentId: shot_id,
              expanded: false,
            };

            const showStartDate = isNaN(element.startDate)
              ? "-"
              : format(new Date(element.startDate), "LLL dd, yyyy");
            const showEndDate = isNaN(element.endDate)
              ? "-"
              : format(new Date(element.endDate), "LLL dd, yyyy");
            const item_id = shot_id + "~item_" + element.id;
            this.items[item_id] = {
              id: item_id,
              label: element.completionPercentage,
              time: {
                start: element.startDate,
                end: element.endDate,
              },
              rowId: task_id,
              completionPercentage: element.completionPercentage,
              resizable: this.isResizable(element),
              //moveable: element.completionPercentage === "0%" ? "x" : false,
              moveable: this.isMoveable(element),

              details:
                "Show Name : " +
                this.dataArr[showId].name +
                "~Shot Code : " +
                this.dataArr[showId].shotObj[shotId].name +
                "~Task Name : " +
                element.name +
                "~Days : " +
                element.days +
                "~Artist Name : " +
                element.artist +
                "~Task Type : " +
                element.taskType +
                "~Status : " +
                element.status +
                "~Progress : " +
                element.completionPercentage +
                "~Start Date : " +
                showStartDate +
                "~End Date : " +
                showEndDate,

              style: {
                color:
                  element.completionPercentage === "0%" ? "#000000" : "#FFFFFF",
                background:
                  element.completionPercentage === "0%"
                    ? "rgba(255,255,255,0.8)"
                    : element.taskColorCode,
              },
            };
          });
        }
      } else if (type === "asset") {
        const assets = Object.keys(this.dataArr[showId].assetObj);
        for (const [i, assetId] of assets.entries()) {
          const asset_id =
            show_id + "~asset_" + this.dataArr[showId].assetObj[assetId].id;
          this.rows[asset_id] = {
            id: asset_id,
            label:
              '<span class="assetTextColor">' +
              this.dataArr[showId].assetObj[assetId].name +
              "</span>",
            days: "",
            artist: "",
            taskType: "",
            status: "",
            parentId: show_id,
            expanded: true,
          };
          const taskArrays = this.dataArr[showId].assetObj[assetId].taskArr;
          taskArrays.forEach((element) => {
            const task_id = asset_id + "~task_" + element.id;
            this.rows[task_id] = {
              id: task_id,
              //label: element.name,
              label: '<span class="showCursor">' + element.name + "</span>",
              days: element.days,
              artist: element.artist !== undefined ? element.artist : "",
              taskType:
                '<span style="color: ' +
                element.taskColorCode +
                '; font-size: 14px; font-weight: 500;">' +
                element.taskType +
                "</span>",
              status:
                '<div style="width:100%;height:100%;text-align:center;"><button style="background-color: ' +
                element.statusColorCode +
                '; font-weight: 400; line-height: 1.5; border: none;border-radius: 6px; color: white; font-size: 12px; margin: 5px;" title="' +
                element.status +
                '">' +
                element.status +
                "</button></div>",
              parentId: asset_id,
              expanded: false,
            };
            const showStartDate = isNaN(element.startDate)
              ? "-"
              : format(new Date(element.startDate), "LLL dd, yyyy");
            const showEndDate = isNaN(element.endDate)
              ? "-"
              : format(new Date(element.endDate), "LLL dd, yyyy");

            const item_id = task_id + "~item_" + element.id;
            this.items[item_id] = {
              id: item_id,
              label: element.completionPercentage,
              time: {
                start: element.startDate,
                end: element.endDate,
              },
              rowId: task_id,
              completionPercentage: element.completionPercentage,
              // resizable: (element.completionPercentage === '100%') ? false : true,
              //resizable: true,
              //moveable: false,
              //moveable: element.completionPercentage === "0%" ? "x" : false,
              resizable: this.isResizable(element),
              moveable: this.isMoveable(element),
              details:
                "Show Name : " +
                this.dataArr[showId].name +
                "~Asset Name : " +
                this.dataArr[showId].assetObj[assetId].name +
                "~Task Name : " +
                element.name +
                "~Days : " +
                element.days +
                "~Artist Name : " +
                element.artist +
                "~Task Type : " +
                element.taskType +
                "~Status : " +
                element.status +
                "~Progress : " +
                element.completionPercentage +
                "~Start Date : " +
                showStartDate +
                "~End Date : " +
                showEndDate,
              style: {
                color:
                  element.completionPercentage === "0%" ? "#000000" : "#FFFFFF",
                background:
                  element.completionPercentage === "0%"
                    ? "rgba(255,255,255,0.8)"
                    : element.taskColorCode,
              },
            };
          });
        }
      }
    }
    this.gstcState.update("config.chart.time.zoom", 21);
    this.gstcState.update("config.list.rows", this.rows);
    this.gstcState.update("config.chart.items", this.items);
    this.originalItems = JSON.stringify(this.items);
    this.scheduler.GSTC.api.scrollToTime(
      this.scheduler.GSTC.api.time.date().valueOf()
    );
    this.t1 = performance.now();
    //console.log("Time took to render : " + (this.t1 - this.t0));
  }

  isMoveable(element) {
    //element.completionPercentage === "0%" ? "x" : false,
    let moveable = false;
    if (
      element.startDate &&
      element.workStatusId &&
      element.workStatusId == 1
    ) {
      moveable = true;
    }
    return moveable;
  }

  isResizable(element) {
    //element.completionPercentage === "0%" ? "x" : false,
    let resizable = false;
    if (element.startDate) {
      resizable = true;
    }
    return resizable;
  }

  onState(state) {
    this.gstcState = state;

    this.gstcState.subscribe("config.list.columns.percent", (precent) => {
      // console.log("precent changed", precent);
    });

    this.gstcState.subscribe("config.list.rows", (rows) => {
      // console.log("rows changed", rows);
    });

    this.gstcState.subscribe(
      "config.chart.items.:id",
      (bulk, eventInfo) => {
        if (eventInfo.type === "update" && eventInfo.params.id) {
          if (this.itemTimeout) {
            clearTimeout(this.itemTimeout);
          }
          this.itemTimeout = setTimeout(() => {
            const itemId = eventInfo.params.id;
            const itemObj = this.gstcState.get("config.chart.items." + itemId);
            if (this.ganttType === "show") {
              this.processShowItemArray(itemObj);
            }
          }, 500);
        }
      },
      { bulk: true }
    );
  }

  processShowItemArray(sourceItemObj) {
    const resourceStartDate =
      sourceItemObj.time.start !== "-"
        ? format(new Date(sourceItemObj.time.start), "LLL dd, yyyy")
        : "-";
    const resourceEndDate =
      sourceItemObj.time.end !== "-"
        ? format(new Date(sourceItemObj.time.end), "LLL dd, yyyy")
        : "-";

    var sourceDetailsArr = sourceItemObj.details.split("~");
    var oldStartDate = "";
    var oldEndDate = "";
    sourceDetailsArr.forEach((element, i) => {
      if (sourceDetailsArr[i].indexOf("Start Date : ") > -1) {
        oldStartDate = sourceDetailsArr[i];
        sourceDetailsArr[i] = "Start Date : " + resourceStartDate;
      }
      if (sourceDetailsArr[i].indexOf("End Date : ") > -1) {
        oldEndDate = sourceDetailsArr[i];
        sourceDetailsArr[i] = "End Date : " + resourceEndDate;
      }
    });

    var oldDateDiff = differenceInCalendarDays(
      new Date(oldEndDate),
      new Date(oldStartDate)
    );
    var daysWorked =
      oldDateDiff *
      (parseInt(sourceItemObj.completionPercentage.split("%")[0]) / 100);

    var newDateDiff = differenceInCalendarDays(
      new Date(resourceEndDate),
      new Date(resourceStartDate)
    );

    /*var newCompletionPercentage = (daysWorked / newDateDiff) * 100;    
    sourceItemObj.label = newCompletionPercentage.toFixed(2) + "%";*/
    sourceItemObj.days = newDateDiff;

    /*console.log(sourceItemObj);
    console.log("oldStartDate : " + oldStartDate);
    console.log("oldEndDate : " + oldEndDate);
    console.log("oldDateDiff : " + oldDateDiff);
    console.log(
      "sourceItemObj.completionPercentage : " +
        sourceItemObj.completionPercentage
    );
    console.log("daysWorked : " + daysWorked);
    console.log("resourceStartDate : " + resourceStartDate);
    console.log("resourceEndDate : " + resourceEndDate);
    console.log("newDateDiff : " + newDateDiff);*/

    /*try {
      let prevStartDate = oldStartDate.split("Start Date : ")[1];
      let prevEndDate = oldStartDate.split("End Date : ")[1];
      if (
        prevStartDate === resourceStartDate &&
        prevEndDate === resourceEndDate
      ) {
        return;
      }
    } catch (e) {}*/

    //console.log("newCompletionPercentage : " + newCompletionPercentage);

    // if (Math.round(newCompletionPercentage) === 100) {
    //   sourceItemObj.style.background = "rgba(255,255,255,0.8)";
    //   sourceItemObj.style.color = "#000000";
    //   sourceItemObj.resizable = false;
    // }

    sourceDetailsArr.forEach((element, i) => {
      if (sourceDetailsArr[i].indexOf("Days : ") > -1) {
        sourceDetailsArr[i] = "Days : " + newDateDiff;
      }
      if (sourceDetailsArr[i].indexOf("Progress : ") > -1) {
        sourceDetailsArr[i] = "Progress : " + sourceItemObj.label;
      }
    });

    sourceItemObj.details = sourceDetailsArr.join("~");
    var sourceIds = [];
    var sourceRowIds = [];
    const sourceItemArr = sourceItemObj.id.split("~");
    sourceItemArr.forEach((element) => {
      sourceIds.push(element.split("_")[1]);
    });
    const sourceRowIdArr = sourceItemObj.rowId.split("~");
    sourceRowIdArr.forEach((element) => {
      sourceIds.push(element.split("_")[1]);
    });
    var itemUpdate = {};
    itemUpdate["data"] = {
      showId: sourceIds[0],
      shotOrAssetId: sourceIds[1],
      taskId: sourceRowIds[2],
      itemId: sourceIds[2],
      to: {
        startDate: new Date(sourceItemObj.time.start).toString(),
        endDate: new Date(sourceItemObj.time.end).toString(),
      },
    };
    //this.updateShotAssetDb(itemUpdate, sourceItemObj);
    let startDate = this.helperService.transformDate(
      new Date(sourceItemObj.time.start),
      `yyyy-MM-dd 00:00:00`
    );

    let endDate = this.helperService.transformDate(
      new Date(sourceItemObj.time.end),
      `yyyy-MM-dd 23:59:59`
    );

    //console.log("@@@ " + startDate + " ~~~~ " + endDate);

    let postObj = {
      endDate,
      startDate,
    };

    this.multipleEdit(sourceIds[2], postObj, sourceItemObj);
  }

  async multipleEdit(taskId, taskIn, sourceItemObj) {
    let isEditSuccess = false;
    let errorMessage = "Record update failed.";
    await this.showsService
      .multipleEditTask(taskId, taskIn)
      .toPromise()
      .then((resp: any) => {
        isEditSuccess = true;
      })
      .catch((error: any) => {
        let errorDetails = this.helperService.getErrorDetails(error);
        if (errorDetails !== "") {
          errorMessage = `<b>${errorMessage}</b>` + errorDetails;
        }
        isEditSuccess = false;
      });
    if (isEditSuccess) {
      this.showNotification({
        type: "success",
        title: "Success",
        content: "Record updated successfully.",
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
    this.updateShotAssetDb(isEditSuccess, sourceItemObj);
  }

  showNotification(info: any) {
    this.notificationService.showNotification(info);
  }

  updateShotAssetDb(isEditSuccess, sourceItemObj) {
    if (isEditSuccess) {
      delete this.items[sourceItemObj.id];
      this.items[sourceItemObj.id] = sourceItemObj;
      this.rows[sourceItemObj.rowId].days = sourceItemObj.days;
      this.gstcState.update("config.list.rows", this.rows);
      this.gstcState.update("config.chart.items", this.items);
      this.originalItems = JSON.stringify(this.items);
    } else {
      this.items = {};
      this.items = JSON.parse(this.originalItems);
      this.gstcState.update("config.chart.items", this.items);
    }
  }

  updateDb(data, sourceItemObj, newItemId) {
    var status = "success"; // db update status
    if (status === "success") {
      delete this.items[sourceItemObj.id];
      this.items[newItemId] = sourceItemObj;
      this.gstcState.update("config.chart.items", this.items);
      this.originalItems = JSON.stringify(this.items);
    } else {
      this.items = {};
      this.items = JSON.parse(this.originalItems);
      this.gstcState.update("config.chart.items", this.items);
    }
  }

  reCenter() {
    this.scheduler.GSTC.api.scrollToTime(
      this.scheduler.GSTC.api.time.date().valueOf()
    );
    this.period = "today";
  }

  splitterPercent() {
    this.gstcState.update("config.list.columns.percent", 50);
  }

  onPeriodChange(e) {
    if (e === "day") {
      this.gstcState.update("config.chart.time.zoom", 21);
    }
    this.gstcState.update("config.chart.time.period", e);
  }

  /*dayView() {
    this.gstcState.update("config.chart.time.zoom", 21);
    this.gstcState.update("config.chart.time.period", "day");
    this.period = "day";
  }
  weekView() {
    this.gstcState.update("config.chart.time.period", "week");
    this.period = "week";
  }
  monthView() {
    this.gstcState.update("config.chart.time.period", "month");
    this.period = "month";
  }
  yearView() {
    this.gstcState.update("config.chart.time.period", "year");
    this.period = "year";
  }*/

  getColumn() {
    const columns = {
      percent: 100,
      resizer: {
        inRealTime: true,
      },
      data: {
        details: {
          id: "details",
          data: "label",
          expander: true,
          isHTML: true,
          width: 200,
          minWidth: 100,
          header: {
            html: "Name",
          },
        },
        days: {
          id: "days",
          data: "days",
          isHTML: true,
          width: 50,
          minWidth: 50,
          header: {
            html: "Days",
          },
        },
        artist: {
          id: "artist",
          data: "artist",
          isHTML: true,
          width: 100,
          minWidth: 100,
          header: {
            html: "Artist",
          },
        },
        taskType: {
          id: "taskType",
          data: "taskType",
          isHTML: true,
          width: 100,
          minWidth: 100,
          header: {
            html: "Tast Type",
          },
        },
        status: {
          id: "status",
          data: "status",
          isHTML: true,
          width: 130,
          minWidth: 100,
          header: {
            html: "Status",
          },
        },
      },
    };
    return columns;
  }

  getExpanderConfig() {
    const expander = {
      padding: 5,
      size: {
        width: 20,
        height: 20,
      },
      icon: {
        width: 10,
        height: 10,
      },
      icons: {
        child: "",
        open:
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus"> <line x1="5" y1="12" x2="19" y2="12"></line></svg>',
        closed:
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>',
      },
    };
    return expander;
  }

  getPlugin() {
    const ref = this;
    const plugin = [
      CalendarScroll({
        speed: 0.1,
        hideScroll: false,
        onChange(time) {
          // console.log(time);
        },
      }),
      ItemMovement({
        resizerContent: '<div class="resizer">-></div>',
        moveable: true,
        resizable: true,
        collisionDetection: true,
        ghostNode: false,
        snapStart(time, diff, item) {
          return ref.scheduler.GSTC.api.time
            .date(time)
            .add(diff, "milliseconds")
            .startOf("day")
            .valueOf();
        },
        snapEnd(time, diff, item) {
          return ref.scheduler.GSTC.api.time
            .date(time)
            .add(diff, "milliseconds")
            .endOf("day")
            .valueOf();
        },
      }),
      WeekendHighlight({
        weekdays: this.weekEnds,
        className: "weekendHighlighter",
      }),
    ];
    return plugin;
  }

  dummyItemConfig() {
    const dummyItem = {
      dummy: {
        time: {
          start: subYears(new Date(), 1).getTime(),
          end: addYears(new Date(), 1).getTime(),
        },
      },
    };
    return dummyItem;
  }

  //---[Changes Hariharan]---//
  async prepareData() {
    this.weekEnds = [];
    for (let i = 0; i < AppConstants.WEEK_ENDS.length; i++) {
      this.weekEnds.push(AppConstants.DAY_INDEX[AppConstants.WEEK_ENDS[i]]);
    }
    await this.getShows();
    if (this.showId) {
      await this.getShotList();
      await this.getAssetList();
    }
    this.isDataReady = true;
    this.initChart();
  }

  isValidArr(arr: any) {
    return this.helperService.isValidArr(arr);
  }

  submitHandler(_type, filterParams) {
    this.type = _type;
    this.filterParams = filterParams;
    this.changeDataType(this.type);
  }

  async showChangeHandler(e) {
    this.showId = e;
    this.shotIds = null;
    this.assetIds = null;
    if (this.showId) {
      await this.getShotList();
      await this.getAssetList();
    }
    this.changeDataType(this.type);
  }

  radioChangeHandler(e) {
    //this.taskFilters.showId = null;
    //this.taskFilters.shotIds = [];
    //this.taskFilters.assetIds = [];
    this.type = e;
    this.changeDataType(this.type);
  }

  async getShows() {
    await this.showsService
      .getShows()
      .toPromise()
      .then((resp) => {
        this.shows = resp.entity;
        if (this.shows && this.shows.length > 0) {
          this.showId = this.shows[0].id;
        }
      })
      .catch((error) => {
        this.shows = null;
      });
  }

  async getShotList() {
    await this.shotsService
      .getShotsByShowId(this.showId)
      .toPromise()
      .then((resp: any) => {
        this.shots = resp.entity;
      })
      .catch((error: any) => {
        this.shots = [];
      });
  }

  async getAssetList() {
    await this.assetsService
      .getAssetListByShowId(this.showId)
      .toPromise()
      .then((resp: any) => {
        this.assets = resp.entity;
      })
      .catch((error: any) => {
        this.assets = [];
      });
  }

  changeData(type) {
    //this.isSpinning = true;
    //this.currIndex = 0;
    //this.resetArray();
    this.chartData(type);
  }

  //---[Changes Hariharan]---//
}
