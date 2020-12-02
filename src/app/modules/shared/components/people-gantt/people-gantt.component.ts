import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  Input,
  OnDestroy,
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
  selector: "app-people-gantt",
  templateUrl: "./people-gantt.component.html",
  styleUrls: ["./people-gantt.component.scss"],
})
export class PeopleGanttComponent implements OnInit, OnDestroy {
  @ViewChild("scheduler", { static: false }) scheduler;

  disabled = false;
  value1 = 100;

  config: any;
  gstcState: any;
  ganttType: any = "resource";

  rows = {};
  items = {};
  originalItems;
  dataArr = new Object();
  moveableArr = [];
  itemTimeout: any;
  t0;
  t1;

  //---[Changes Hariharan]---//
  type: any = "shot";
  isEmptyData: boolean;
  shows: any;
  showId: any;
  shots: any;
  shotIds: any;
  assets: any;
  assetIds: any;
  isDataReady;
  period: any = "day";
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
        columns:
          this.ganttType === "show"
            ? this.getColumn()
            : this.getResourceColumn(), // getResourceColumn() // getColumn()
        expander: this.getExpanderConfig(),
      },
      chart: {
        time: {
          zoom: 21,
        },
        items: this.dummyItemConfig(),
      },
      actions: {
        "list-column-row": [this.clickAction],
        "list-column-row-expander-toggle": [this.clickActionToggle],
        "chart-timeline-items-row-item": [this.hoverAction],
      },
    };
    this.chartData("resource");
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
    function onClick(event: any) {
      //alert(`Event ${data.rowId} clicked!`);
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

  async chartData(type) {
    //let url = "http://localhost:4200/assets/availability.json";
    await this.getArtistData(type);
    // this.http.get(url).subscribe((response) => {
    //   this.loadResources(response, type);
    // });
  }

  async getArtistData(type) {
    await this.tasksService
      .getArtistData()
      .toPromise()
      .then((response) => {
        response = {
          entity: [
            {
              id: 12,
              department: "Comp",
              resources: [
                {
                  id: 244,
                  firstName: "Arya",
                  lastName: "Bing",
                  tasks: [
                    {
                      id: 2907,
                      taskName: "FX",
                      startDate: "2020-09-01 00:00:00",
                      endDate: "2020-09-16 23:59:59",
                      workStatusId: 1,
                      taskTypeName: "FX",
                      taskColorCode: "#65CCAF",
                      workStatus: "Not Started",
                      completionPercentage: "0.0",
                      assetName: "BG_REF_01",
                      showName: "KEY",
                    },
                    {
                      id: 2778,
                      taskName: "Comp",
                      startDate: "2020-09-02 00:00:00",
                      endDate: "2020-09-02 23:59:59",
                      workStatusId: 36,
                      taskTypeName: "Comp",
                      taskColorCode: "#409FFF",
                      workStatus: "Client Approved",
                      shotCode: "PT_020_020",
                      completionPercentage: "0.0",
                      showName: "PIT",
                    },
                    {
                      id: 2785,
                      taskName: "Comp",
                      startDate: "2020-09-02 00:00:00",
                      endDate: "2020-09-03 23:59:59",
                      workStatusId: 1,
                      taskTypeName: "Comp",
                      taskColorCode: "#409FFF",
                      workStatus: "Not Started",
                      shotCode: "PT_040_043",
                      completionPercentage: "0.0",
                      showName: "PIT",
                    },
                    {
                      id: 2842,
                      taskName: "Comp",
                      startDate: "2020-08-17 00:00:00",
                      endDate: "2020-08-19 23:59:59",
                      workStatusId: 1,
                      taskTypeName: "Paint",
                      taskColorCode: "#FF5c9A",
                      workStatus: "Not Started",
                      shotCode: "WED_000_0101",
                      completionPercentage: "0.0",
                      showName: "WED",
                    },
                    {
                      id: 2846,
                      taskName: "Comp",
                      startDate: "2020-08-21 00:00:00",
                      endDate: "2020-08-24 23:59:59",
                      workStatusId: 1,
                      taskTypeName: "Comp",
                      taskColorCode: "#409FFF",
                      workStatus: "Not Started",
                      shotCode: "WED_000_0104",
                      completionPercentage: "0.0",
                      showName: "WED",
                    },
                    {
                      id: 2850,
                      taskName: "Comp",
                      startDate: "2020-08-25 00:00:00",
                      endDate: "2020-08-25 23:59:59",
                      workStatusId: 1,
                      taskTypeName: "Comp",
                      taskColorCode: "#409FFF",
                      workStatus: "Not Started",
                      shotCode: "WED_000_0107",
                      completionPercentage: "0.0",
                      showName: "WED",
                    },
                    {
                      id: 2853,
                      taskName: "Comp",
                      startDate: "2020-08-26 00:00:00",
                      endDate: "2020-08-27 23:59:59",
                      workStatusId: 1,
                      taskTypeName: "Comp",
                      taskColorCode: "#409FFF",
                      workStatus: "Not Started",
                      shotCode: "WED_000_0109",
                      completionPercentage: "0.0",
                      showName: "WED",
                    },
                    {
                      id: 2854,
                      taskName: "Comp",
                      startDate: "2020-08-27 00:00:00",
                      endDate: "2020-08-29 23:59:59",
                      workStatusId: 2,
                      taskTypeName: "Comp",
                      taskColorCode: "#409FFF",
                      workStatus: "WIP",
                      shotCode: "WED_000_0110",
                      completionPercentage: "0.0",
                      showName: "WED",
                    },
                    {
                      id: 2858,
                      taskName: "Comp",
                      startDate: "2020-08-31 00:00:00",
                      endDate: "2020-09-01 23:59:59",
                      workStatusId: 2,
                      taskTypeName: "Comp",
                      taskColorCode: "#409FFF",
                      workStatus: "WIP",
                      shotCode: "WED_000_0113",
                      completionPercentage: "0.0",
                      showName: "WED",
                    },
                    {
                      id: 2867,
                      taskName: "Track",
                      startDate: "2020-08-31 00:00:00",
                      endDate: "2020-09-03 23:59:59",
                      workStatusId: 2,
                      taskTypeName: "Track",
                      taskColorCode: "#65CCAF",
                      workStatus: "WIP",
                      shotCode: "MC_000_250",
                      completionPercentage: "0.0",
                      showName: "MAC",
                    },
                    {
                      id: 3067,
                      taskName: "Comp",
                      startDate: "2020-09-01 00:00:00",
                      endDate: "2020-09-22 23:59:59",
                      workStatusId: 36,
                      taskTypeName: "Comp",
                      taskColorCode: "#409FFF",
                      workStatus: "Client Approved",
                      shotCode: "PT_010_010",
                      completionPercentage: "50.0",
                      showName: "VEL",
                    },
                    {
                      id: 3068,
                      taskName: "Comp",
                      startDate: "2020-09-04 00:00:00",
                      endDate: "2020-09-07 23:59:59",
                      workStatusId: 2,
                      taskTypeName: "Comp",
                      taskColorCode: "#409FFF",
                      workStatus: "WIP",
                      shotCode: "PT_010_040",
                      completionPercentage: "80.0",
                      showName: "VEL",
                    },
                    {
                      id: 3069,
                      taskName: "Comp",
                      startDate: "2020-09-08 00:00:00",
                      endDate: "2020-09-10 23:59:59",
                      workStatusId: 2,
                      taskTypeName: "Comp",
                      taskColorCode: "#409FFF",
                      workStatus: "WIP",
                      shotCode: "PT_010_050",
                      completionPercentage: "20.0",
                      showName: "VEL",
                    },
                    {
                      id: 3072,
                      taskName: "Comp",
                      startDate: "2020-09-15 00:00:00",
                      endDate: "2020-09-15 23:59:59",
                      workStatusId: 2,
                      taskTypeName: "Comp",
                      taskColorCode: "#409FFF",
                      workStatus: "WIP",
                      shotCode: "PT_020_0840",
                      completionPercentage: "100.0",
                      showName: "VEL",
                    },
                    {
                      id: 3073,
                      taskName: "Comp",
                      startDate: "2020-09-16 00:00:00",
                      endDate: "2020-09-16 23:59:59",
                      workStatusId: 2,
                      taskTypeName: "Comp",
                      taskColorCode: "#409FFF",
                      workStatus: "WIP",
                      shotCode: "PT_020_0300",
                      completionPercentage: "100.0",
                      showName: "VEL",
                    },
                    {
                      id: 3074,
                      taskName: "Comp",
                      startDate: "2020-09-17 00:00:00",
                      endDate: "2020-09-18 23:59:59",
                      workStatusId: 34,
                      taskTypeName: "Comp",
                      taskColorCode: "#409FFF",
                      workStatus: "Uploaded",
                      shotCode: "PT_020_028",
                      completionPercentage: "50.0",
                      showName: "VEL",
                    },
                    {
                      id: 3075,
                      taskName: "Comp",
                      startDate: "2020-09-21 00:00:00",
                      endDate: "2020-09-22 23:59:59",
                      workStatusId: 36,
                      taskTypeName: "Comp",
                      taskColorCode: "#409FFF",
                      workStatus: "Client Approved",
                      shotCode: "PT_020_022",
                      completionPercentage: "50.0",
                      showName: "VEL",
                    },
                    {
                      id: 3659,
                      taskName: "Roto",
                      startDate: "2020-10-01 00:00:00",
                      endDate: "2020-10-08 23:59:59",
                      workStatusId: 2,
                      taskTypeName: "Animation",
                      taskColorCode: "##63A6F7",
                      workStatus: "WIP",
                      shotCode: "CAR_000_1410",
                      completionPercentage: "35.0",
                      showName: "VEL",
                    },
                  ],
                  leaves: [
                    {
                      id: 66,
                      appliedDate: "2020-08-08",
                      reason: "Test",
                    },
                    {
                      id: 70,
                      appliedDate: "2020-08-03",
                      reason: "test",
                    },
                    {
                      id: 100,
                      appliedDate: "2020-09-11",
                      reason: "Personal",
                    },
                    {
                      id: 112,
                      appliedDate: "2020-09-28",
                      reason: "Personal",
                    },
                    {
                      id: 113,
                      appliedDate: "2020-09-29",
                      reason: "Personal",
                    },
                    {
                      id: 114,
                      appliedDate: "2020-09-30",
                      reason: "Personal",
                    },
                    {
                      id: 115,
                      appliedDate: "2020-09-22",
                      reason: "Personal",
                    },
                    {
                      id: 116,
                      appliedDate: "2020-09-23",
                      reason: "Personal",
                    },
                  ],
                },
              ],
            },
          ],
          errorProperties: [],
          httpStatus: "OK",
          errMsg: "",
          total: 1,
          valid: true,
        };
        if (response && response.entity && response.entity.length > 0) {
          this.loadResources(response, type);
        } else {
          this.loadResources([], type);
          //this.isEmptyData = true;
        }
      })
      .catch((error) => {
        this.loadResources([], type);
        //this.isEmptyData = true;
      });
  }

  loadResources(dataArray, type) {
    if (dataArray && dataArray.entity && dataArray.entity.length > 0) {
      dataArray.entity.map((entity) => {
        const department_id = "department_" + entity.id;
        this.rows[department_id] = {
          id: department_id,
          label:
            '<span class="showTextColor resource">' +
            entity.department +
            "</span>",
          firstName: "",
          lastName: "",
          expanded: true,
        };
        const resourceArr = entity.resources;
        if (resourceArr && resourceArr.length > 0) {
          resourceArr.forEach((resource) => {
            const resource_id = department_id + "~resource_" + resource.id;
            this.moveableArr.push(resource_id);
            this.rows[resource_id] = {
              id: resource_id,
              label: "",
              firstName: resource.firstName,
              lastName: resource.lastName,
              parentId: department_id,
              details:
                "Department : " +
                entity.department +
                "~First Name : " +
                resource.firstName +
                "~Last Name : " +
                resource.lastName,
              expanded: true,
            };
            const taskArr = resource.tasks;
            if (taskArr && taskArr.length > 0) {
              taskArr.forEach((task) => {
                const resourceStartDate =
                  task.startDate !== undefined && task.startDate !== ""
                    ? format(new Date(task.startDate), "LLL dd, yyyy")
                    : "-";
                const resourceEndDate =
                  task.endDate !== undefined && task.endDate !== ""
                    ? format(new Date(task.endDate), "LLL dd, yyyy")
                    : "-";

                const item_id = resource_id + "~item_" + task.id;
                this.items[item_id] = {
                  id: item_id,
                  label: task.taskName,
                  time: {
                    start: new Date(task.startDate).getTime(),
                    end: new Date(task.endDate).getTime(),
                  },
                  rowId: resource_id,
                  details:
                    "Department : " +
                    entity.department +
                    "~First Name : " +
                    resource.firstName +
                    "~Last Name : " +
                    resource.lastName +
                    "~Show Name : " +
                    this.getShowName(task) +
                    this.getEntityName(task) +
                    /*"~Shot Code : " +
                    this.getShotName(task) +
                    "~Asset Name : " +
                    this.getAssetName(task) +*/
                    "~Task Name : " +
                    task.taskName +
                    "~Task Type : " +
                    task.taskTypeName +
                    "~Status : " +
                    this.getWorkStatus(task) +
                    "~Progress : " +
                    Number(task.completionPercentage) +
                    "%" +
                    "~Start Date : " +
                    resourceStartDate +
                    "~End Date : " +
                    resourceEndDate,

                  moveable: this.isMoveable(task) ? this.moveableArr : false,
                  resizable: this.isResizable(task),
                  style: {
                    color:
                      Number(task.completionPercentage) == 0
                        ? "#000000"
                        : "#FFFFFF",
                    background:
                      Number(task.completionPercentage) == 0
                        ? "rgba(255,255,255,0.8)"
                        : task.taskColorCode,
                  },
                };
              });
            }
            const leaveArr = resource.leaves;
            if (leaveArr && leaveArr.length > 0) {
              leaveArr.forEach((leave) => {
                const resourceLeaveStartDate =
                  leave.appliedDate !== undefined && leave.appliedDate !== ""
                    ? format(new Date(leave.appliedDate), "LLL dd, yyyy")
                    : "-";
                const resourceLeaveEndDate = resourceLeaveStartDate;

                const leave_id = resource_id + "~leave_" + leave.id;
                this.items[leave_id] = {
                  id: leave_id,
                  label: "leave", // leave.reason,
                  time: {
                    start: startOfDay(new Date(leave.appliedDate)).getTime(),
                    end: endOfDay(new Date(leave.appliedDate)).getTime(),
                  },
                  rowId: resource_id,
                  details:
                    "Department : " +
                    entity.department +
                    "~First Name : " +
                    resource.firstName +
                    "~Last Name : " +
                    resource.lastName +
                    "~Leave Reason : " +
                    this.getLeaveReason(leave) +
                    "~Start Date : " +
                    resourceLeaveStartDate +
                    "~End Date : " +
                    resourceLeaveEndDate,
                  moveable: false,
                  resizable: false,
                  style: {
                    color: "#FFFFFF",
                    background: "#FF643D",
                  },
                };
              });
            }
          });
        }
      });
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

  getLeaveReason(leave) {
    if (leave && leave.reason) {
      return leave.reason;
    }
    return "";
  }

  getShowName(task) {
    if (task && task.showName) {
      return task.showName;
    }
    return "";
  }

  getEntityName(task) {
    if (task && task.shotCode) {
      return "~Shot Code : " + task.shotCode;
    } else if (task && task.assetName) {
      return "~Asset Name : " + task.assetName;
    }
    return "";
  }

  getWorkStatus(task) {
    if (task && task.workStatus) {
      return task.workStatus;
    }
    return "";
  }

  isMoveable(task) {
    //moveable:                    Number(task.completionPercentage) == 0                     ? this.moveableArr                      : false,
    //element.completionPercentage === "0%" ? "x" : false,
    let moveable = false;
    if (!task.startDate) {
      return false;
    }
    if (task.workStatusId && task.workStatusId == 1) {
      moveable = true;
    }
    return moveable;
  }

  isResizable(task) {
    //resizable:                    Number(task.completionPercentage) === 100 ? false : true,
    //element.completionPercentage === "0%" ? "x" : false,
    let resizable = false;
    if (task.startDate) {
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
              //this.processShowItemArray(itemObj);
            } else if (this.ganttType === "resource") {
              this.processResourceItemArray(itemObj, itemObj.rowId);
            }
          }, 500);
        }
      },
      { bulk: true }
    );
  }

  async processResourceItemArray(sourceItemObj, destItemId) {
    const destItemObj = this.rows[destItemId];
    var source = [];
    var dest = [];
    const sourceItemArr = sourceItemObj.id.split("~");
    sourceItemArr.forEach((element) => {
      source.push(element.split("_")[1]);
    });
    const destItemArr = destItemObj.id.split("~");
    destItemArr.forEach((element) => {
      dest.push(element.split("_")[1]);
    });
    const itemId = sourceItemArr[2];
    const newItemId = destItemId + "~" + itemId;

    sourceItemObj.id = newItemId;
    sourceItemObj.rowId = destItemId;
    var sourceDetailsArr = sourceItemObj.details.split("~");
    const destDetailsArr = destItemObj.details.split("~");
    destDetailsArr.forEach((element, i) => {
      sourceDetailsArr[i] = element;
    });

    const resourceStartDate =
      sourceItemObj.time.start !== "-"
        ? format(new Date(sourceItemObj.time.start), "LLL dd, yyyy")
        : "-";
    const resourceEndDate =
      sourceItemObj.time.end !== "-"
        ? format(new Date(sourceItemObj.time.end), "LLL dd, yyyy")
        : "-";

    let prevStartDate = "";
    let preEndDate = "";

    sourceDetailsArr.forEach((element, i) => {
      if (sourceDetailsArr[i].indexOf("Start Date : ") > -1) {
        prevStartDate = sourceDetailsArr[i].split("Start Date : ")[1];
        sourceDetailsArr[i] = "Start Date : " + resourceStartDate;
      }
      if (sourceDetailsArr[i].indexOf("End Date : ") > -1) {
        preEndDate = sourceDetailsArr[i].split("End Date : ")[1];
        sourceDetailsArr[i] = "End Date : " + resourceEndDate;
      }
    });

    /*try {
      if (
        prevStartDate === resourceStartDate &&
        preEndDate === resourceEndDate &&
        sourceItemObj.rowId === destItemId
      ) {
        this.updateDb(false, sourceItemObj, newItemId);
        return;
      }
    } catch (e) {
      this.updateDb(false, sourceItemObj, newItemId);
      return;
    }*/

    sourceItemObj.details = sourceDetailsArr.join("~");
    var itemUpdate = {};
    itemUpdate["data"] = {
      itemId: source[2],
      from: {
        departmentId: source[0],
        resourceId: source[1],
      },
      to: {
        departmentId: dest[0],
        resourceId: dest[1],
        startDate: new Date(sourceItemObj.time.start).toString(),
        endDate: new Date(sourceItemObj.time.end).toString(),
      },
    };
    //console.log("Item to be update : " + JSON.stringify(itemUpdate));
    let startDate = this.helperService.transformDate(
      new Date(itemUpdate["data"].to.startDate),
      `yyyy-MM-dd 00:00:00`
    );
    let endDate = this.helperService.transformDate(
      new Date(itemUpdate["data"].to.endDate),
      `yyyy-MM-dd 23:59:59`
    );
    let artistId = itemUpdate["data"].to.resourceId;
    //console.log("@@@ " + startDate + " ~~~~ " + endDate + " ~~~~ " + artistId);
    //return;
    try {
      let postObj = {
        endDate,
        startDate,
        artistId,
      };
      /*if (
        itemUpdate["data"].from.resourceId !== itemUpdate["data"].to.resourceId
      ) {
        postObj = {
          type: "artistId",
          artistId: itemUpdate["data"].to.resourceId,
        };
      } else {
        postObj = {
          type: "endDate",
          endDate: this.helperService.transformDate(
            new Date(itemUpdate["data"].to.endDate),
            `yyyy-MM-dd 23:59:59`
          ),
        };
      }*/
      await this.multipleEdit(itemUpdate["data"].itemId, postObj);
      this.updateDb(this.isEditSuccess, sourceItemObj, newItemId);
    } catch (e) {
      this.updateDb(false, sourceItemObj, newItemId);
    }
  }
  isEditSuccess: boolean;
  async multipleEdit(taskId, taskIn) {
    this.isEditSuccess = false;
    let errorMessage = "Record update failed.";
    await this.showsService
      .multipleEditTask(taskId, taskIn)
      .toPromise()
      .then((resp: any) => {
        this.isEditSuccess = true;
      })
      .catch((error: any) => {
        let errorDetails = this.helperService.getErrorDetails(error);
        if (errorDetails !== "") {
          errorMessage = `<b>${errorMessage}</b>` + errorDetails;
        }
        this.isEditSuccess = false;
      });
    if (this.isEditSuccess) {
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
  }

  showNotification(info: any) {
    this.notificationService.showNotification(info);
  }

  /*updateDb(isEditSuccess, sourceItemObj, newItemId) {
    if (isEditSuccess) {
      delete this.items[sourceItemObj.id];
      this.items[newItemId] = sourceItemObj;
      this.gstcState.update("config.chart.items", this.items);
      this.originalItems = JSON.stringify(this.items);
    } else {
      this.items = {};
      this.items = JSON.parse(this.originalItems);
      this.gstcState.update("config.chart.items", this.items);
    }
  }*/

  updateDb(isEditSuccess, sourceItemObj, newItemId) {
    var status = "success"; // db update status
    if (isEditSuccess) {
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

  dayView() {
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
  }

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

  getResourceColumn() {
    const columns = {
      percent: 100,
      resizer: {
        inRealTime: true,
      },
      data: {
        department: {
          id: "department",
          data: "label",
          expander: true,
          isHTML: true,
          width: 200,
          minWidth: 100,
          header: {
            html: "Department",
          },
        },
        firstName: {
          id: "firstName",
          data: "firstName",
          isHTML: true,
          width: 150,
          minWidth: 150,
          header: {
            html: "First Name",
          },
        },
        lastName: {
          id: "lastName",
          data: "lastName",
          isHTML: true,
          width: 150,
          minWidth: 150,
          header: {
            html: "Last Name",
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
    /*await this.getShows();
    if (this.showId) {
      await this.getShotList();
      await this.getAssetList();
    }*/
    this.weekEnds = [];
    for (let i = 0; i < AppConstants.WEEK_ENDS.length; i++) {
      this.weekEnds.push(AppConstants.DAY_INDEX[AppConstants.WEEK_ENDS[i]]);
    }
    this.isDataReady = true;
    this.initChart();
  }

  isValidArr(arr: any) {
    return this.helperService.isValidArr(arr);
  }

  submitHandler() {
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

/*response = {
            entity: [
              {
                id: 21,
                department: "Paint",
                resources: [
                  {
                    id: 15,
                    firstName: "Afzal",
                    lastName: "A",
                    tasks: [
                      {
                        id: 695,
                        taskName: "Paint",
                        startDate: "2020-06-03 00:00:00",
                        endDate: "2020-06-03 23:59:59",
                        workStatusId: 32,
                        taskTypeName: "Paint",
                        taskColorCode: "#409FFF",
                        workStatus: "Client review",
                        completionPercentage: "0.0",
                        //shotCode: "shotCode",
                        assetName: "assetName",
                        showName: "showName",
                        taskType: "taskType",
                      },
                    ],
                  },
                ],
              },
            ],
            errorProperties: [],
            httpStatus: "OK",
            errMsg: "",
            total: 1,
            valid: true,
          };*/
