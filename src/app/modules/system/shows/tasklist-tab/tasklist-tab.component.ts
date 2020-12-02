import {
  Component,
  OnInit,
  Input,
  ViewChild,
  TemplateRef,
  Output,
  EventEmitter,
} from "@angular/core";
import { ShowsService } from "../shows.service";
import { NzDrawerService, NzModalService } from "ng-zorro-antd";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { Router } from "@angular/router";
import { Page } from "src/app/modules/shared/model/page";
import { TableColumnsSettingsComponent } from "../../modals/table-columns-settings/table-columns-settings.component";
import { AppConstants } from "src/app/constants/AppConstants";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { TaskFormComponent } from "../../modals/task-form/task-form.component";
import { WorkstatusService } from "../../configs/workstatus.service";
import { TasksService } from "../tasks.service";
import { ShotFilterSettingsComponent } from "../../modals/shot-filter-settings/shot-filter-settings.component";
import { Subscription } from "rxjs";
import { InteractionService } from "src/app/modules/core/services/interaction.service";
import { NoteFormComponent } from "../../modals/note-form/note-form.component";
import { AuthenticationService } from "src/app/modules/core/authentication/authentication.service";

@Component({
  selector: "app-tasklist-tab",
  templateUrl: "./tasklist-tab.component.html",
  styleUrls: ["./tasklist-tab.component.scss"],
})
export class TasklistTabComponent implements OnInit {
  @Input() showIn: any;
  @Input() shotIn: any;
  @Input() assetIn: any;
  @Input() isRowGroupEnabled: boolean;
  @Input() isReadOnly: boolean;
  @Output("pageUpdate") pageUpdate: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild("myTable", { static: false }) table: any;
  @ViewChild("myGroupHeader", { static: false }) groupHeader: any;
  @ViewChild("drawerHeader", { static: false }) drawerHeader: TemplateRef<{}>;

  showDummy: boolean;
  childDrawerRef: any;
  isEmptyData: boolean;
  isDataReady: boolean;
  isLoading: boolean = true;
  rows: any;
  showId: any;
  shotId: any;
  assetId: any;
  page = new Page();
  selectedPageSize: any;
  editing = {};
  tableColumnsArr: any;
  selectedTableColumns: any;
  userSettings: any;
  intervalId: any;
  isEditSuccess: boolean;
  taskOut: any;
  isAlertVisible: boolean;
  taskToDelete: any;
  pageSizeOptions: any;
  /** Dropdown inline edit vars - START */
  isVisible: boolean;
  modalTitle: any;
  myrow: any;
  mycol: any;

  isArtistSelect: boolean;
  artists: any;
  selectedArtistId: any;

  isSupervisorSelect: boolean;
  supervisors: any;
  selectedSupervisorId: any;

  isPrioritySelect: boolean;
  taskPriorities: any;
  selectedPriorityId: any;

  allWorkStatuses: any;
  isWorkStatusSelect: boolean;
  workStatuses: any;
  selectedWorkStatusId: any;

  isTaskComplexitySelect: boolean;
  taskComplexities: any;
  selectedTaskComplexityId: any;

  /** Dropdown inline edit vars - END*/
  drawerTitle: any;
  currPageInfo: any;
  selected = [];
  taskProgress: any;
  isProgressVisible: boolean;
  progressConfig: any;

  isSearching: boolean;
  searchPattern = "";

  taskFilters: any;
  sortBy: any = "";
  orderBy: any = "";
  taskInfo: any;
  subscription: Subscription;
  showName: any;
  type: any = "shot";
  groupBy: any;
  //tableHeight: any = 'calc(100vh - 200px)';
  tableHeight: any = "calc(100vh - 300px)";

  isFilterApplied: boolean;
  isBulkStatusUpdate: boolean;


  bulkWorkStatusId: any;


  isBulkDelete: boolean;

  constructor(
    private showsService: ShowsService,
    private workstatusService: WorkstatusService,
    private drawerService: NzDrawerService,
    private modalService: NzModalService,
    private notificationService: NotificationService,
    private router: Router,
    private helperService: HelperService,
    private tasksService: TasksService,
    private interactionService: InteractionService,
    private authService: AuthenticationService
  ) {
    this.page.pageNumber = 0;
    this.pageSizeOptions = AppConstants.TABLE_PAGE_SIZE_OPTIONS;
    this.page.size = AppConstants.PAGE_SIZE;
    this.selectedPageSize = this.page.size;
  }

  ngOnInit() {
    this.isReadOnly = this.helperService.isReadOnly(
      AppConstants.PERMISSIONS.TASK
    );
    this.prepareData();
  }

