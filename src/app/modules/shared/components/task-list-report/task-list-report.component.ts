import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  Input,
} from "@angular/core";
import { Page } from "../../model/page";
import { DaybookService } from "src/app/modules/system/dashboards/daybook.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { ShowsService } from "src/app/modules/system/shows/shows.service";
import { NzDrawerService } from "ng-zorro-antd";
import { AppConstants } from "src/app/constants/AppConstants";
import { TaskFilterSettingsComponent } from "src/app/modules/system/modals/task-filter-settings/task-filter-settings.component";
import { NoteFormComponent } from "src/app/modules/system/modals/note-form/note-form.component";
import { WorkstatusService } from "src/app/modules/system/configs/workstatus.service";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { Router } from "@angular/router";
import { subMonths, subQuarters, endOfMonth } from "date-fns";

@Component({
  selector: "app-task-list-report",
  templateUrl: "./task-list-report.component.html",
  styleUrls: ["./task-list-report.component.scss"],
})
export class TaskListReportComponent implements OnInit {
  @ViewChild("myTable", { static: false }) table: any;
  @ViewChild("myGroupHeader", { static: false }) groupHeader: any;
  @ViewChild("drawerHeader", { static: false }) drawerHeader: TemplateRef<{}>;
  @Input() listType: any;

  isRowGroupEnabled: boolean = true;
  showDummy: boolean;
  childDrawerRef: any;
  isEmptyData: boolean;
  isDataReady: boolean;
  isLoading: boolean = true;
  rows: any;
  //showId: any;
  page = new Page();
  selectedPageSize: any;
  tableColumns: any;
  selectedTableColumns: any;
  intervalId: any;
  pageSizeOptions: any;
  drawerTitle: any;
  currPageInfo: any;
  isSearching: boolean;
  searchPattern = "";
  taskFilters: any;
  sortBy: any = "";
  orderBy: any = "";
  shows: any;
  types: any;
  type: any = "shot";
  dateTypes: any;
  dateTypeId = "clientEta";

  groupBy: any;
  role: any;
  isArtist: any;
  date: any = new Date();

  /** Dropdown inline edit vars - START */
  isEditSuccess: boolean;
  editing = {};
  isVisible: boolean;
  modalTitle: any;
  myrow: any;
  mycol: any;

  allWorkStatuses: any;
  isWorkStatusSelect: boolean;
  isRevisionSelect: boolean;
  workStatuses: any;
  selectedWorkStatusId: any;

  /** Dropdown inline edit vars - END*/

  isFilterApplied: boolean;
  revisions: any;
  revisionId: any;

  constructor(
    private daybookService: DaybookService,
    private helperService: HelperService,
    private showsService: ShowsService,
    private workstatusService: WorkstatusService,
    private drawerService: NzDrawerService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.page.pageNumber = 0;
    this.page.size = 50;
    this.pageSizeOptions = AppConstants.TABLE_PAGE_SIZE_OPTIONS;
    this.selectedPageSize = this.page.size; //.toString();
  }

  ngOnInit() {
    this.role = this.helperService.getRole();
    this.isArtist = this.checkArtist();
    this.prepareData();
  }

  onTaskNameClick(row: any) {
    let routerLink = "";
    if (this.isArtist) {
      routerLink = this.router.url + "/" + row.id;
    } else {
      let routerUrl = "";
      if (row.showId) {
        routerUrl = "/system/listing/shows/" + row.showId;
        if (this.isRowGroupEnabled) {
          if (this.type === "shot" && row.shotId && row.id) {
            routerLink =
              routerUrl + "/shots/" + row.shotId + "/tasks/" + row.id;
          } else if (this.type === "asset" && row.assetId && row.id) {
            routerLink =
              routerUrl + "/assets/" + row.assetId + "/tasks/" + row.id;
          }
        }
      }
    }

    if (routerLink !== "") {
      this.router.navigate([routerLink]);
    }
  }

