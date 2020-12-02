import {
  Component,
  OnInit,
  Input,
  TemplateRef,
  ViewChild,
  OnDestroy,
  Output,
  EventEmitter,
} from "@angular/core";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import {
  NzDrawerService,
  UploadChangeParam,
  NzModalService,
} from "ng-zorro-antd";
import { ShowsService } from "../shows.service";
import { Router } from "@angular/router";
import { Page } from "src/app/modules/shared/model/page";
import { TableColumnsSettingsComponent } from "../../modals/table-columns-settings/table-columns-settings.component";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { SequencesService } from "../sequences.service";
import { ShotFormComponent } from "../../modals/shot-form/shot-form.component";
import { TasksService } from "../tasks.service";
import { ShotFilterSettingsComponent } from "../../modals/shot-filter-settings/shot-filter-settings.component";
import { InteractionService } from "src/app/modules/core/services/interaction.service";
import { Subscription } from "rxjs";
import { BackupFormComponent } from "../../modals/backup-form/backup-form.component";
import { ShotsService } from "../shots.service";
import { AuthenticationService } from "src/app/modules/core/authentication/authentication.service";
import { ImageUploadComponent } from "src/app/modules/shared/components/image-upload/image-upload.component";
import { SpinnerVisibilityService } from "ng-http-loader";

@Component({
  selector: "app-shotlist-tab",
  templateUrl: "./shotlist-tab.component.html",
  styleUrls: ["./shotlist-tab.component.scss"],
})
export class ShotlistTabComponent implements OnInit, OnDestroy {
  @ViewChild(ImageUploadComponent, { static: false })
  imageUploadComponent: ImageUploadComponent;
  @Input() showIn: any;
  @Input() isReadOnly: boolean;
  @Output("pageUpdate") pageUpdate: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild("drawerHeader", { static: false }) drawerHeader: TemplateRef<{}>;
  @ViewChild("myTable", { static: false }) table: any;
  @ViewChild("myGroupHeader", { static: false }) groupHeader: any;

  childDrawerRef: any;
  isEmptyData: boolean;
  isDataReady: boolean;
  showDummy: boolean;
  isLoading: boolean = true;
  rows: any;
  showId: any;
  page = new Page();
  pageSizeOptions: any;
  selectedPageSize: any;
  editing = {};
  tableColumnsArr: any;
  //tableColumns: any;
  selectedTableColumns: any;
  userSettings: any;
  isEditSuccess: boolean;
  shotToDelete: any;
  isAlertVisible: boolean;

  /** Dropdown inline edit vars - START */
  isVisible: boolean;
  modalTitle: any;
  myrow: any;
  mycol: any;

  isSequenceSelect: boolean;
  sequences: any;
  selectedSequenceId: any;

  isStatusSelect: boolean;
  statuses: any;
  selectedStatus: any;
  statusModel: any;

  isSupervisorSelect: boolean;
  supervisors: any;
  selectedSupervisorId: any;

  isThumbnailSelect: boolean;
  selectedThumbnailUrl: any;

  /** Dropdown inline edit vars - END*/
  showOut: any;
  shotOut: any;
  currPageInfo: any;
  sortBy: any = "shotCode";
  orderBy: any = "ASC";
  drawerTitle: any;

  selected = [];
  taskProgress: any;
  isProgressVisible: boolean;
  progressConfig: any;

  isSearching: boolean;
  searchPattern = "";

  shotFilters: any;
  subscription: Subscription;
  tableHeight: any = "calc(100vh - 200px)";
  isFilterApplied: boolean;

  type: any = "sequence";
  groupBy: any;
  isRowGroupEnabled: boolean = true;

  isBulkStatusUpdate: boolean;
  bulkStatusId: any;

  isBulkDelete: boolean;