  async prepareData() {
    this.taskComplexities = [
      {
        id: "Easy",
        title: "Easy",
      },
      {
        id: "Medium",
        title: "Medium",
      },
      {
        id: "Hard",
        title: "Hard",
      },
    ];
    this.progressConfig = {
      showInfo: true,
      type: "circle",
      strokeLinecap: "round",
      strokeWidth: 8,
      strokeColor: "#3be582",
    };
    this.type = "shot";
    if (this.showIn) {
      this.showId = this.showIn.id;
      this.taskInfo = {
        showId: this.showId,
      };
      this.showName = this.showIn.showName;
    } else if (this.shotIn) {
      this.showId = this.shotIn.showId;
      this.shotId = this.shotIn.id;
      this.taskInfo = {
        showId: this.showId,
        shotId: this.shotId,
      };
      this.showName = this.shotIn.showName;
    } else if (this.assetIn) {
      this.type = "asset";
      this.showId = this.assetIn.showId;
      this.assetId = this.assetIn.id;
      this.taskInfo = {
        showId: this.showId,
        assetId: this.assetId,
      };
      this.showName = this.assetIn.showName;
    }
    this.taskFilters = {
      customFieldId: null,
      customFieldValue: null,
      taskName: null,
      shotIds: [],
      assetIds: [],
      assetTypeIds: [],
      seasonIds: [],
      episodeIds: [],
      sequenceIds: [],
      spotIds: [],
      taskTypeIds: [],
      workStatusIds: [],
      taskPriorityIds: [],
      taskComplexityIds: [],
      artistIds: [],
      accountableIds: [],
      locationIds: [],
      startDateRange: [],
      endDateRange: [],
      clientEtaRange: [],
      deliveryDateRange: [],
      completionPercentage: null,
      percentOperator: null,
      clientBid: null,
      clientBidOperator: null,
      artistBid: null,
      artistBidOperator: null,
    };
    this.setGroupByValue();
    this.getUsersettings();
    this.getPageSize();
    await this.getWorkstatusList();
    await this.getWorkstatusByRole();
    await this.getTableColumns();
  }

  async savePageSize(size: any) {
    let postObj = {
      dataTableType: "Paging",
      pageSize: size,
    };

    if (AppConstants.PAGING_USER_SETTINGS_ID) {
      await this.showsService
        .updatePageSize(AppConstants.PAGING_USER_SETTINGS_ID, postObj)
        .toPromise()
        .then((resp) => {})
        .catch((error) => {});
    } else {
      await this.showsService
        .setPageSize(postObj)
        .toPromise()
        .then((resp) => {
          AppConstants.PAGING_USER_SETTINGS_ID = resp.id;
        })
        .catch((error) => {});
    }
  }

  async getPageSize() {
    await this.showsService
      .getPageSize()
      .toPromise()
      .then((resp) => {
        if (resp.entity) {
          AppConstants.PAGING_USER_SETTINGS_ID = resp.entity.id;
          AppConstants.PAGE_SIZE = resp.entity.pageSize;
          this.page.size = AppConstants.PAGE_SIZE;
          this.selectedPageSize = this.page.size;
        }
      })
      .catch((error) => {});
  }

  onTaskNameClick(row: any) {
    let routerLink = "";
    if (this.isRowGroupEnabled) {
      if (this.type === "shot") {
        routerLink =
          this.router.url + "/shots/" + row.shotId + "/tasks/" + row.id;
      } else {
        routerLink =
          this.router.url + "/assets/" + row.assetId + "/tasks/" + row.id;
      }
    } else {
      routerLink = this.router.url + "/tasks/" + row.id;
    }
    if (routerLink !== "") {
      this.router.navigate([routerLink]);
    }
  }

  radioChangeHandler(e) {
    this.type = e;
    this.currPageInfo.offset = 0;
    this.setGroupByValue();
    this.resetTaskFilters();
    this.setPage(this.currPageInfo);

    /*this.currPageInfo.offset = 0;
    this.taskFilters.shotIds = [];
    this.taskFilters.assetIds = [];
    this.setPage(this.currPageInfo);*/
  }

  resetTaskFilters() {
    this.searchPattern = "";
    this.taskFilters = {
      customFieldId: null,
      customFieldValue: null,
      taskName: null,
      shotIds: [],
      assetIds: [],
      assetTypeIds: [],
      seasonIds: [],
      episodeIds: [],
      sequenceIds: [],
      spotIds: [],
      taskTypeIds: [],
      workStatusIds: [],
      taskPriorityIds: [],
      taskComplexityIds: [],
      artistIds: [],
      accountableIds: [],
      locationIds: [],
      startDateRange: [],
      endDateRange: [],
      clientEtaRange: [],
      deliveryDateRange: [],
      completionPercentage: null,
      percentOperator: null,
      clientBid: null,
      clientBidOperator: null,
      artistBid: null,
      artistBidOperator: null,
    };
  }

  displayCustomField(row, col) {
    if (row && row.customFields && this.isValidArr(row.customFields)) {
      if (col && col.name) {
        let info = this.helperService.findObjectInArrayByKey(
          row.customFields,
          "name",
          col.name
        );
        if (info && info.value) {
          return info.value;
        }
      }
    }
    return "-";
  }

  async getTableColumns() {
    await this.getTaskColumnList();
    if (this.tableColumnsArr) {
      this.frameSelectedColumns(true);
      this.isDataReady = true;
    }
  }

  async getTaskColumnList() {
    let params = `?entityId=${this.showId}`;
    await this.showsService
      .getTaskColumnList(params)
      .toPromise()
      .then((resp: any) => {
        if (resp && resp.entity && resp.entity.category) {
          this.tableColumnsArr = resp.entity.category;
          for (let i = 0; i < this.tableColumnsArr.length; i++) {
            let categoryName = this.tableColumnsArr[i].categoryName;
            let tableColumns = this.tableColumnsArr[i].fields;
            if (tableColumns && categoryName == "Custom Fields") {
              tableColumns.map((item: any) => {
                item.isCustomField = true;
                return item;
              });
            }
          }
          if (!this.isReadOnly) {
            this.addEditableFlag();
          }
        }
      })
      .catch((error: any) => {
        this.tableColumnsArr = null;
      });
  }