  async getWorkstatusByRole() {
    await this.workstatusService
      .getWorkstatusByRole()
      .toPromise()
      .then((resp: any) => {
        this.workStatuses = resp.entity;
      })
      .catch((error: any) => {
        this.workStatuses = [];
      });
  }

  async getWorkstatusList() {
    await this.workstatusService
      .getWorkstatusList()
      .toPromise()
      .then((resp: any) => {
        this.allWorkStatuses = resp.entity;
      })
      .catch((error: any) => {
        this.workStatuses = [];
      });
  }

  /*showChangeHandler(e) {
    this.showId = e;
    this.currPageInfo.offset = 0;
    this.setPage(this.currPageInfo);
  }*/

  radioChangeHandler(e) {
    this.type = e;
    this.currPageInfo.offset = 0;
    this.taskFilters.showId = null;
    this.taskFilters.shotIds = [];
    this.taskFilters.assetIds = [];
    this.setGroupByValue();
    this.getTableColumns();
    this.tableColumns[0].defaultDisplay = this.type == "shot" ? true : false;
    this.tableColumns[1].defaultDisplay = this.type == "shot" ? false : true;
    this.setPage(this.currPageInfo);
  }

  disabledDate = (startValue: Date): boolean => {
    if (!startValue) {
      return false;
    }
    let today = new Date();
    //let last10 = new Date(today.setDate(today.getDate() - 8));
    let lastMonthDate = endOfMonth(subMonths(today, 1));
    let last3Months = subQuarters(lastMonthDate, 1);
    return startValue.getTime() < last3Months.getTime();
  };

  onDateChange(e) {
    this.date = e;
    this.currPageInfo.offset = 0;
    this.setPage(this.currPageInfo);
  }

  typeChangeHandler(e) {}

  filterHandler() {
    this.drawerTitle = "Filter Settings";
    this.openFilterSettingsForm();
  }

  getTableColumns() {
    this.tableColumns = [
      {
        name: "shotCode",
        displayName: "Shot Code",
        defaultDisplay: this.type == "shot" ? true : false,
        sortable: true,
        isEditable: false,
      },
      {
        name: "assetName",
        displayName: "Asset Name",
        defaultDisplay: this.type == "shot" ? false : true,
        sortable: true,
        isEditable: false,
      },
      {
        name: "showName",
        displayName: "Show Name",
        defaultDisplay: false,
        sortable: true,
        isEditable: false,
      },
      {
        name: "taskName",
        displayName: "Task Name",
        defaultDisplay: true,
        sortable: true,
        isEditable: false,
      },
      {
        name: "description",
        displayName: "Description",
        defaultDisplay: this.isArtist ? true : false,
        sortable: true,
        isEditable: false,
      },

      {
        name: "taskTypeName",
        displayName: "Task Type",
        defaultDisplay: true,
        sortable: true,
        isEditable: true,
      },
      {
        name: "workStatus",
        displayName: "Status",
        defaultDisplay: true,
        sortable: true,
        isEditable: this.isArtist ? true : false,
      },
      {
        name: "accountableName",
        displayName: "Accountable",
        defaultDisplay: true,
        sortable: true,
        isEditable: true,
      },
      {
        name: "artistBid",
        displayName: "Artist Bid",
        defaultDisplay: this.isArtist ? true : false,
        sortable: true,
        isEditable: false,
      },
      {
        name: "artistName",
        displayName: "Artist",
        defaultDisplay: this.isArtist ? false : true,
        sortable: true,
        isEditable: true,
      },
      {
        name: "clientName",
        displayName: "Client",
        defaultDisplay: this.isArtist ? false : true,
        sortable: true,
        isEditable: true,
      },
      {
        name: "priority",
        displayName: "Priority",
        defaultDisplay: true,
        sortable: true,
        isEditable: true,
      },
      {
        name: "completionPercentage",
        displayName: "Progress",
        defaultDisplay: true,
        sortable: false,
        isEditable: false,
      },
      {
        name: "startDate",
        displayName: "Start Date",
        defaultDisplay: true,
        sortable: true,
        isEditable: true,
      },
      {
        name: "endDate",
        displayName: "End Date",
        defaultDisplay: true,
        sortable: true,
        isEditable: true,
      },
      {
        name: "clientEta",
        displayName: "Client ETA",
        defaultDisplay: this.isArtist ? false : true,
        sortable: true,
        isEditable: true,
      },
      {
        name: "deliveryDate",
        displayName: "Delivery Date",
        defaultDisplay: this.isArtist ? false : true,
        sortable: true,
        isEditable: true,
      },
    ];
    this.frameSelectedColumns();
    this.isDataReady = true;
  }