  constructor(
    private showsService: ShowsService,
    private shotsService: ShotsService,
    private sequencesService: SequencesService,
    private drawerService: NzDrawerService,
    private modalService: NzModalService,
    private notificationService: NotificationService,
    private router: Router,
    private interactionService: InteractionService,
    private helperService: HelperService,
    private tasksService: TasksService,
    private authService: AuthenticationService,
    private spinner: SpinnerVisibilityService
  ) {
    this.page.pageNumber = 0;
    this.pageSizeOptions = AppConstants.TABLE_PAGE_SIZE_OPTIONS;
    this.page.size = AppConstants.PAGE_SIZE;
    this.selectedPageSize = this.page.size;
  }

  ngOnInit() {
    this.isReadOnly = this.helperService.isReadOnly(
      AppConstants.PERMISSIONS.SHOT
    );
    this.showId = this.showIn.id;
    this.prepareData();
  }

  async prepareData() {
    this.progressConfig = {
      showInfo: true,
      type: "circle",
      strokeLinecap: "round",
      strokeWidth: 8,
      strokeColor: "#3be582",
    };
    this.shotFilters = {
      customFieldId: null,
      customFieldValue: null,
      completionPercentage: null,
      shotCode: null,
      seasonIds: [],
      episodeIds: [],
      sequenceIds: [],
      spotIds: [],
      status: [],
    };
    this.setGroupByValue();
    this.getUsersettings();
    this.getPageSize();
    await this.getShow(this.showId);
    await this.getStatuses();
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

  ngOnDestroy() {
    //this.subscription.unsubscribe();
  }

  radioChangeHandler(e) {
    this.type = e;
    this.currPageInfo.offset = 0;
    this.setGroupByValue();
    this.setPage(this.currPageInfo);
    /*this.currPageInfo.offset = 0;
    this.taskFilters.shotIds = [];
    this.taskFilters.assetIds = [];    
    this.setPage(this.currPageInfo);*/
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
    await this.getShotColumnList();
    if (this.tableColumnsArr) {
      this.frameSelectedColumns(true);
      this.isDataReady = true;
    }
  }

  async getShotColumnList() {
    let params = `?entityId=${this.showId}`;
    await this.showsService
      .getShotColumnList(params)
      .toPromise()
      .then((resp: any) => {
        if (resp && resp.entity && resp.entity.category) {
          this.tableColumnsArr = resp.entity.category;
          //this.tableColumns = resp.entity.fields;
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
    await this.shotsService
      .getUsersettings()
      .toPromise()
      .then((resp: any) => {
        if (resp && resp.entity) {
          AppConstants.SHOT_USER_SETTINGS_ID = resp.entity.id;
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
      "episodeName",
      "seasonName",
      "spotName",
      "completionPercentage",
      "sequenceName",
      "shootingDate",
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
    this.selectedTableColumns = [];
    for (let i = 0; i < this.tableColumnsArr.length; i++) {
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
    this.selectedTableColumns.sort((a, b) => a.indexId - b.indexId);
    if (checkUserSettings && !this.userSettings) {
      let settingsIn = {
        dataTableType: "shot",
        columns: columns,
      };
      this.shotsService
        .createUsersettings(settingsIn)
        .toPromise()
        .then((resp: any) => {
          AppConstants.SHOT_USER_SETTINGS_ID = resp.id;
        })
        .catch((error: any) => {});
    }
    /*this.selectedTableColumns = this.tableColumns.filter((item, index) => {      
      item["index"] = index;
      return item.defaultDisplay;
    });*/
  }

  searchHandler() {
    this.isSearching = true;
  }

  searchDetails() {
    this.shotFilters.shotCode = null;
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
    this.shotFilters.shotCode = null;
    this.isSearching = false;
    this.currPageInfo.offset = 0;
    this.setPage(this.currPageInfo);
  }

  setGroupByValue() {
    this.groupBy = "";
    if (this.isRowGroupEnabled) {
      this.groupBy = this.type === "spot" ? "spotName" : "sequenceName";
    } else {
    }
  }

  setPageSize() {
    this.currPageInfo.pageSize = this.selectedPageSize;
    this.currPageInfo.offset = 0;
    this.setPage(this.currPageInfo);
    this.savePageSize(this.currPageInfo.pageSize);
  }

  getId(row) {
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
    let code = this.getStatusColorCode(row); // && row.statusColorCode ? row.statusColorCode : defaultCode;
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

    let filterParams = this.getFilterParams();
    this.isFilterApplied = false;
    if (filterParams != "") {
      this.isFilterApplied = true;
    }

    this.currPageInfo = pageInfo;
    this.page.pageNumber = pageInfo.offset;
    this.page.size = pageInfo.pageSize;
    this.page.search = this.searchPattern;
    this.page.sortBy = this.sortBy;
    this.page.orderBy = this.orderBy;
    this.showDummy = false;

    let viewType = "SEQUENCE_VIEW";
    if (this.type === "spot") {
      viewType = "SPOT_VIEW";
    }

    let params = `showId=${this.showId}`;
    if (this.page) {
      if (this.page.search) {
        params += `&search=${this.page.search}`;
      } else {
        params += `&search=`;
      }
      params += `&pageNo=${this.page.pageNumber}&pageSize=${this.page.size}&sortBy=${this.page.sortBy}&orderBy=${this.page.orderBy}`;
    }
    if (filterParams && filterParams !== "") {
      params += `&${filterParams}`;
    }

    this.shotsService.getShotsByView(viewType, params).subscribe(
      (resp) => {
        if (resp && resp.valid) {
          this.page.totalElements = resp.total;
          this.page.totalPages = Math.ceil(resp.total / this.page.size);
          this.rows = resp.coll;
          //this.framePercent(this.rows);
          setTimeout(() => {
            this.isLoading = false;
            this.table.recalculate();

            if (!this.isValidArr(this.rows)) {
              this.frameSelectedColumns(false);
              this.table.headerComponent.offsetX = 0;
            }
            setTimeout(() => {
              try {
                this.showDummy = this.helperService.displayDummy(this.table);
              } catch (e) {}
            }, 1000);
          }, 500);
        } else {
          this.onDataError(resp);
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
        this.onDataError(error);
        this.setTableHeight();
      }
    );
  }

  framePercent(rows) {
    for (let i = 0; i < rows.length; i++) {
      rows[i].completionPercentage = i * 20;
    }
  }

  onDataError(error: any) {
    this.isEmptyData = true;
  }

  imageEditHandler(row: any) {}

  createShot() {
    this.drawerTitle = "Add Shot";
    let shotOut = {
      showId: this.showId,
    };
    this.openShotForm("create", shotOut);
  }

  async editHandler(row: any) {
    await this.getShot(row.id);
    if (this.shotOut) {
      this.drawerTitle = "Edit Shot";
      this.openShotForm("update", this.shotOut);
    }
  }

  async getShow(id: any) {
    await this.showsService
      .getShow(id)
      .toPromise()
      .then((resp) => {
        this.showOut = resp.entity;
      })
      .catch((error) => {
        this.showOut = null;
      });
  }

  async getShot(id: any) {
    await this.showsService
      .getShot(id)
      .toPromise()
      .then((resp) => {
        this.shotOut = resp.entity;
      })
      .catch((error) => {
        this.shotOut = null;
      });
  }

  setTableHeight() {
    if (!this.isValidArr(this.rows)) {
      this.tableHeight = 150 + "px";
    } else {
      if (this.rows.length <= 10) {
        this.tableHeight = this.rows.length * 50 + 120 + "px";
        //this.tableHeight = (this.rows.length * 50) + 'px';
        if (this.isRowGroupEnabled) {
          this.tableHeight = this.rows.length * 50 + 120 + 50 + "px";
          //this.tableHeight = "calc(100vh - 200px)";
        }
      } else {
        this.tableHeight = "calc(100vh - 200px)";
      }
    }
    //this.tableHeight = 'calc(100vh - 200px)';
  }

  getTableHeight() {
    return this.tableHeight;
  }

  openShotForm(mode: any, shotOut: any): void {
    this.childDrawerRef = this.drawerService.create<
      ShotFormComponent,
      {
        shotOut: any;
        mode: string;
        disableShowSelect?: boolean;
        showName?: any;
      },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: ShotFormComponent,
      nzContentParams: {
        shotOut: shotOut,
        mode: mode,
        disableShowSelect: true,
        showName: this.showIn.showName,
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

  packageHandler(row: any) {
    this.drawerTitle = "Shot Package";
    this.openPackageForm(row);
  }

  openPackageForm(shotOut: any): void {
    return;
    /*this.childDrawerRef = this.drawerService.create<
      BackupFormComponent,
      {
        shotOut: any;
      },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: BackupFormComponent,
      nzContentParams: {
        shotOut: shotOut,
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

    this.childDrawerRef.afterOpen.subscribe(() => {      
    });

    this.childDrawerRef.afterClose.subscribe((isSuccess) => {      
      if (isSuccess) {
        this.setPage(this.currPageInfo);
      }
    });*/
  }

  deleteHandler(row: any) {
    this.isAlertVisible = true;
    this.shotToDelete = row;
  }

  deleteShotConfirm = async () => {
    let successMessage = "Shot has been successfully deleted.";
    let errorMessage = "Shot deletion failed.";
    this.isAlertVisible = false;
    await this.showsService
      .deleteShot(this.shotToDelete.id)
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

  deleteShotCancel = () => {
    this.isAlertVisible = false;
  };

  onShotCodeClick(row) {
    let routerLink = this.router.url + "/shots/" + row.id;
    this.router.navigate([routerLink]);
  }

  onSort(event) {
    this.sortBy = event.sorts[0].prop;
    this.orderBy = event.sorts[0].dir.toUpperCase();
    this.currPageInfo.offset = 0;
    if (this.sortBy === "tailOutCode") {
      this.sortBy = "tailOut";
    }
    this.setPage(this.currPageInfo);
  }

  toggleExpandGroup(group) {
    this.table.groupHeader.toggleExpandGroup(group);
  }

  onDetailToggle(event) {}

  getGroupHeader(group) {
    return group.key;
    //return group.value[0].shotCode;
  }

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
      },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: TableColumnsSettingsComponent,
      nzContentParams: {
        entity: "SHOT",
        tableColumnsArr: this.tableColumnsArr,
        selectedTableColumns: this.selectedTableColumns,
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
          this.setPage(this.currPageInfo);
        } else {
        }
      }*/
      if (data) {
        if (JSON.stringify(this.tableColumnsArr) !== JSON.stringify(data)) {
          this.tableColumnsArr = data;
          this.frameSelectedColumns(false);
          this.setPage(this.currPageInfo);
          /*setTimeout(() => {
            this.onReorder(null);
          }, 2000);*/
        }
      }
    });
  }

  openFilterSettingsForm(): void {
    this.childDrawerRef = this.drawerService.create<
      ShotFilterSettingsComponent,
      {
        type: any;
        filters: any;
        showId: any;
      },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: ShotFilterSettingsComponent,
      nzContentParams: {
        type: "shot",
        filters: this.shotFilters,
        showId: this.showId,
      },
      nzClosable: false,
      nzWidth: "40%",
      nzWrapClassName: "modal-wrapper",
    });

    this.childDrawerRef.afterOpen.subscribe(() => {});

    this.childDrawerRef.afterClose.subscribe((data) => {
      if (data) {
        if (JSON.stringify(this.shotFilters) !== JSON.stringify(data)) {
          if (this.shotFilters.shotCode && !data.shotCode) {
            this.searchPattern = "";
          }
          this.shotFilters = data;
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
    for (let i in this.shotFilters) {
      let item = this.shotFilters[i];
      if (
        i !== "customFieldValue" &&
        i !== "shotCode" &&
        i !== "completionPercentage"
      ) {
        if (item && item.length > 0) {
          if (filterParams != "") {
            filterParams += "&";
          }
          filterParams += `${i}=${item.toString()}`;
        }
      }
    }

    if (this.shotFilters.completionPercentage) {
      if (filterParams != "") {
        filterParams += "&";
      }
      filterParams += `completionPercentage=${this.shotFilters.completionPercentage}`;
    }

    if (this.shotFilters.shotCode) {
      if (filterParams != "") {
        filterParams += "&";
      }
      filterParams += `shotCode=${this.shotFilters.shotCode}`;
      this.searchPattern = this.shotFilters.shotCode;
    }

    if (this.shotFilters.customFieldId && this.shotFilters.customFieldValue) {
      if (filterParams != "") {
        filterParams += "&";
      }
      filterParams += `customFieldId=${this.shotFilters.customFieldId}&customFieldValue=${this.shotFilters.customFieldValue}`;
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
      dataTableType: "shot",
      columns: columns,
    };
    if (AppConstants.SHOT_USER_SETTINGS_ID) {
      this.shotsService
        .updateUsersettings(AppConstants.SHOT_USER_SETTINGS_ID, settingsIn)
        .toPromise()
        .then((resp: any) => {})
        .catch((error: any) => {});
    } else {
      this.shotsService
        .createUsersettings(settingsIn)
        .toPromise()
        .then((resp: any) => {
          AppConstants.SHOT_USER_SETTINGS_ID = resp.id;
        })
        .catch((error: any) => {});
    }
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
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
    this.bulkStatusId = null;
  }

  bulkStatusUpdateConfirm() {
    let errorMessage = "Records update failed.";
    this.isBulkStatusUpdate = false;
    let selectedIds = this.getSelectedIds();
    let bulkUpdateIn = {
      type: "status",
      shotIds: selectedIds,
      statusId: this.bulkStatusId,
    };

    this.shotsService
      .bulkUpdate(bulkUpdateIn)
      .toPromise()
      .then((resp) => {
        this.showNotification({
          type: "success",
          title: "Success",
          content: "Records updated successfully.",
          duration: AppConstants.NOTIFICATION_DURATION,
        });
        this.bulkStatusId = null;
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

  bulkDeleteConfirm() {
    let successMessage = "Shots have been successfully deleted.";
    let errorMessage = "Shots deletion failed.";
    this.isBulkDelete = false;
    let selectedIds = this.getSelectedIds();
    let bulkUpdateIn = {
      type: "delete",
      shotIds: selectedIds,
    };

    this.shotsService
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

  bulkDeleteCancel() {
    this.isBulkDelete = false;
  }

  progressHandler() {
    let selectedIds = this.getSelectedIds();
    if (selectedIds && selectedIds.length > 0) {
      this.tasksService
        .getTaskProgressByShot(selectedIds)
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

  getColWidth(colName) {
    if (colName === "shotName") {
      return 200;
    } else if (colName === "completionPercentage") {
      return 200;
    } else if (colName === "description") {
      return 200;
    } else if (colName === "sequenceName") {
      return 200;
    } else if (colName === "status") {
      return 200;
    } else if (colName === "thumbnail") {
      return 150;
    } else {
      return 150;
    }
  }

  getStatusColorCode(row: any) {
    let defaultCode = "#038e4e";
    let matched = this.helperService.findObjectInArrayByKey(
      this.statuses,
      "id",
      row.statusId
    );
    return matched && matched.code ? matched.code : defaultCode;
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

  inlineEditHandler(row: any, col: any) {
    this.resetEditFlags();
    this.myrow = row;
    this.mycol = col;

    this.isSequenceSelect = false;
    this.isStatusSelect = false;
    this.isSupervisorSelect = false;
    this.isThumbnailSelect = false;
    this.modalTitle = "";

    if (col.name === "sequenceName") {
      this.modalTitle = "Edit Sequence";
      this.selectedSequenceId = row.sequenceId;
      this.isSequenceSelect = true;
      this.getSequences();
    } else if (col.name === "shootingSupervisorName") {
      this.modalTitle = "Edit Shooting Supervisor";
      this.selectedSupervisorId = row.shootingSupervisorId;
      this.isSupervisorSelect = true;
      this.getSupervisors();
    } else if (col.name === "status") {
      this.modalTitle = "Edit Status";
      this.selectedStatus = row.statusId;
      this.statusModel = row.statusId;
      this.isStatusSelect = true;
      //this.getStatuses();
    } else if (col.name === "thumbnail") {
      this.modalTitle = "Edit Thumbnail";
      this.selectedThumbnailUrl = row.thumbnail;
      this.isThumbnailSelect = true;
    }
    if (this.modalTitle !== "") {
      this.showModal();
    }
  }

  async inlineEditConfirm(row: any, col: any) {
    let shotId = row.id;
    let shotIn: any;
    if (col.name !== "thumbnail") {
      this.isVisible = false;
    }
    if (col.name === "sequenceName") {
      this.isSequenceSelect = false;
      if (this.selectedSequenceId !== row.sequenceId) {
        shotIn = {
          type: "sequenceId",
          sequenceId: row.sequenceId,
        };
        await this.updateConfirm(row, col, shotId, shotIn);
        if (this.isEditSuccess) {
          row[col.name] = this.getSeqNameById(row.sequenceId);
        }
      }
    } else if (col.name === "shootingSupervisorName") {
      this.isSupervisorSelect = false;
      if (this.selectedSupervisorId !== row.shootingSupervisorId) {
        shotIn = {
          type: "shootingSupervisorId",
          shootingSupervisorId: row.shootingSupervisorId,
        };
        await this.updateConfirm(row, col, shotId, shotIn);
        if (this.isEditSuccess) {
          row[col.name] = this.getSupervisorNameById(row.shootingSupervisorId);
        }
      }
    } else if (col.name === "status") {
      this.isStatusSelect = false;
      if (this.selectedStatus !== this.statusModel) {
        shotIn = {
          type: "status",
          statusId: this.statusModel,
        };
        await this.updateConfirm(row, col, shotId, shotIn);
        if (!this.isEditSuccess) {
          row.statusId = this.selectedStatus;
        }
      }
    } else if (col.name === "thumbnail") {
      if (this.imageUploadComponent.isChanged) {
        this.imageUploadComponent.handleUpload();
      } else {
        //do nothing.
      }
    }
  }

  getThumbnail(row, col) {
    if (row[col.name]) {
      return row[col.name];
    } else {
      return "";
    }
  }

  updateThumbnail() {
    this.isVisible = false;
    this.isThumbnailSelect = false;
    let shotIn = {
      type: "thumbnail",
      thumbnail: this.myrow.thumbnail,
    };
    this.updateConfirm(this.myrow, this.mycol, this.myrow.id, shotIn);
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

  getSeqNameById(id: any) {
    //let matchedSeq = this.sequences[this.sequences.map(function (item) { return item.id; }).indexOf(id)];
    let matchedSeq = this.helperService.findObjectInArrayByKey(
      this.sequences,
      "id",
      id
    );
    if (matchedSeq) {
      return matchedSeq.sequenceName;
    } else {
      return "";
    }
  }

  inlineEditCancel(row: any, col: any) {
    this.isVisible = false;
    if (col.name === "sequenceName") {
      this.isSequenceSelect = false;
      row.sequenceId = this.selectedSequenceId;
    } else if (col.name === "shootingSupervisorName") {
      this.isSupervisorSelect = false;
      row.shootingSupervisorId = this.selectedSupervisorId;
    } else if (col.name === "status") {
      this.isStatusSelect = false;
      row.statusId = this.selectedStatus;
    } else if (col.name === "thumbnail") {
      this.isThumbnailSelect = false;
      row.thumbnail = this.selectedThumbnailUrl;
    }
  }

  onUploadChange(e: any) {
    this.myrow.thumbnail = "";
    if (e.type === "success") {
      this.myrow.thumbnail = e.fileDownloadUri;
    }
    if (e.type === "error") {
      let errorMessage = AppConstants.IMAGE_UPLOAD_ERROR;
      if (e.error) {
        let errorDetails = this.helperService.getErrorDetails(e.error);
        if (errorDetails !== "") {
          errorMessage = `<b>${errorMessage}</b>` + errorDetails;
        }
      }
      this.showNotification({
        type: "error",
        title: "Error",
        content: errorMessage,
        duration: AppConstants.NOTIFICATION_DURATION,
      });
    }
    this.updateThumbnail();
  }

  dateOpenChange(row: any, col: any, isOpen: any) {
    if (!isOpen) {
      this.editing[row.id + "-" + col.name] = false;
    }
  }

  showModal(): void {
    this.isVisible = true;
  }

  isValidArr(arr: any) {
    return this.helperService.isValidArr(arr);
  }

  showNotification(info: any) {
    this.notificationService.showNotification(info);
  }
  addColorCodes(statuses: any) {
    let colorCodes = AppConstants.SHOT_STATUS_CODES;
    statuses.map((item: any) => {
      item.code = colorCodes[item.value];
      return item;
    });
  }

  disabledShootingDate = (startValue: Date): boolean => {
    if (!startValue) {
      return false;
    }
    let today = new Date();
    let yesterday = new Date(today.setDate(today.getDate() - 1));
    return startValue.getTime() < yesterday.getTime();
  };

  async updateDateValue(row: any, col: any, event: any) {
    let prev = this.helperService.transformDate(row[col.name]);
    let curr = this.helperService.transformDate(event);
    if (prev != curr) {
      let shotId = row.id;
      let shotIn = {
        type: col.name,
      };
      let dateISOStr = event.toISOString();
      if (dateISOStr.indexOf("T") > -1) {
        shotIn[col.name] = dateISOStr.split("T")[0]; // + 'T00:00:00.000Z';
        //curr; //event.toISOString();
      }

      await this.updateConfirm(row, col, shotId, shotIn);
    }
    if (this.isEditSuccess) {
      row[col.name] = event;
    }
  }

  async updateValue(row: any, col: any, event: any) {
    if (row[col.name] != event.target.value) {
      let shotId = row.id;
      let shotIn = {
        type: col.name,
      };
      shotIn[col.name] = event.target.value;
      await this.updateConfirm(row, col, shotId, shotIn);
    }
    if (this.isEditSuccess) {
      row[col.name] = event.target.value;
    }
    this.editing[row.id + "-" + col.name] = false;
  }

  async updateConfirm(row: any, col: any, shotId: any, shotIn: any) {
    this.isEditSuccess = false;
    let errorMessage = "Record update failed.";
    await this.showsService
      .inlineEditShot(shotId, shotIn)
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

  async getSequences() {
    await this.sequencesService
      .getSequenceList(this.showId)
      .toPromise()
      .then((resp: any) => {
        this.sequences = resp.entity;
      })
      .catch((error: any) => {
        this.sequences = [];
      });
  }

  async getStatuses() {
    await this.showsService
      .getAllStatusNew()
      .toPromise()
      .then((resp: any) => {
        this.statuses = resp.entity;
        //this.addColorCodes(this.statuses);
      })
      .catch((error: any) => {
        this.statuses = [];
      });
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

  getPercentage(value) {
    return Math.floor(value);
  }

  getDisplayDateFormat() {
    return AppConstants.DISPLAY_DATE_FORMAT;
  }

  getDisplayDate(date: any) {
    return this.helperService.transformDate(
      date,
      AppConstants.DISPLAY_DATE_FORMAT
    );
  }
}
