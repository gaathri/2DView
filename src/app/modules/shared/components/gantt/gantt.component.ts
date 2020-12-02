import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  TemplateRef,
} from "@angular/core";
import { GanttEditorComponent, GanttEditorOptions } from "ng-gantt";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { TasksService } from "src/app/modules/system/shows/tasks.service";
import { TasktypesService } from "src/app/modules/system/configs/tasktypes.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { differenceInDays } from "date-fns";
import { Router } from "@angular/router";
import { NzDrawerService } from "ng-zorro-antd";
import { GanttFilterSettingsComponent } from "src/app/modules/system/modals/gantt-filter-settings/gantt-filter-settings.component";
import { ShowsService } from "src/app/modules/system/shows/shows.service";
import { ShotsService } from "src/app/modules/system/shows/shots.service";
import { AssetsService } from "src/app/modules/system/shows/assets.service";
import { HelperService } from "src/app/modules/core/services/helper.service";

declare const addTaskColorStyleString: any;
export class GanttData {
  pID = 0;
  pName = "";
  pStart = "";
  pEnd = "";
  pPlanStart = "";
  pPlanEnd = "";
  pClass = "";
  pLink = "";
  pMile = 0;
  pRes = "";
  //pComp = 0;
  pGroup = 0;
  pParent = 0;
  pOpen = 1;
  pDepend = "";
  pCaption = "";
  pNotes = "";
  days = "";
  artist = "";
  taskType = "";
  workStatus = "";
  pBarText = "";
  entityType = "";
}

declare function createMovableSlider(): any;