  async getUsersettings() {
    await this.tasksService
      .getUsersettings()
      .toPromise()
      .then((resp: any) => {
        if (resp && resp.entity) {
          AppConstants.TASK_USER_SETTINGS_ID = resp.entity.id;
          if (this.isValidArr(resp.entity.columns)) {
            this.userSettings = resp.entity.columns;
          }
        }
      })
      .catch((error: any) => {
        this.userSettings = null;
      });
  }

  addEditableFlag() {
    let nonEditableCols = [
      "shotCode",
      "taskName",
      "taskTypeName",
      "completionPercentage",
      "startDate",
      "endDate",
      "clientEta",
      "deliveryDate",
      "artistBid",
      "locationName",
      "deltaEta",
    ];
    for (let i = 0; i < this.tableColumnsArr.length; i++) {
      let tableColumns = this.tableColumnsArr[i].fields;
      if (tableColumns) {
        tableColumns.map((item: any) => {
          item.isEditable = nonEditableCols.includes(item.name) ? false : true;
          return item;
        });
      }
    }
  }

  getMatch(parent, child) {
    let match = null;
    for (let i = 0; i < parent.length; i++) {
      if (child.name == parent[i].columnName) {
        match = parent[i];
        break;
      }
    }
    return match;
  }

  frameSelectedColumns(checkUserSettings: boolean) {
    let columns = [];
    let count = 1;
    if (checkUserSettings) {
      if (this.userSettings) {
        for (let i = 0; i < this.tableColumnsArr.length; i++) {
          if (this.tableColumnsArr[i].fields) {
            for (let j = 0; j < this.tableColumnsArr[i].fields.length; j++) {
              let field = this.tableColumnsArr[i].fields[j];
              let match = this.getMatch(this.userSettings, field);
              if (match) {
                field.indexId = match.indexId;
                field.defaultDisplay = true;
                /*field.isCustomField = false;
                if (this.tableColumnsArr[i].categoryName === "Custom Fields") {
                  field.isCustomField = true;
                }*/
              } else {
                field.defaultDisplay = false;
              }
            }
          }
        }
      }
    }

    this.selectedTableColumns = [];
    for (let i = 0; i < this.tableColumnsArr.length; i++) {
      if (this.tableColumnsArr[i].fields) {
        for (let j = 0; j < this.tableColumnsArr[i].fields.length; j++) {
          let item = this.tableColumnsArr[i].fields[j];
          if (item.defaultDisplay) {
            this.selectedTableColumns.push(item);
            if (checkUserSettings && !this.userSettings) {
              columns.push({
                indexId: count++,
                columnName: item.name,
              });
            }
          }
        }
      }
    }
    this.selectedTableColumns.sort((a, b) => a.indexId - b.indexId);
    if (checkUserSettings && !this.userSettings) {
      let settingsIn = {
        dataTableType: "task",
        columns: columns,
      };
      this.tasksService
        .createUsersettings(settingsIn)
        .toPromise()
        .then((resp: any) => {
          AppConstants.TASK_USER_SETTINGS_ID = resp.id;
        })
        .catch((error: any) => {});
    }
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
    this.taskFilters.taskName = null;
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
    this.taskFilters.taskName = null;
    this.searchPattern = "";
    this.isSearching = false;
    this.currPageInfo.offset = 0;
    this.setPage(this.currPageInfo);
  }

  setGroupByValue() {
    this.groupBy = "";
    if (this.isRowGroupEnabled) {
      this.groupBy = this.type === "shot" ? "shotCode" : "assetName";
    } else {
    }
  }

  getGroupByValue() {
    return this.isRowGroupEnabled ? "shotCode" : "";
  }

  setPageSize() {
    let pageInfo = {
      pageSize: this.selectedPageSize,
      offset: 0,
    };
    this.setPage(pageInfo);
    this.savePageSize(this.currPageInfo.pageSize);
  }