  frameSelectedColumns() {
    this.selectedTableColumns = this.tableColumns.filter((item, index) => {
      item["index"] = index;
      return item.defaultDisplay;
    });
  }

  searchHandler() {
    this.isSearching = true;
  }

  allowEdit(row: any, col: any) {
    let editableWorkStatus = this.workStatuses.map((item: any) => {
      return item.name;
    });
    let editable = true;
    if (row && col && col.name && row[col.name]) {
      if (!editableWorkStatus.includes(row[col.name])) {
        editable = false;
      }
    }
    return editable;
  }

  searchDetails() {
    if (this.searchPattern == "") {
      this.isSearching = false;
    }
    this.currPageInfo.offset = 0;
    this.setPage(this.currPageInfo);
  }

  searchBlur() {
    if (this.searchPattern == "") {
      this.isSearching = false;
      this.currPageInfo.offset = 0;
      this.setPage(this.currPageInfo);
    }
  }

  clearSearch() {
    this.searchPattern = "";
    this.isSearching = false;
    this.currPageInfo.offset = 0;
    this.setPage(this.currPageInfo);
  }

  toggleExpandGroup(group) {
    this.table.groupHeader.toggleExpandGroup(group);
  }

  setGroupByValue() {
    if (this.isArtist) {
      //this.groupBy = this.type === "shot" ? "shotCode" : "assetName";
    }
    this.groupBy = "showName";
  }

  getGroupName(group) {
    return group.value[0][this.groupBy];
  }

  setPageSize() {
    let pageInfo = {
      pageSize: this.selectedPageSize,
      offset: 0,
    };
    this.setPage(pageInfo);
  }

  getSpace(_value: any) {
    let value = Math.floor(_value);
    if (value < 10) {
      return 2;
    } else if (value >= 10 && value < 100) {
      return 1;
    } else {
      return 0;
    }
  }