@Component({
  selector: "app-gantt",
  templateUrl: "./gantt.component.html",
  styleUrls: ["./gantt.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class GanttComponent implements OnInit {
  public editorOptions: GanttEditorOptions;
  public data: any;
  isVisible = false;
  isConfirmLoading = false;
  modalTitleText = "";
  validateForm: FormGroup;
  options;
  toolTipTemplate;
  dataArr = [];
  isSpinning = false;

  showArray = [];
  shotArray = [];
  assetArray = [];
  taskArray = [];
  currIndex = 0;

  type: any = "shots";

  @ViewChild(GanttEditorComponent, { static: false })
  editorComp: GanttEditorComponent;

  @ViewChild("drawerHeader", { static: false }) drawerHeader: TemplateRef<{}>;
  drawerTitle: any;
  isFilterApplied: boolean;
  taskFilters: any;
  childDrawerRef: any;
  isEmptyData: boolean;

  shows: any;
  showId: any;
  shots: any;
  shotIds: any;
  assets: any;
  assetIds: any;
  isDataReady;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private showsService: ShowsService,
    private shotsService: ShotsService,
    private assetsService: AssetsService,
    private tasksService: TasksService,
    private tasktypeService: TasktypesService,
    private router: Router,
    private drawerService: NzDrawerService,
    private helperService: HelperService
  ) {}

  async prepareData() {
    await this.getShows();
    if (this.showId) {
      await this.getShotList();
      await this.getAssetList();
    }
    this.isDataReady = true;
    this.prepareGantt();
  }

  isValidArr(arr: any) {
    return this.helperService.isValidArr(arr);
  }

  submitHandler() {
    this.changeData(this.type);
  }

  async showChangeHandler(e) {
    this.showId = e;
    this.shotIds = null;
    this.assetIds = null;
    if (this.showId) {
      await this.getShotList();
      await this.getAssetList();
    }
    this.changeData(this.type);
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

  ngOnInit() {
    this.prepareData();
  }

  prepareGantt() {
    this.options = {
      vFormat: "day",
      vQuarterColWidth: "30",
      vMonthColWidth: "20",
      vDayColWidth: "5",
      vWeekColWidth: "20",
      vDateTaskDisplayFormat: "day dd month yyyy",
      vDayMajorDateDisplayFormat: "mon yyyy - Week ww",
      vWeekMinorDateDisplayFormat: "dd mon",
      vCaptionType: "Complete",
      vScrollTo: new Date(),
      vShowDur: 0,
      vShowRes: 0,
      vShowStartDate: 0,
      vShowTaskInfoLink: 0,
      vTooltipDelay: 100,
      vShowEndDate: 0,
      vShowComp: 0,
      vUseSingleCell: 1,
      vColumnOrder: ["vShowDur", "vAdditionalHeaders"],
      vAdditionalHeaders: {
        days: {
          title: "Days",
        },
        artist: {
          title: "Artist",
        },
        taskType: {
          title: "Task Type",
        },
        workStatus: {
          title: "Status",
        },
        /*exSpan: {
          title: "",
        },*/
      },
      vEvents: {
        taskname: (e) => {
          this.handleClick(e);
        },
        afterDraw: () => {
          this.isSpinning = false;
          createMovableSlider();
        },
      },
      /*vEventClickRow: (e) => {        
        if (e.getGroup() === 0) {
          
          this.modalTitleText = "Edit " + e.getName();
          this.validateForm.controls.resourceName.setValue(e.getResource());
          this.validateForm.controls.duration.setValue(e.getDuration());
          this.validateForm.controls.startDate.setValue(e.getStart());
          this.validateForm.controls.endDate.setValue(e.getEnd());
          this.validateForm.controls.workStatus.setValue("notStarted");
          //this.isVisible = true;
        }
      },*/
    };
    this.validateForm = this.fb.group({
      resourceName: [null, [Validators.required]],
      duration: [null, [Validators.required]],
      startDate: [null],
      endDate: [null],
      workStatus: [null],
    });
    this.setFilters();
    this.changeData("shots");
  }

  handleClick(e) {
    let entityType = null;
    if (
      e &&
      e.getAllData() &&
      e.getAllData().pDataObjec &&
      e.getAllData().pDataObjec.entityType
    ) {
      entityType = e.getAllData().pDataObjec.entityType;
      let entityArr = entityType.split("_");
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
      }
    }
  }

  radioChangeHandler(e) {
    this.taskFilters.showId = null;
    this.taskFilters.shotIds = [];
    this.taskFilters.assetIds = [];

    this.type = e;
    this.changeData(this.type);
  }

  changeData(type) {
    this.isSpinning = true;
    this.currIndex = 0;
    this.resetArray();
    this.chartData(type);
  }

  resetArray() {
    while (this.showArray.length) {
      this.showArray.pop();
    }
    while (this.shotArray.length) {
      this.shotArray.pop();
    }
    while (this.assetArray.length) {
      this.assetArray.pop();
    }
    while (this.taskArray.length) {
      this.taskArray.pop();
    }
    while (this.dataArr.length) {
      this.dataArr.pop();
    }
  }

  async chartData(type) {
    // type = 'assets';
    let url = "";
    let serviceName = "";
    if (type === "shots") {
      serviceName = "getShotTasks";
    } else if (type === "assets") {
      serviceName = "getAssetTasks";
    } else if (type === "myWork") {
      //url = "http://localhost:4200/assets/myWork.json";
    }

    /*let filterParams = this.getFilterParams();
    this.isFilterApplied = false;
    let params = ""; //"shotIds=19&showId=2";
    if (filterParams !== "") {
      this.isFilterApplied = true;
      params += `${filterParams}`;
    }*/

    let params = "";
    if (this.showId) {
      params += `showId=${this.showId}`;
      if (this.type == "shots") {
        if (this.isValidArr(this.shotIds)) {
          params += `&shotIds=${this.shotIds.toString()}`;
        }
      } else if (this.type == "assets") {
        if (this.isValidArr(this.assetIds)) {
          params += `&assetIds=${this.assetIds.toString()}`;
        }
      }
    }

    this.isEmptyData = false;

    if (serviceName) {
      await this.tasksService[serviceName](params)
        .toPromise()
        .then((response) => {
          if (response && response.entity && response.entity.length > 0) {
            this.getTaskColor(response, type);
          } else {
            this.isEmptyData = true;
          }
        })
        .catch((error) => {
          this.isEmptyData = true;
        });
    }
  }

  getTaskColor(dataArray, type) {
    this.tasktypeService.getTasktypes().subscribe(
      (resp) => {
        if (resp && resp.valid && resp.entity) {
          for (const data of resp.entity) {
            addTaskColorStyleString(
              ".task-color-" + data.colorCode.split("#")[1],
              "{ border-radius: 6px; height: 14px; background:#FFFFFF; }"
            );
            addTaskColorStyleString(
              ".task-color-" + data.colorCode.split("#")[1] + "complete",
              "{ border-radius: 6px; width: 0%; height: 14px; background:" +
                data.colorCode +
                "; }"
            );
          }
        }
        this.loadChartData(dataArray, type);
      },
      (error) => {}
    );
  }

  getTaskColorOriginal(dataArray, type) {
    const ref = this;
    this.http
      .get("http://localhost:4200/assets/taskMaster.json")
      .subscribe((response) => {
        let responseAny;
        responseAny = response;
        if (responseAny && responseAny.entity) {
          for (const data of responseAny.entity) {
            addTaskColorStyleString(
              ".task-color-" + data.colorCode.split("#")[1],
              "{ border-radius: 6px; height: 14px; background:#FFFFFF; }"
            );
            addTaskColorStyleString(
              ".task-color-" + data.colorCode.split("#")[1] + "complete",
              "{ border-radius: 6px; height: 14px; background:" +
                data.colorCode +
                "; }"
            );
          }
        }
        ref.loadChartData(dataArray, type);
      });
  }

  loadChartData(dataArray, type) {
    if (dataArray && dataArray.entity && dataArray.entity.length > 0) {
      if (type === "shots" || type === "assets") {
        dataArray.entity.map((entity) => {
          if (type === "shots" && entity.type === "shot") {
            this.getShowDetails(entity, "shot", 0, 1);
          } else if (type === "assets" && entity.type === "asset") {
            this.getShowDetails(entity, "asset", 0, 1);
          }
        });
      } else if (type === "myWork") {
        this.addShotNode();
        dataArray.entity.map((entityData) => {
          if (entityData.type === "shot") {
            this.getShowDetails(entityData, "shot", 1, 0);
          }
        });
        this.addAssetNode();
        dataArray.entity.map((entityData) => {
          if (entityData.type === "asset") {
            this.getShowDetails(entityData, "asset", this.currIndex, 0);
          }
        });
      }
    }
    this.editorComp.setOptions(this.options);
    this.editorComp.data = this.dataArr;
    //this.editorComp.getEditor().setScrollTo(new Date());
  }

  addShotNode() {
    this.currIndex++;
    const ganttData = new GanttData();
    ganttData.pID = 1;
    ganttData.pName = "Shots";
    ganttData.pStart = "";
    ganttData.pEnd = "";
    ganttData.pGroup = 1;
    ganttData.pClass = "ggroupCommon";
    ganttData.pRes = "";
    ganttData["pComp"] = 0;
    ganttData.pParent = 0;
    ganttData.pOpen = 1;
    ganttData.pDepend = "";
    this.dataArr.push(ganttData);
  }

  addAssetNode() {
    this.currIndex++;
    const ganttData = new GanttData();
    ganttData.pID = this.currIndex;
    ganttData.pName = "Assets";
    ganttData.pStart = "";
    ganttData.pEnd = "";
    ganttData.pGroup = 1;
    ganttData.pClass = "ggroupCommon";
    ganttData.pRes = "";
    //ganttData.pComp = 0;
    ganttData["pComp"] = 0;
    ganttData.pParent = 0;
    ganttData.pOpen = 1;
    ganttData.pDepend = "";
    this.dataArr.push(ganttData);
  }

  checkElement(arr, searchString) {
    let val = -1;
    arr.map((elem) => {
      if (elem[0] === searchString) {
        val = elem[1];
      }
    });
    return val;
  }

  getTaskId(index) {
    let val = null;
    this.taskArray.map((elem) => {
      if (elem[1] === index) {
        val = elem[0].split("_").pop();
      }
    });
    return val;
  }

  getShowDetails(entity, type, parentId, isOpen) {
    let getIndex = this.checkElement(
      this.showArray,
      entity.showName + "_" + entity.showId
    );
    if (getIndex === -1) {
      this.currIndex++;
      getIndex = this.currIndex;
      this.showArray.push([
        entity.showName + "_" + entity.showId,
        this.currIndex,
      ]);
      const ganttData = new GanttData();
      ganttData.pID = this.currIndex;
      ganttData.pName = `<span class='gantt-show'>${entity.showName}</span>`;
      ganttData.pStart = "";
      ganttData.pEnd = "";
      ganttData.pGroup = 1;
      ganttData.pClass = "ggroupCommon";
      ganttData.pRes = "";
      //ganttData.pComp = 0;
      ganttData["pComp"] = 0;
      ganttData.pParent = parentId;
      ganttData.pOpen = isOpen;
      ganttData.pDepend = "";
      ganttData.entityType = "show_" + entity.showId;
      this.dataArr.push(ganttData);
    }
    if (type === "shot") {
      this.getShotDetails(entity, getIndex);
    } else {
      this.getAssetDetails(entity, getIndex);
    }
  }

  getAssetDetails(entity, parentId) {
    let getIndex = this.checkElement(
      this.assetArray,
      entity.assetName + "_" + entity.assetId
    );
    if (getIndex === -1) {
      this.currIndex++;
      getIndex = this.currIndex;
      this.assetArray.push([
        entity.assetName + "_" + entity.assetId,
        this.currIndex,
      ]);
      const ganttData = new GanttData();
      ganttData.pID = this.currIndex;
      ganttData.pName = `<span class='gantt-asset'>${entity.assetName}</span>`;
      ganttData.pRes = "";
      ganttData.pParent = parentId;
      ganttData.pGroup = 1;
      ganttData.pStart = "";
      ganttData.pEnd = "";
      ganttData.pClass = "ggroupCommon";
      //ganttData.pComp = 0;
      ganttData["pComp"] = 0;
      ganttData.pOpen = 1;
      ganttData.pDepend = "";
      ganttData.entityType = "asset_" + entity.showId + "_" + entity.assetId;
      this.dataArr.push(ganttData);
    }
    this.getTaskDetails(entity, getIndex, "asset");
  }

  getShotDetails(entity, parentId) {
    let getIndex = this.checkElement(
      this.shotArray,
      entity.shotCode + "_" + entity.shotId
    );
    if (getIndex === -1) {
      this.currIndex++;
      getIndex = this.currIndex;
      this.shotArray.push([
        entity.shotCode + "_" + entity.shotId,
        this.currIndex,
      ]);
      const ganttData = new GanttData();
      ganttData.pID = this.currIndex;
      ganttData.pName = `<span class='gantt-shot'>${entity.shotCode}</span>`;
      ganttData.pRes = "";
      ganttData.pParent = parentId;
      ganttData.pGroup = 1;
      ganttData.pStart = "";
      ganttData.pEnd = "";
      ganttData.pClass = "ggroupCommon";
      //ganttData.pComp = 0;
      ganttData["pComp"] = 0;
      ganttData.pOpen = 1;
      ganttData.pDepend = "";
      ganttData.entityType = "shot_" + entity.showId + "_" + entity.shotId;
      this.dataArr.push(ganttData);
    }
    this.getTaskDetails(entity, getIndex, "shot");
  }

  myFunction() {}

  getTaskDetails(entity, parentId, type) {
    let getIndex = this.checkElement(
      this.taskArray,
      entity.taskName + "_" + entity.id
    );
    if (getIndex === -1) {
      this.currIndex++;
      getIndex = this.currIndex;
      this.taskArray.push([entity.taskName + "_" + entity.id, this.currIndex]);
      const ganttData = new GanttData();
      ganttData.pID = this.currIndex;
      ganttData.pName = `<span class='gantt-task'>${entity.taskName}</span>`;
      ganttData.pRes = entity.artistName === undefined ? "" : entity.artistName;
      ganttData["pComp"] = "0";
      if (entity.completionPercentage) {
        ganttData["pComp"] = entity.completionPercentage;
      }
      /* else {
        delete ganttData.pComp;
      }*/
      let artist = entity.artistName === undefined ? "" : entity.artistName;
      let days = 0;
      if (entity.startDate && entity.endDate) {
        try {
          days = differenceInDays(
            new Date(entity.endDate),
            new Date(entity.startDate)
          );
        } catch (e) {}
      }

      ganttData.days = `<span style="font-weight: 500; font-size: 14px;">${days}</span>`;
      ganttData.artist = `<span style="font-weight: 500; font-size: 14px;" title="${artist}">${artist}</span>`;
      // ${ganttData["pComp"]} -
      ganttData.taskType = `<span style="color:${entity.taskColorCode};font-weight: 500; font-size: 14px;" title="${entity.taskTypeName}">${entity.taskTypeName}</span>`;
      ganttData.workStatus = `<button style="background-color: ${entity.statusColorCode}; font-weight: 400; border: none;border-radius: 6px; color: white; font-size: 12px; margin: 5px;" title="${entity.workStatus}">${entity.workStatus} </button>`;

      ganttData.pGroup = 0;
      ganttData.pParent = parentId;
      ganttData.pStart = entity.startDate;
      ganttData.pEnd = entity.endDate;
      ganttData.pClass = "task-color-" + entity.taskColorCode.split("#")[1];
      ganttData.pOpen = 1;
      ganttData.pDepend = "";
      if (type === "shot") {
        ganttData.entityType = `shottask_${entity.showId}_${entity.shotId}_${entity.id}`;
      } else if ((type = "asset")) {
        ganttData.entityType = `assettask_${entity.showId}_${entity.assetId}_${entity.id}`;
        /*ganttData.entityType =
          "asset_task_" +
          entity.showId +
          "_" +
          entity.assetId +
          "_" +
          entity.id;*/
      }
      this.dataArr.push(ganttData);
    }
  }

  handleOk(): void {
    this.isConfirmLoading = true;
    this.dataArr.push({
      pID: 12001,
      pName: "Task 5",
      pStart: "2017-02-21",
      pEnd: "2017-03-09",
      pClass: "red",
      pLink: "",
      pMile: 0,
      pRes: "Rajesh",
      pComp: 60,
      pGroup: 0,
      pParent: 12,
      pOpen: 1,
      pDepend: "",
      pCaption: "",
      pNotes: "",
    });
    setTimeout(() => {
      this.isVisible = false;
      this.isConfirmLoading = false;
      this.editorComp.data = this.dataArr;
    }, 3000);
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  submitForm(): void {}
  getDisplayDateFormat() {
    return AppConstants.DISPLAY_DATE_FORMAT;
  }

  filterHandler() {
    this.drawerTitle = "Filter Settings";
    this.openFilterSettingsForm();
  }

  openFilterSettingsForm(): void {
    this.childDrawerRef = this.drawerService.create<
      GanttFilterSettingsComponent,
      {
        type: any;
        filters: any;
      },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: GanttFilterSettingsComponent,
      nzContentParams: {
        type: this.type,
        filters: this.taskFilters,
      },
      nzClosable: false,
      nzWidth: "40%",
      nzWrapClassName: "modal-wrapper",
    });

    this.childDrawerRef.afterOpen.subscribe(() => {});

    this.childDrawerRef.afterClose.subscribe((data) => {
      if (data) {
        if (JSON.stringify(this.taskFilters) !== JSON.stringify(data)) {
          this.taskFilters = data;
          this.changeData(this.type);
        } else {
        }
      }
    });
  }

  closeForm(): void {
    this.childDrawerRef.close();
  }

  setFilters() {
    this.taskFilters = {
      showId: null,
      shotIds: [],
      assetIds: [],
    };
  }

  getFilterParams() {
    let filterParams = "";
    for (let i in this.taskFilters) {
      let item = this.taskFilters[i];
      if (item && item.length > 0) {
        if (filterParams != "") {
          filterParams += "&";
        }
        filterParams += `${i}=${item.toString()}`;
      }
    }

    if (this.taskFilters.showId) {
      if (filterParams != "") {
        filterParams += "&";
      }
      filterParams += `showId=${this.taskFilters.showId}`;
    }

    return filterParams;
  }
}