  getId(row: any) {
    return row.id;
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

  getProgressConfig(row: any) {
    //let defaultCode = "#038e4e";
    let code = this.getWorkStatusColorCode(row); // && row.statusColorCode ? row.statusColorCode : defaultCode;
    return {
      showInfo: false,
      type: "line",
      strokeLinecap: "square",
      //strokeWidth: 8,
      strokeColor: code,
    };
  }

  setPage(pageInfo: any) {
    this.isLoading = true;
    //this.rows = [];
    this.currPageInfo = pageInfo;
    this.page.pageNumber = pageInfo.offset;
    this.page.size = pageInfo.pageSize;

    this.page.sortBy = this.sortBy;
    this.page.orderBy = this.orderBy;
    this.showDummy = true;
    let params = "";
    //params = `&showId=${this.showId}&pageNo=${this.page.pageNumber}&pageSize=${this.page.size}&sortBy=${this.page.sortBy}&orderBy=${this.page.orderBy}`;
    params = `pageNo=${this.page.pageNumber}&pageSize=${this.page.size}&sortBy=${this.page.sortBy}&orderBy=${this.page.orderBy}`;
    /*if (this.shotId) {
      params += `&shotIds=${this.shotId}`;
    } else if (this.assetId) {
      params += `&assetIds=${this.assetId}`;
    }*/
    let filterParams = this.getFilterParams();
    this.isFilterApplied = false;
    if (filterParams !== "") {
      this.isFilterApplied = true;
      //params += `&${filterParams}`;
    }
    this.page.search = this.searchPattern;
    //params += `&search=${this.page.search}`;

    let viewType = "ASSET_VIEW";
    if (this.type === "shot") {
      viewType = "SHOT_VIEW";
    }

    let taskIn = {
      showId: this.showId,
      //shotId: this.shotId,
      //assetId: this.assetId,
      search: this.page.search,
      ...this.taskFilters,
    };
    if (this.shotId) {
      taskIn.shotIds = [this.shotId];
    }
    if (this.assetId) {
      taskIn.assetIds = [this.assetId];
    }

    if (this.helperService.isValidArr(taskIn.startDateRange)) {
      taskIn.startDateFrom = this.helperService.transformDate(
        new Date(taskIn.startDateRange[0]),
        "yyyy-MM-dd 00:00:00"
      );

      taskIn.startDateTo = this.helperService.transformDate(
        new Date(taskIn.startDateRange[1]),
        "yyyy-MM-dd 23:59:59"
      );
      delete taskIn.startDateRange;
    }
    if (this.helperService.isValidArr(taskIn.endDateRange)) {
      taskIn.endDateFrom = this.helperService.transformDate(
        new Date(taskIn.endDateRange[0]),
        "yyyy-MM-dd 00:00:00"
      );

      taskIn.endDateTo = this.helperService.transformDate(
        new Date(taskIn.endDateRange[1]),
        "yyyy-MM-dd 23:59:59"
      );
      delete taskIn.endDateRange;
    }

    if (this.helperService.isValidArr(taskIn.clientEtaRange)) {
      taskIn.clientEtaFrom = this.helperService.transformDate(
        new Date(taskIn.clientEtaRange[0]),
        "yyyy-MM-dd 00:00:00"
      );

      taskIn.clientEtaTo = this.helperService.transformDate(
        new Date(taskIn.clientEtaRange[1]),
        "yyyy-MM-dd 23:59:59"
      );
      delete taskIn.clientEtaRange;
    }

    if (this.helperService.isValidArr(taskIn.deliveryDateRange)) {
      taskIn.deliveryDateFrom = this.helperService.transformDate(
        new Date(taskIn.deliveryDateRange[0]),
        "yyyy-MM-dd 00:00:00"
      );

      taskIn.deliveryDateTo = this.helperService.transformDate(
        new Date(taskIn.deliveryDateRange[1]),
        "yyyy-MM-dd 23:59:59"
      );
      delete taskIn.deliveryDateRange;
    }

    this.showsService
      .getTasksByView(this.page, params, viewType, taskIn)
      .subscribe(
        (resp) => {
          if (resp && resp.valid) {
            this.page.totalElements = resp.total;
            this.page.totalPages = Math.ceil(resp.total / this.page.size);
            this.rows = resp.coll;
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
            this.rows = [];
          }

          this.setTableHeight();
        },
        (error) => {
          if (
            error &&
            error.status === 400 &&
            error.error &&
            error.error.body &&
            error.error.body[0]
          ) {
            this.showIn = null;
            if (
              error.error.body[0].code === 1026 &&
              error.error.body[0].message ===
                "Please contact admin to access requested show"
            ) {
              this.authService.logout();
            }
          }
          this.isLoading = false;
          this.rows = [];
          this.setTableHeight();
        }
      );
  }

  getGroupHeader(group) {
    return group.key;
  }

  onDataReady() {}

  framePercent(rows) {
    for (let i = 0; i < rows.length; i++) {
      rows[i].completionPercentage = i * 20;
    }
  }

  onDataError(error: any) {
    this.isEmptyData = true;
  }

  createTask() {
    this.drawerTitle = "Add Task";
    this.openTaskForm("create", this.taskInfo);
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

  async cloneHandler(row: any) {
    let successMessage = "Task has been successfully cloned.";
    let errorMessage = "Task clone failed.";

    await this.showsService
      .cloneTask(row.id)
      .toPromise()
      .then((resp) => {
        if (resp && resp.valid) {
          this.setPage(this.currPageInfo);
          this.showNotification({
            type: "success",
            title: "Success",
            content: successMessage,
            duration: AppConstants.NOTIFICATION_DURATION,
          });
          this.pageUpdate.emit(event);
        }
      })
      .catch((error) => {
        let errorDetails = this.helperService.getErrorDetails(error);
        if (errorDetails !== "") {
          errorMessage = `<b>${errorMessage}</b>` + errorDetails;
        }
        this.showNotification({
          type: "error",
          title: "Error",
          content: errorMessage,
          duration: AppConstants.NOTIFICATION_DURATION,
        });
      });
  }

  async editHandler(row: any) {
    await this.getTask(row.id);
    if (this.taskOut) {
      this.drawerTitle = "Edit Task";
      this.openTaskForm("update", this.taskOut);
    }
  }

  async getTask(id: any) {
    this.taskOut = null;
    await this.showsService
      .getTask(id)
      .toPromise()
      .then((resp) => {
        if (resp && resp.valid && resp.entity) {
          this.taskOut = resp.entity;
        }
      })
      .catch((error) => {});
  }

  openTaskForm(mode: any, taskOut: any): void {
    this.childDrawerRef = this.drawerService.create<
      TaskFormComponent,
      {
        taskOut: any;
        mode: string;
        disableShowSelect?: boolean;
        showName?: any;
        type?: any;
      },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: TaskFormComponent,
      nzContentParams: {
        taskOut: taskOut,
        mode: mode,
        disableShowSelect: true,
        showName: this.showName,
        type: this.type,
      },
      nzClosable: false,
      nzWidth: "500px",
      nzWrapClassName: "modal-wrapper",
      nzOnCancel: () =>
        new Promise((resolve, reject) => {
          this.modalService.confirm({
            nzTitle: AppConstants.EXIT_WARNING_MESSAGE,
            nzOkText: "Yes",
            nzOkType: "primary",
            nzOnOk: () => resolve(true),
            nzCancelText: "No",
            //nzCancelType: "primary",
            nzOnCancel: () => resolve(false),
            nzNoAnimation: true,
          });
          return;
        }),
    });

    this.childDrawerRef.afterOpen.subscribe(() => {});

    this.childDrawerRef.afterClose.subscribe((isSuccess) => {
      if (isSuccess) {
        if (mode === "create") {
          this.pageUpdate.emit(event);
        }
        this.setPage(this.currPageInfo);
      }
    });
  }