  setPage(pageInfo: any) {
    //this.rows = [];
    this.currPageInfo = pageInfo;
    this.isLoading = true;
    this.page.pageNumber = pageInfo.offset;
    this.page.size = pageInfo.pageSize;
    this.page.search = this.searchPattern;
    this.page.sortBy = this.sortBy;
    this.page.orderBy = this.orderBy;
    this.showDummy = true;
    let params = "";
    let serviceName = "";

    //params = `search=${this.page.search}&pageNo=${this.page.pageNumber}&pageSize=${this.page.size}&sortBy=${this.page.sortBy}&orderBy=${this.page.orderBy}&date=${dateStr}`;
    params = `search=${this.page.search}&pageNo=${this.page.pageNumber}&pageSize=${this.page.size}&sortBy=${this.page.sortBy}&orderBy=${this.page.orderBy}`;
    if (!this.isArtist) {
      let date = new Date();
      let dateStr = "";
      if (this.date) {
        date = this.date;
      }
      dateStr = this.helperService.transformDate(date, "yyyy-MM-dd");
      params += `&dateType=${this.dateTypeId}&date=${dateStr}`;
    }
    let filterParams = this.getFilterParams();
    this.isFilterApplied = false;
    if (filterParams !== "") {
      this.isFilterApplied = true;
      params += `&${filterParams}`;
    }

    if (this.isArtist) {
      serviceName = "getMyTaskShotView";
      if (this.type === "asset") {
        serviceName = "getMyTaskAssetView";
      }
      //if (this.showId) {
      this.showsService[serviceName](null, params).subscribe(
        (resp) => {
          this.onDataReceived(resp);
        },
        (error) => {
          this.isLoading = false;
          this.onDataError(error);
        }
      );
      /*} else {
        this.rows = [];
      }*/
    } else {
      //params += `&showId=${this.showId}`;
      serviceName = "getShotViewReport";
      if (this.type === "asset") {
        serviceName = "getAssetViewReport";
      }
      this.daybookService[serviceName](params).subscribe(
        (resp) => {
          this.onDataReceived(resp);
          /*if (resp && resp.valid) {
            this.page.totalElements = resp.total;
            this.page.totalPages = Math.ceil(resp.total / this.page.size);
            this.rows = resp.coll;
            setTimeout(() => {
              try {
                let parentHeight = this.table.bodyComponent.scroller.parentElement.getBoundingClientRect()
                  .height;
                let childHeight = this.table.bodyComponent.scroller.element.getBoundingClientRect()
                  .height;
                if (childHeight > parentHeight) {
                  this.showDummy = false;
                } else {
                  this.showDummy = true;
                }
              } catch (e) { }
            }, 500);
          } else {
            this.onDataError(resp);
          }
          this.isLoading = false;*/
        },
        (error) => {
          this.isLoading = false;
          this.onDataError(error);
        }
      );
    }
  }

  onDataReceived(resp: any) {
    if (resp && resp.valid) {
      this.page.totalElements = resp.total;
      this.page.totalPages = Math.ceil(resp.total / this.page.size);
      //resp = { "errorProperties": [], "httpStatus": "OK", "errMsg": "", "total": 2, "items": 10, "start": 0, "coll": [{ "id": 1092, "shotId": 55, "taskName": "005", "startDate": "2020-03-19 00:00:00", "endDate": "2020-03-31 23:59:59", "taskTypeName": "Cloth", "taskColorCode": "#12A67C", "artistName": "AnneArtist", "accountableName": "AaronSupervisor", "workStatus": "Finished", "shotCode": "001_007", "type": "shot", "showId": 10, "statusColorCode": "#569733", "showName": "Novel coronavirus", "clientName": "Facebook" }, { "id": 1088, "shotId": 55, "taskName": "001", "startDate": "2020-03-23 00:00:00", "endDate": "2020-03-31 23:59:59", "taskTypeName": "Modelling", "taskColorCode": "#FFA126", "artistName": "YogiArtist", "accountableName": "AlanSupervisor", "workStatus": "WIP", "shotCode": "001_007", "completionPercentage": "33.00", "type": "shot", "showId": 10, "statusColorCode": "#00B1FB", "showName": "Novel coronavirus", "clientName": "Facebook" }, { "id": 1088, "shotId": 55, "taskName": "001", "startDate": "2020-03-23 00:00:00", "endDate": "2020-03-31 23:59:59", "taskTypeName": "Modelling", "taskColorCode": "#FFA126", "artistName": "YogiArtist", "accountableName": "AlanSupervisor", "workStatus": "WIP", "shotCode": "001_007", "completionPercentage": "100.00", "type": "shot", "showId": 10, "statusColorCode": "#00B1FB", "showName": "Novel coronavirus", "clientName": "Facebook" }, { "id": 1088, "shotId": 55, "taskName": "001", "startDate": "2020-03-23 00:00:00", "endDate": "2020-03-31 23:59:59", "taskTypeName": "Modelling", "taskColorCode": "#FFA126", "artistName": "YogiArtist", "accountableName": "AlanSupervisor", "workStatus": "WIP", "shotCode": "001_007", "completionPercentage": "5", "type": "shot", "showId": 10, "statusColorCode": "#00B1FB", "showName": "Novel coronavirus", "clientName": "Facebook" }], "valid": true };
      this.rows = resp.coll;
      //this.framePercent(this.rows);
      setTimeout(() => {
        this.isLoading = false;
        this.table.recalculate();
        setTimeout(() => {
          try {
            let parentHeight = this.table.bodyComponent.scroller.parentElement.getBoundingClientRect()
              .height;
            let childHeight = this.table.bodyComponent.scroller.element.getBoundingClientRect()
              .height;
            if (childHeight > parentHeight) {
              this.showDummy = false;
            } else {
              this.showDummy = true;
            }
          } catch (e) {}
        }, 1000);
      }, 500);
    } else {
      this.onDataError(resp);
    }
    //this.isLoading = false;
  }

