import { Component, OnInit, ViewEncapsulation, Input } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { WorkstatusService } from "src/app/modules/system/configs/workstatus.service";
import { ShowsService } from "src/app/modules/system/shows/shows.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { NotificationService } from "src/app/modules/core/services/notification.service";

declare const jKanban: any;

@Component({
  selector: "app-kanban",
  templateUrl: "./kanban.component.html",
  styleUrls: ["./kanban.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class KanbanComponent implements OnInit {
  @Input() kanbanStatus: any;
  @Input() startDate: any;
  @Input() endDate: any;
  isDataReady: boolean;
  isDataFramed: boolean;
  kanbanChartRef: any;
  //isLoading: boolean;

  task = {
    id: 0,
    name: "",
    endDate: "-",
    typeName: "",
    typeColorCode: "",
    accName: "",
    priority: "",
    workStatus: "",
    statusColorCode: "",
    thumb: "",
    showName: "",
    parentName: "",
    taskTypeCode: "",
  };

  workStatusInfo = {
    id: 0,
    code: "",
    taskObj: [],
  };

  kanbanObj = [];
  emptyKanbanObj = [];
  filledKanbanObj = [];

  kanbanData = {
    id: "",
    title: "",
    class: "",
    style: "",
    item: [],
    isDisabled: false,
  };

  workStatus = {};
  workStatusByRole: any;

  constructor(
    private http: HttpClient,
    private workstatusService: WorkstatusService,
    private showsService: ShowsService,
    private notificationService: NotificationService,
    private helperService: HelperService
  ) {}

  ngOnInit() {
    this.prepareData();
    //this.getWorkStatus();
  }

  updateKanbanStatus(kanbanStatus: any, startDate: any, endDate: any) {
    this.isDataReady = false;
    this.kanbanStatus = kanbanStatus;
    this.startDate = startDate;
    this.endDate = endDate;
    setTimeout(() => {
      this.prepareData();
    }, 100);
  }

  async prepareData() {
    this.isDataFramed = false;
    this.resetAll();
    await this.getWorkstatusByRole();
    this.getKanbanWorkstatus();
  }

  async getWorkstatusByRole() {
    await this.workstatusService
      .getWorkstatusByRole()
      .toPromise()
      .then((resp: any) => {
        this.workStatusByRole = resp.entity;
      })
      .catch((error: any) => {
        this.workStatusByRole = [];
      });
  }

  workStatusIds = [];

  async getKanbanWorkstatus() {
    this.workStatus = {};
    const ref = this;
    await this.workstatusService
      .getKanbanWorkstatus()
      .toPromise()
      .then((resp: any) => {
        let responseAny;
        responseAny = resp;
        if (responseAny && responseAny.entity) {
          let entityInfo = responseAny.entity.filter((o) =>
            this.kanbanStatus.find((o2) => o.id === o2.id)
          );

          /*let c = this.customFields.filter(
            (o) => !this.parentOutCopy.customFields.find((o2) => o.id === o2.id)
          );*/

          //for (const data of responseAny.entity) {
          this.workStatusIds = [];
          for (const data of entityInfo) {
            if (data.name in ref.workStatus === false) {
              ref.workStatus[data.name] = {};
            }
            ref.workStatusInfo.id = data.id;
            ref.workStatusInfo.code = data.code;
            ref.workStatusInfo.taskObj = [];
            ref.workStatus[data.name] = JSON.parse(
              JSON.stringify(ref.workStatusInfo)
            );
            this.workStatusIds.push(data.id);
          }
          console.log("workStatusIds >>> ", this.workStatusIds);
          this.getArtistTaskList();
        }
        //this.workStatuses = resp.entity;
      })
      .catch((error: any) => {
        //alert("Error 1");
        //this.workStatuses = [];
      });
  }

  async getArtistTaskList() {
    const ref = this;
    let params = "";
    if (this.startDate) {
      params +=
        "startDate=" +
        this.helperService.transformDate(this.startDate, "yyyy-MM-dd");
    }
    if (this.endDate) {
      if (params) {
        params += "&";
      }
      params +=
        "endDate=" +
        this.helperService.transformDate(this.endDate, "yyyy-MM-dd");
    }
    if (params) {
      params += "&";
    }
    params += "workStatusIds=" + this.workStatusIds;
    await this.showsService
      .getArtistTaskList(params)
      .toPromise()
      .then((resp: any) => {
        let responseAny;
        responseAny = resp;
        if (responseAny && responseAny.entity) {
          //const data = responseAny.entity[0];
          for (const data of responseAny.entity) {
            ref.task.id = data.id;
            ref.task.name = data.taskName;
            if (
              this.helperService.transformDate(data.endDate, "MMM dd, yyyy")
            ) {
              ref.task.endDate = this.helperService.transformDate(
                data.endDate,
                "MMM dd, yyyy"
              );
            } else {
              ref.task.endDate = "<span>           NA</span>";
            }
            ref.task.typeName = data.taskTypeName;
            ref.task.typeColorCode = data.taskColorCode;
            if (data.accountableName) {
              ref.task.accName = data.accountableName;
            } else {
              ref.task.accName = "NA";
            }

            if (data.priority) {
              ref.task.priority = data.priority;
            } else {
              ref.task.priority = "NA";
            }

            ref.task.workStatus = data.workStatus;
            ref.task.statusColorCode = data.statusColorCode;
            if (data.userThumbnail) {
              ref.task.thumb = data.userThumbnail;
            } else {
              ref.task.thumb = "";
            }

            ref.task.showName = data.showName;
            ref.task.parentName = "NA";
            if (data.shotCode) {
              ref.task.parentName = data.shotCode;
            } else if (data.assetName) {
              ref.task.parentName = data.assetName;
            }
            ref.task.taskTypeCode = data.taskTypeCode;
            if (
              ref.workStatus[data.workStatus] &&
              ref.workStatus[data.workStatus].taskObj
            ) {
              ref.workStatus[data.workStatus].taskObj.push(
                JSON.parse(JSON.stringify(ref.task))
              );
            }
          }
          this.frameKanbanData();
          this.isDataReady = true;
          setTimeout(() => {
            this.isDataFramed = true;
            this.loadKanbanChart();
          }, 10);
        }
      })
      .catch((error: any) => {
        alert("Error 2");
        //this.workStatuses = [];
      });
  }

  frameKanbanData() {
    //let disabledStatus = ["Approved", "Internal Approved"];
    let editableWorkStatus = this.workStatusByRole.map((item: any) => {
      return item.name;
    });
    const xKeyNames = Object.keys(this.workStatus);
    for (const [k, v] of xKeyNames.entries()) {
      this.kanbanData.id = v + "_" + this.workStatus[v].id;
      this.kanbanData.title = v;
      this.kanbanData.isDisabled = true;
      if (editableWorkStatus.includes(v)) {
        this.kanbanData.isDisabled = false;
      }

      this.kanbanData.class = "kanbanTitleCustom";
      this.kanbanData.style = "border-top-color:" + this.workStatus[v].code;
      while (this.kanbanData.item.length) {
        this.kanbanData.item.pop();
      }

      for (const data of this.workStatus[v].taskObj) {
        if (data) {
          const frData = this.frameItemString(data);
          this.kanbanData.item.push(JSON.parse(JSON.stringify(frData)));
        }
      }
      if (this.workStatus[v].taskObj.length !== 0) {
        this.filledKanbanObj.push(JSON.parse(JSON.stringify(this.kanbanData)));
      } else {
        const itemObj = {
          title: "No Task",
          style: "color:white; border-left-color:#464646;",
        };
        // this.kanbanData.item.push(JSON.parse(JSON.stringify(itemObj)));
        this.emptyKanbanObj.push(JSON.parse(JSON.stringify(this.kanbanData)));
      }
    }
    this.kanbanObj = this.filledKanbanObj.concat(this.emptyKanbanObj);
  }

  frameItemString(data) {
    const itemObj = {
      title: "",
      style: "border-left-color:" + data.typeColorCode,
      id: data.id,
    };
    if (!data.thumb) {
      data.thumb = "assets/images/no-image.png";
    }

    //data.thumb = `https://www.cricbuzz.com/a/img/v1/152x152/i1/c170677/ms-dhoni.jpg`;

    //<!--<div class="row d-flex justify-content-between">-->
    const newStr = `    
    <div class="top-row">
      <div title="${data.showName}" class="col px-0 text-truncate bright-text">
        ${data.showName}
      </div>
      <div style="color:${data.typeColorCode};margin-left: 10px;" class="float-right bright-text">
        ${data.taskTypeCode}
      </div>
    </div>
    <div class="mid-row">
      <div class="row">
        <div title="${data.parentName}" class="col px-0 text-truncate">${data.parentName}</div>
      </div>
      <div class="row">
        <div title="${data.name}" class="col px-0 text-truncate dull-label">${data.name}</div>
      </div>
    </div>
    <div class="bot-row row">
      <div class="col-5 px-0">
        <div class="row dull-label">End Date</div>
        <div style="font-weight: bold;color: #ef5350;" class="row">
          ${data.endDate}
        </div>
      </div>
      <div class="col-4 px-0">
        <div class="row dull-label">Priority</div>
        <div class="row" style="font-weight: bold;color:${data.statusColorCode}">
          ${data.priority}
        </div>
      </div>
      <div
        title="${data.accName}"
        class="col px-0 d-flex align-items-center justify-content-end"
      >        
        
        <img src="${data.thumb}" onerror='this.src = "assets/images/no-image.png"' class="avatar">
      </div>
  </div>`;

    //<img src="${data.thumb}" class="avatar"/>
    //<div class="avatar" style="max-width: 100%;max-height: 100%;margin:auto;background-image:url(${data.thumb}),url('assets/images/no-image.png')"></div>
    //`<div class="avatar" style="max-width: 100%;max-height: 100%;margin:auto;background-image:url(${data.thumb}),url('assets/images/no-image.png')"></div>`

    //<img src="https://www.cricbuzz.com/a/img/v1/152x152/i1/c170677/ms-dhoni.jpg" class="avatar">
    //<img src="${data.thumb}" class="avatar">

    /*const tempStr =
      "<div><span>" +
      data.typeName +
      "</span><span style='float: right;color: #ef5350;'>End Date</span>" +
      "</div><div style='padding-bottom: 10px;'><div style='color: " +
      data.typeColorCode +
      ";width: 60%;float: left;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;'>" +
      data.name +
      "</div>" +
      "<div style='text-align: right;float: right;width: 40%;'>" +
      data.endDate +
      "</div></div><div>Accountable</div>" +
      "<div style='padding-bottom: 10px;'><img src='" +
      data.thumb +
      "' class='avatar'>" +
      data.accName +
      "</div>" +
      "<div>Priority: <span style='color: " +
      data.statusColorCode +
      ";font-weight: 600;'>" +
      data.priority +
      "</span></div>";
    itemObj.title = tempStr;*/

    itemObj.title = newStr;
    return itemObj;
  }

  loadKanbanChart() {
    this.kanbanChartRef = new jKanban({
      element: "#demo1",
      gutter: "15px",
      widthBoard: "300px",
      // itemHandleOptions: {
      //   enabled: false,
      //   handleClass: 'item_handle',
      //   customCssHandler: 'drag_handler',
      //   customCssIconHandler: 'drag_handler_icon',
      //   customHandler: '<span class=\'item_handle\'>+</span> %s',
      // },
      addItemButton: false,
      click: (el) => {},
      dropEl: (el, target, source, sibling) => {
        //return;
        if (source === target) {
          return;
        }

        let taskId = el.getAttribute("data-eid");
        let currWorkStatusId = source.parentElement
          .getAttribute("data-id")
          .split("_")[1];
        let workStatusId = target.parentElement
          .getAttribute("data-id")
          .split("_")[1];
        if (currWorkStatusId !== workStatusId) {
          let taskIn = {
            type: "workStatusId",
            workStatusId: workStatusId,
          };
          this.updateConfirm(taskId, taskIn);
        }
      },
      dragEl: (el, source) => {},
      dragendEl: (el) => {},
      boards: this.kanbanObj,
    });
  }

  async updateConfirm(taskId: any, taskIn: any) {
    let isEditSuccess = false;
    let errorMessage = "Record update failed.";
    await this.showsService
      .inlineEditTask(taskId, taskIn)
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
    //this.prepareData();
    if (!isEditSuccess) {
      this.updateKanbanStatus(this.kanbanStatus, this.startDate, this.endDate);
    }
  }

  showNotification(info: any) {
    this.notificationService.showNotification(info);
  }

  resetAll() {
    this.kanbanChartRef = null;
    this.task = {
      id: 0,
      name: "",
      endDate: "",
      typeName: "",
      typeColorCode: "",
      accName: "",
      priority: "",
      workStatus: "",
      statusColorCode: "",
      thumb: "",
      showName: "",
      //shotName: "",
      //assetName: "",
      parentName: "",
      taskTypeCode: "",
    };

    this.workStatusInfo = {
      id: 0,
      code: "",
      taskObj: [],
    };

    this.kanbanObj = [];
    this.emptyKanbanObj = [];
    this.filledKanbanObj = [];

    this.kanbanData = {
      id: "",
      title: "",
      class: "",
      style: "",
      item: [],
      isDisabled: false,
    };

    this.workStatus = {};
  }
}