  closeForm(): void {
    this.childDrawerRef.close();
  }

  deleteHandler(row: any) {
    this.isAlertVisible = true;
    this.taskToDelete = row;
  }

  deleteTaskConfirm = async () => {
    let successMessage = "Task has been successfully deleted.";
    let errorMessage = "Task deletion failed.";
    this.isAlertVisible = false;
    await this.showsService
      .deleteTask(this.taskToDelete.id)
      .toPromise()
      .then((resp) => {
        this.showNotification({
          type: "success",
          title: "Success",
          content: successMessage,
          duration: AppConstants.NOTIFICATION_DURATION,
        });
        this.pageUpdate.emit(event);
        if (this.currPageInfo.offset > 0 && this.rows.length == 1) {
          this.currPageInfo.offset = this.currPageInfo.offset - 1;
        }
        this.setPage(this.currPageInfo);
      })
      .catch((error) => {
        let errorDetails = this.helperService.getErrorDetails(error);
        if (errorDetails !== "") {
          errorMessage = `<b>${errorMessage}</b>` + errorDetails;
        }
        this.showNotification({
          type: "error",
          title: "Error",
          content: errorMessage,
          duration: AppConstants.NOTIFICATION_DURATION,
        });
      });
  };

  deleteTaskCancel = () => {
    this.isAlertVisible = false;
  };

  onShotNameClick(row) {
    let routerLink = this.router.url + "/" + row.shotId;
    this.router.navigate([routerLink]);
  }

  onDblClick(row, colId) {}

  toggleExpandGroup(group) {
    this.table.groupHeader.toggleExpandGroup(group);
  }

  onDetailToggle(event) {}

  columnHandler() {
    this.drawerTitle = "Table Columns";
    this.openColumnsSelectionForm();
  }

  filterHandler() {
    this.drawerTitle = "Filter Settings";
    this.openFilterSettingsForm();
  }