  framePercent(rows) {
    for (let i = 0; i < rows.length; i++) {
      rows[i].completionPercentage = i * 20;
    }
  }

  onDataError(error: any) {
    this.isLoading = false;
    this.isEmptyData = true;
  }

  openFilterSettingsForm(): void {
    this.childDrawerRef = this.drawerService.create<
      TaskFilterSettingsComponent,
      {
        type: any;
        filters: any;
        //showId: any;
        isArtist: any;
      },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: TaskFilterSettingsComponent,
      nzContentParams: {
        type: this.type,
        filters: this.taskFilters,
        //showId: this.showId,
        isArtist: this.isArtist,
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
          this.currPageInfo.offset = 0;
          this.setPage(this.currPageInfo);
        } else {
        }
      }
    });
  }

  getFilterParams() {
    let filterParams = "";
    /*if (this.shotFilters.seasonIds && this.shotFilters.seasonIds.length > 0) {
      if (filterParams != "") {
        filterParams += '&';
      }
      filterParams += `seasonId=${this.shotFilters.seasonIds[0]}`;
    }
    if (this.shotFilters.seasonIds && this.shotFilters.seasonIds.length > 0) {
      if (filterParams != "") {
        filterParams += '&';
      }
      filterParams += `seasonId=${this.shotFilters.seasonIds[0]}`;
    }*/

    for (let i in this.taskFilters) {
      let item = this.taskFilters[i];
      //if (i != "showId") {
      if (item && item.length > 0) {
        if (filterParams != "") {
          filterParams += "&";
        }
        filterParams += `${i}=${item.toString()}`;
      }
      //} else{

      //}
    }

    if (this.taskFilters.showId) {
      if (filterParams != "") {
        filterParams += "&";
      }
      filterParams += `showId=${this.taskFilters.showId}`;
    }

    return filterParams;
  }

  closeForm(): void {
    this.childDrawerRef.close();
  }

  onSort(event: any) {
    this.sortBy = this.getSortByProp(event);
    if (this.sortBy === "startDate") {
      this.sortBy = "projectedStartDt";
    }
    if (this.sortBy === "endDate") {
      this.sortBy = "projectedEndDt";
    }
    if (this.sortBy === "deliveryDate") {
      this.sortBy = "deliveryDt";
    }

    /*if (this.sortBy === "shotCode") {
      return;
    }


    if (this.sortBy === "client") {
      this.sortBy = "clientName";
    }
    if (this.sortBy === "taskType") {
      this.sortBy = "taskTypeName";
    }
    if (this.sortBy === "status") {
      this.sortBy = "workStatus";
    }


    if (this.sortBy === "startDate") {
      this.sortBy = "projectedStartDt";
    }
    if (this.sortBy === "endDate") {
      this.sortBy = "projectedEndDt";
    }
    if (this.sortBy === "artist") {
      this.sortBy = "artistName";
    }*/
    this.orderBy = event.sorts[0].dir.toUpperCase();
    this.currPageInfo.offset = 0;
    this.setPage(this.currPageInfo);
  }

  getSortByProp(event: any) {
    let colName = "";
    let prop = "";
    try {
      colName = event.column.name;
      prop = this.helperService.findObjectInArrayByKey(
        this.tableColumns,
        "displayName",
        colName
      ).name;
    } catch (e) {}
    return prop;
  }

  getColWidth(colName) {
    // if (colName === "completionPercentage") {
    //   return 200;
    // } else {
    //   return 150;
    // }
    if (
      colName === "artistName" ||
      colName === "accountableName" ||
      colName === "workStatus" ||
      colName === "sequenceName"
    ) {
      return 200;
    } else if (
      colName === "shotName" ||
      colName === "taskName" ||
      colName === "annotationPath" ||
      colName === "referencePath" ||
      colName === "description"
    ) {
      return 250;
    } else if (colName === "completionPercentage") {
      return 300;
    } else if (colName === "thumbnail" || colName === "priority") {
      return 150;
    } else {
      return 200;
    }
  }

  getTitle(row: any, col: any) {
    return row[col.name] ? row[col.name] : "";
    //return row[col.name];
  }

  async prepareData() {
    await this.getWorkstatusList();
    await this.getWorkstatusByRole();
    //await this.getShows();
    this.setFilters();
    this.getTableColumns();
    this.dateTypes = [
      {
        name: "Client ETA",
        id: "clientEta",
      },
      {
        name: "End Date",
        id: "endDate",
      },
      {
        name: "Delivery Date",
        id: "deliveryDate",
      },
    ];
    this.types = [
      {
        name: "Shot View",
        id: "shot",
      },
      {
        name: "Asset View",
        id: "asset",
      },
    ];
    this.setGroupByValue();
    this.isDataReady = true;
  }

  dateTypeChangeHandler(e: any) {
    this.dateTypeId = e;
    this.currPageInfo.offset = 0;
    this.setPage(this.currPageInfo);
  }

  setFilters() {
    this.taskFilters = {
      showId: null,
      shotIds: [],
      assetIds: [],
      accountableIds: [],
      workStatusIds: [],
      taskPriorityIds: [],
      taskTypeIds: [],
    };
    if (!this.isArtist) {
      this.taskFilters.artistIds = [];
    }
  }

  /*async getShows() {
    let serviceName = "getShows";
    if (this.isArtist) {
      serviceName = "getShowsByArist";
    }
    await this.showsService[serviceName]()
      .toPromise()
      .then(resp => {
        this.shows = resp.entity;
        if (this.shows && this.shows.length > 0) {
          this.showId = this.shows[0].id;
        }
      })
      .catch(error => {
        this.shows = null;
      });
  }*/

  checkArtist() {
    if (this.listType === "daybook") {
      return false;
    } else {
      return true;
    }
  }

  getPriorityColorCode(row: any) {
    let defaultCode = "#fff";
    return row && row.priorityColorCode ? row.priorityColorCode : defaultCode;
  }

  getTaskTypeColorCode(row: any) {
    let defaultCode = "#fff";
    return row && row.taskColorCode ? row.taskColorCode : defaultCode;
  }

  getWorkStatusColorCode(row: any) {
    let defaultCode = "#038e4e";
    let matched = this.helperService.findObjectInArrayByKey(
      this.allWorkStatuses,
      "name",
      row.workStatus
    );
    return matched && matched.code ? matched.code : defaultCode;
  }

  getProgressConfig(row: any) {
    let defaultCode = "#038e4e";
    let code = row && row.statusColorCode ? row.statusColorCode : defaultCode;
    return {
      showInfo: false,
      type: "line",
      strokeLinecap: "square",
      //strokeWidth: 8,
      strokeColor: code,
    };
  }

  noteHandler(row: any) {
    this.drawerTitle = "Task Notes";
    this.openTaskNotes(row.id);
  }

  openTaskNotes(taskId: any): void {
    this.childDrawerRef = this.drawerService.create<
      NoteFormComponent,
      { itemId: any; type: any },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: NoteFormComponent,
      nzContentParams: {
        itemId: taskId,
        type: "task",
      },
      nzClosable: false,
      nzWidth: "50%",
      nzWrapClassName: "modal-wrapper",
    });

    this.childDrawerRef.afterOpen.subscribe(() => {});

    this.childDrawerRef.afterClose.subscribe((isSuccess) => {});
  }

  enableEdit(row: any, col: any) {
    this.resetEditFlags();
    this.editing[row.id + "-" + col.name] = true;
  }

  async updateValue(row: any, col: any, event: any) {
    if (row[col.name] != event.target.value) {
      let taskId = row.id;
      let taskIn = {
        type: col.name,
      };
      taskIn[col.name] = event.target.value;
      await this.updateConfirm(row, col, taskId, taskIn);
    }
    if (this.isEditSuccess) {
      row[col.name] = event.target.value;
    }
    this.editing[row.id + "-" + col.name] = false;
  }

  inlineEditHandler(row: any, col: any) {
    this.resetEditFlags();
    this.myrow = row;
    this.mycol = col;
    this.modalTitle = "";
    this.isWorkStatusSelect = false;
    if (col.name === "workStatus") {
      this.modalTitle = "Edit Work Status";
      this.selectedWorkStatusId = row.workStatusId;
      this.isWorkStatusSelect = true;
      this.getWorkstatusByRole();
    }
    if (this.modalTitle !== "") {
      this.showModal();
    }
  }

  async inlineEditConfirm(row: any, col: any) {
    let taskId = row.id;
    let taskIn: any;
    this.isVisible = false;
    this.isRevisionSelect = false;
    if (col.name === "workStatus") {
      this.isWorkStatusSelect = false;
      if (this.selectedWorkStatusId !== row.workStatusId) {
        taskIn = {
          type: "workStatusId",
          workStatusId: row.workStatusId,
        };
        await this.updateConfirm(row, col, taskId, taskIn);
        if (this.isEditSuccess) {
          row[col.name] = this.getWorkStatusNameById(row.workStatusId);
        }
      }
    }
  }

  inlineEditCancel(row: any, col: any) {
    this.isVisible = false;
    this.isRevisionSelect = false;
    if (col.name === "workStatus") {
      this.isWorkStatusSelect = false;
      row.workStatusId = this.selectedWorkStatusId;
    }
  }

  async updateConfirm(row: any, col: any, taskId: any, taskIn: any) {
    this.isEditSuccess = false;
    let errorMessage = "Record update failed.";
    await this.showsService
      .inlineEditTask(taskId, taskIn)
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
      this.setPage(this.currPageInfo);
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

  resetEditFlags() {
    for (let key in this.editing) {
      if (this.editing.hasOwnProperty(key)) {
        this.editing[key] = false;
      }
    }
  }

  onWorkStatusChange(e: any) {
    let workStatus = this.getWorkStatusNameById(e);
    this.isRevisionSelect = false;
    /*if (workStatus && workStatus.toLowerCase() === "review") {
      this.isRevisionSelect = true;
    }*/
  }

  getWorkStatusNameById(id: any) {
    let matched = this.helperService.findObjectInArrayByKey(
      this.workStatuses,
      "id",
      id
    );
    if (matched) {
      return matched.name;
    } else {
      return "";
    }
  }

  showModal(): void {
    this.isVisible = true;
  }

  isValidArr(arr: any) {
    return this.helperService.isValidArr(arr);
  }
  getPercentage(value) {
    return Math.floor(value);
  }

  getDisplayDate(date: any) {
    let str = this.helperService.transformDate(
      date,
      AppConstants.DISPLAY_DATE_FORMAT
    );
    if (str) {
      return str;
    }
    return "";
  }

  getDisplayDateFormat() {
    return AppConstants.DISPLAY_DATE_FORMAT;
  }
}