  openColumnsSelectionForm(): void {
    this.childDrawerRef = this.drawerService.create<
      TableColumnsSettingsComponent,
      {
        entity: any;
        tableColumnsArr: any;
        selectedTableColumns: any;
        type?: any;
      },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: TableColumnsSettingsComponent,
      nzContentParams: {
        entity: "TASK",
        tableColumnsArr: this.tableColumnsArr,
        selectedTableColumns: this.selectedTableColumns,
        type: this.type,
      },
      nzClosable: false,
      nzWidth: "40%",
      nzWrapClassName: "modal-wrapper",
    });

    this.childDrawerRef.afterOpen.subscribe(() => {});

    this.childDrawerRef.afterClose.subscribe((data) => {
      /*if (data) {
        if (
          JSON.stringify(this.selectedTableColumns) !== JSON.stringify(data)
        ) {
          this.selectedTableColumns = data;
        } else {
        }
      }*/
      if (data) {
        if (JSON.stringify(this.tableColumnsArr) !== JSON.stringify(data)) {
          this.tableColumnsArr = data;
          this.frameSelectedColumns(false);
          this.setPage(this.currPageInfo);
        }
      }
    });
  }

  openFilterSettingsForm(): void {
    this.childDrawerRef = this.drawerService.create<
      ShotFilterSettingsComponent,
      {
        type: any;
        viewType: any;
        filters: any;
        showId: any;
      },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: ShotFilterSettingsComponent,
      nzContentParams: {
        type: "task",
        viewType: this.type,
        filters: this.taskFilters,
        showId: this.showId,
      },
      nzClosable: false,
      nzWidth: "40%",
      nzWrapClassName: "modal-wrapper",
    });

    this.childDrawerRef.afterOpen.subscribe(() => {});

    this.childDrawerRef.afterClose.subscribe((data) => {
      if (data) {
        if (JSON.stringify(this.taskFilters) !== JSON.stringify(data)) {
          if (this.taskFilters.taskName && !data.taskName) {
            this.searchPattern = "";
          }
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
      if (i !== "customFieldValue" && i !== "taskName") {
        if (item && item.length > 0) {
          if (filterParams != "") {
            filterParams += "&";
          }
          filterParams += `${i}=${item.toString()}`;
        }
      }
    }

    if (this.taskFilters.completionPercentage) {
      if (filterParams != "") {
        filterParams += "&";
      }
      filterParams += `completionPercentage=${this.taskFilters.completionPercentage}`;
      filterParams += `percentOperator=${this.taskFilters.percentOperator}`;
    }

    if (this.taskFilters.clientBid) {
      if (filterParams != "") {
        filterParams += "&";
      }
      filterParams += `clientBid=${this.taskFilters.clientBid}`;
      filterParams += `clientBidOperator=${this.taskFilters.clientBidOperator}`;
    }

    if (this.taskFilters.artistBid) {
      if (filterParams != "") {
        filterParams += "&";
      }
      filterParams += `artistBid=${this.taskFilters.artistBid}`;
      filterParams += `artistBidOperator=${this.taskFilters.artistBidOperator}`;
    }

    if (this.taskFilters.taskName) {
      if (filterParams != "") {
        filterParams += "&";
      }
      filterParams += `taskName=${this.taskFilters.taskName}`;
      this.searchPattern = this.taskFilters.taskName;
    }

    if (this.taskFilters.customFieldId && this.taskFilters.customFieldValue) {
      if (filterParams != "") {
        filterParams += "&";
      }
      filterParams += `customFieldId=${this.taskFilters.customFieldId}&customFieldValue=${this.taskFilters.customFieldValue}`;
    }
    return filterParams;
  }

  onReorder(event: any) {
    let columns = [];
    for (let i = 1; i < this.table._internalColumns.length - 1; i++) {
      columns.push({
        indexId: i,
        columnName: this.table._internalColumns[i].prop,
      });
    }
    let settingsIn = {
      dataTableType: "task",
      columns: columns,
    };
    if (AppConstants.TASK_USER_SETTINGS_ID) {
      this.tasksService
        .updateUsersettings(AppConstants.TASK_USER_SETTINGS_ID, settingsIn)
        .toPromise()
        .then((resp: any) => {})
        .catch((error: any) => {});
    } else {
      this.tasksService
        .createUsersettings(settingsIn)
        .toPromise()
        .then((resp: any) => {
          AppConstants.TASK_USER_SETTINGS_ID = resp.id;
        })
        .catch((error: any) => {});
    }
  }

  onSelect({ selected }) {
    if (selected) {
      this.selected.splice(0, this.selected.length);
      this.selected.push(...selected);
    }
  }

  getSelectedIds() {
    return this.selected.map((item) => {
      return item.id;
    });
  }

  bulkStatusUpdate() {
    let selectedIds = this.getSelectedIds();
    if (selectedIds && selectedIds.length > 0) {
      this.isBulkStatusUpdate = true;
    }
  }

  bulkStatusUpdateCancel() {
    this.isBulkStatusUpdate = false;
    this.bulkWorkStatusId = null;
  }

  bulkStatusUpdateConfirm() {
    let errorMessage = "Records update failed.";
    this.isBulkStatusUpdate = false;
    let selectedIds = this.getSelectedIds();
    let bulkUpdateIn = {
      type: "workStatusId",
      taskIds: selectedIds,
      workStatusId: this.bulkWorkStatusId,
    };

    this.tasksService
      .bulkUpdate(bulkUpdateIn)
      .toPromise()
      .then((resp) => {
        this.showNotification({
          type: "success",
          title: "Success",
          content: "Records updated successfully.",
          duration: AppConstants.NOTIFICATION_DURATION,
        });
        this.bulkWorkStatusId = null;
        this.pageUpdate.emit(event);
        this.setPage(this.currPageInfo);
      })
      .catch((error) => {
        let errorDetails = this.helperService.getErrorDetails(error);
        if (errorDetails !== "") {
          errorMessage = `<b>${errorMessage}</b>` + errorDetails;
        }
        this.showNotification({
          type: "error",
          title: "Error",
          content: errorMessage,
          duration: AppConstants.NOTIFICATION_DURATION,
        });
      });
  }

 
  bulkDeleteHandler() {
    let selectedIds = this.getSelectedIds();
    if (selectedIds && selectedIds.length > 0) {
      this.isBulkDelete = true;
    }
  }

  bulkDeleteTaskConfirm() {
    let successMessage = "Tasks have been successfully deleted.";
    let errorMessage = "Tasks deletion failed.";
    this.isBulkDelete = false;
    let selectedIds = this.getSelectedIds();
    let bulkUpdateIn = {
      type: "delete",
      taskIds: selectedIds,
    };

    this.tasksService
      .bulkUpdate(bulkUpdateIn)
      .toPromise()
      .then((resp) => {
        this.showNotification({
          type: "success",
          title: "Success",
          content: successMessage,
          duration: AppConstants.NOTIFICATION_DURATION,
        });
        this.pageUpdate.emit(event);
        if (this.currPageInfo.offset > 0 && this.rows.length == 1) {
          this.currPageInfo.offset = this.currPageInfo.offset - 1;
        }
        this.setPage(this.currPageInfo);
      })
      .catch((error) => {
        let errorDetails = this.helperService.getErrorDetails(error);
        if (errorDetails !== "") {
          errorMessage = `<b>${errorMessage}</b>` + errorDetails;
        }
        this.showNotification({
          type: "error",
          title: "Error",
          content: errorMessage,
          duration: AppConstants.NOTIFICATION_DURATION,
        });
      });
  }

  bulkDeleteTaskCancel() {
    this.isBulkDelete = false;
  }
  progressHandler() {
    let selectedIds = this.getSelectedIds();

    if (selectedIds && selectedIds.length > 0) {
      this.tasksService
        .getTaskProgressByTask(selectedIds)
        .toPromise()
        .then((resp) => {
          this.isProgressVisible = true;
          if (resp && resp.entity) {
            this.taskProgress = Math.round(resp.entity);
          } else {
            this.taskProgress = 0;
          }
        })
        .catch((error) => {});
    }
  }

  onSort(event) {
    this.sortBy = event.sorts[0].prop;
    if (this.sortBy === "shotName") {
      return;
    }
    if (this.sortBy === "startDate") {
      this.sortBy = "projectedStartDt";
    }
    if (this.sortBy === "endDate") {
      this.sortBy = "projectedEndDt";
    }
    if (this.sortBy === "taskType") {
      this.sortBy = "taskTypeName";
    }
    if (this.sortBy === "artist") {
      this.sortBy = "artistName";
    }
    if (this.sortBy === "location") {
      this.sortBy = "locationName";
    }
    if (this.sortBy === "deliveryDate") {
      this.sortBy = "deliveryDt";
    }

    this.orderBy = event.sorts[0].dir.toUpperCase();
    this.currPageInfo.offset = 0;
    this.setPage(this.currPageInfo);
  }

  getColWidth(colName) {
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
      return 200;
    } else if (colName === "thumbnail") {
      return 150;
    } else {
      return 200;
    }
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

  getTaskTypeColorCode(row: any) {
    let defaultCode = "#fff";
    return row && row.taskColorCode ? row.taskColorCode : defaultCode;
  }

  enableEdit(row: any, col: any) {
    this.resetEditFlags();
    this.editing[row.id + "-" + col.name] = true;
  }

  resetEditFlags() {
    for (let key in this.editing) {
      if (this.editing.hasOwnProperty(key)) {
        this.editing[key] = false;
      }
    }
  }

  showNotification(info: any) {
    this.notificationService.showNotification(info);
  }

  dateOpenChange(row: any, col: any, isOpen: any) {
    if (!isOpen) {
      this.editing[row.id + "-" + col.name] = false;
    }
  }

  disabledOldDates = (startValue: Date): boolean => {
    if (!startValue) {
      return false;
    }
    let today = new Date();
    let yesterday = new Date(today.setDate(today.getDate() - 1));
    return startValue.getTime() < yesterday.getTime();
  };

  inlineEditHandler(row: any, col: any) {
    this.resetEditFlags();
    this.myrow = row;
    this.mycol = col;

    //this.isSequenceSelect = false;
    //this.isStatusSelect = false;
    this.isSupervisorSelect = false;
    this.modalTitle = "";

    if (col.name === "artistName") {
      this.modalTitle = "Edit Artist";
      this.selectedArtistId = row.artistId;
      this.isArtistSelect = true;
      this.getArtists();
    } else if (col.name === "accountableName") {
      this.modalTitle = "Edit Accountable";
      this.selectedSupervisorId = row.accountable;
      this.isSupervisorSelect = true;
      this.getSupervisors();
    } else if (col.name === "priority") {
      this.modalTitle = "Edit Priority";
      this.selectedPriorityId = row.taskPriorityId;
      this.isPrioritySelect = true;
      this.getTaskPriorities();
    } else if (col.name === "workStatus") {
      this.modalTitle = "Edit Work Status";
      this.selectedWorkStatusId = row.workStatusId;
      this.isWorkStatusSelect = true;
      this.getWorkstatusByRole();
    } else if (col.name === "complexity") {
      this.modalTitle = "Edit Task Complexity";
      this.selectedTaskComplexityId = row.complexity;
      this.isTaskComplexitySelect = true;
      //this.getWorkstatusByRole();
    }

    if (this.modalTitle !== "") {
      this.showModal();
    }
  }

  async inlineEditConfirm(row: any, col: any) {
    let shotId = row.id;
    let shotIn: any;
    this.isVisible = false;
    if (col.name === "artistName") {
      this.isArtistSelect = false;
      if (this.selectedArtistId !== row.artistId) {
        shotIn = {
          type: "artistId",
          artistId: row.artistId,
        };
        await this.updateConfirm(row, col, shotId, shotIn);
        if (this.isEditSuccess) {
          row[col.name] = this.getArtistNameById(row.artistId);
        }
      }
    } else if (col.name === "accountableName") {
      this.isSupervisorSelect = false;
      if (this.selectedSupervisorId !== row.accountable) {
        shotIn = {
          type: "accountable",
          accountable: row.accountable,
        };
        await this.updateConfirm(row, col, shotId, shotIn);
        if (this.isEditSuccess) {
          row[col.name] = this.getSupervisorNameById(row.accountable);
        }
      }
    } else if (col.name === "priority") {
      this.isPrioritySelect = false;
      if (this.selectedPriorityId !== row.taskPriorityId) {
        shotIn = {
          type: "taskPriorityId",
          taskPriorityId: row.taskPriorityId,
        };
        await this.updateConfirm(row, col, shotId, shotIn);
        if (this.isEditSuccess) {
          row[col.name] = this.getPriorityNameById(row.taskPriorityId);
        }
      }
    } else if (col.name === "workStatus") {
      this.isWorkStatusSelect = false;
      if (this.selectedWorkStatusId !== row.workStatusId) {
        shotIn = {
          type: "workStatusId",
          workStatusId: row.workStatusId,
        };
        await this.updateConfirm(row, col, shotId, shotIn);
        if (this.isEditSuccess) {
          this.pageUpdate.emit(event);
          row[col.name] = this.getWorkStatusNameById(row.workStatusId);
        }
      }
    } else if (col.name === "complexity") {
      this.isTaskComplexitySelect = false;
      console.log(this.selectedTaskComplexityId);
      console.log(row.complexity);
      if (this.selectedTaskComplexityId !== row.complexity) {
        shotIn = {
          type: "complexity",
          complexity: row.complexity,
        };
        await this.updateConfirm(row, col, shotId, shotIn);
        if (this.isEditSuccess) {
          
          row[col.name] = this.getTaskComplexityNameById(row.complexity);
          //this.pageUpdate.emit(event);
        }
      }
    }
  }

  inlineEditCancel(row: any, col: any) {
    this.isVisible = false;
    if (col.name === "artistName") {
      this.isArtistSelect = false;
      row.artistId = this.selectedArtistId;
    } else if (col.name === "accountableName") {
      this.isSupervisorSelect = false;
      row.accountable = this.selectedSupervisorId;
    } else if (col.name === "priority") {
      this.isPrioritySelect = false;
      row.taskPriorityId = this.selectedPriorityId;
    } else if (col.name === "workStatus") {
      this.isWorkStatusSelect = false;
      row.workStatusId = this.selectedWorkStatusId;
    }
    else if (col.name === "complexity") {
      this.isTaskComplexitySelect = false;
      row.complexity = this.selectedTaskComplexityId;
    }
  }

  getArtistNameById(id: any) {
    let matched = this.helperService.findObjectInArrayByKey(
      this.artists,
      "id",
      id
    );
    if (matched) {
      return matched.title;
    } else {
      return "";
    }
  }

  getSupervisorNameById(id: any) {
    let matched = this.helperService.findObjectInArrayByKey(
      this.supervisors,
      "id",
      id
    );
    if (matched) {
      return matched.title;
    } else {
      return "";
    }
  }

  getPriorityNameById(id: any) {
    let matched = this.helperService.findObjectInArrayByKey(
      this.taskPriorities,
      "id",
      id
    );
     if (matched) {
      return matched.taskPriorityLevel;
    } else {
      return "";
    }
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

  getTaskComplexityNameById(id: any) {
    let matched = this.helperService.findObjectInArrayByKey(
      this.taskComplexities,
      "id",
      id
    );
    console.log(matched.title);
    if (matched) {
      return matched.title;
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

  isEndDateDisabled(row) {
    let startValue = row["startDate"].value; // this.dataForm.controls.startDate.value;
    if (!startValue) {
      return true;
    }
    return false;
  }

  async updateDateValue(row: any, col: any, event: any) {
    let prev = null;
    if (row[col.name]) {
      prev = this.helperService.transformDate(row[col.name]);
    }
    let format = "yyyy-MM-dd 23:59:59";
    if (col.name === "startDate") {
      format = "yyyy-MM-dd 00:00:00";
    }
    let curr = this.helperService.transformDate(event, format);
    if (prev != curr) {
      let taskId = row.id;
      let taskIn = {
        type: col.name,
      };
      taskIn[col.name] = curr;
      await this.updateConfirm(row, col, taskId, taskIn);
    }
    if (this.isEditSuccess) {
      row[col.name] = event;
    }
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

  getTitle(row: any, col: any) {
    //return row[col.name];
    return "row[col.name] ? row[col.name] : ''";
  }

  async getSupervisors() {
    await this.showsService
      .getSupervisorsByShowId(this.showId)
      .toPromise()
      .then((resp: any) => {
        this.supervisors = resp.entity;
      })
      .catch((error: any) => {
        this.supervisors = [];
      });
  }

  async getArtists() {
    await this.showsService
      .getArtistsByShowId(this.showId)
      .toPromise()
      .then((resp: any) => {
        this.artists = resp.entity;
      })
      .catch((error: any) => {
        this.artists = [];
      });
  }

  async getTaskPriorities() {
    await this.showsService
      .getTaskPriorities()
      .toPromise()
      .then((resp: any) => {
        this.taskPriorities = resp.entity;
      })
      .catch((error: any) => {
        this.taskPriorities = [];
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
        this.allWorkStatuses = [];
      });
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

  setTableHeight() {
    if (!this.isValidArr(this.rows)) {
      this.tableHeight = 150 + "px";
    } else {
      if (this.rows.length <= 10) {
        this.tableHeight = this.rows.length * 50 + 120 + "px";
        if (this.isRowGroupEnabled) {
          //this.tableHeight = this.rows.length * 60 + 120 + "px";
          this.tableHeight = this.rows.length * 50 + 120 + 50 + "px";
          //this.tableHeight = "calc(100vh - 200px)";
        }
      } else {
        this.tableHeight = "calc(100vh - 200px)";
      }
    }
  }

  getTableHeight() {
    return this.tableHeight;
  }

  getPercentage(value) {
    return Math.floor(value);
  }

  getPriorityColorCode(row: any) {
    let defaultCode = "#fff";
    return row && row.priorityColorCode ? row.priorityColorCode : defaultCode;
  }

  getDisplayDate(date: any) {
    return this.helperService.transformDate(
      date,
      AppConstants.DISPLAY_DATE_FORMAT
    );
  }

  getYesOrNo(val: any) {
    if (val && val === 1) {
      return "Yes";
    }
    return "No";
  }
}
