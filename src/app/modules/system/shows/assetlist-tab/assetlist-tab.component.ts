import {
  Component,
  OnInit,
  Input,
  ViewChild,
  TemplateRef,
  Output,
  EventEmitter,
} from "@angular/core";
import { Page } from "src/app/modules/shared/model/page";
import { AppConstants } from "src/app/constants/AppConstants";
import { ShowsService } from "../shows.service";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { Router } from "@angular/router";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { AssetsService } from "../assets.service";
import {
  NzDrawerService,
  UploadChangeParam,
  NzModalService,
} from "ng-zorro-antd";
import { AssetFormComponent } from "../../modals/asset-form/asset-form.component";
import { TasksService } from "../tasks.service";
import { InteractionService } from "src/app/modules/core/services/interaction.service";
import { Subscription } from "rxjs";
import { ImageUploadComponent } from "src/app/modules/shared/components/image-upload/image-upload.component";
import { TableColumnsSettingsComponent } from "../../modals/table-columns-settings/table-columns-settings.component";
import { AssetFilterSettingsComponent } from "../../modals/asset-filter-settings/asset-filter-settings.component";

@Component({
  selector: "app-assetlist-tab",
  templateUrl: "./assetlist-tab.component.html",
  styleUrls: ["./assetlist-tab.component.scss"],
})
export class AssetlistTabComponent implements OnInit {
  @ViewChild(ImageUploadComponent, { static: false })
  imageUploadComponent: ImageUploadComponent;
  @Input() showIn: any;
  @Input() isReadOnly: boolean;
  @Output("pageUpdate") pageUpdate: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild("myTable", { static: false }) table: any;
  @ViewChild("drawerHeader", { static: false }) drawerHeader: TemplateRef<{}>;
  @ViewChild("myGroupHeader", { static: false }) groupHeader: any;

  isEmptyData: boolean;
  isDataReady: boolean;
  showDummy: boolean;
  childDrawerRef: any;
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
  assetToDelete: any;
  isAlertVisible: boolean;
  drawerTitle: any;
  isBulkStatusUpdate: boolean;
  bulkStatusId: any;

  isBulkDelete: boolean;
  /** Dropdown inline edit vars - START */
  isVisible: boolean;
  modalTitle: any;
  myrow: any;
  mycol: any;

  isStatusSelect: boolean;
  statuses: any;
  selectedStatus: any;
  statusModel: any;

  isTaskTemplateSelect: boolean;
  selectedTaskTemplateId: any;
  taskTemplates: any;

  showOut: any;

  isAssetTypeSelect: boolean;
  selectedAssetTypeId: any;
  assetTypes: any;
  assetOut: any;
  currPageInfo: any;

  isThumbnailSelect: boolean;
  selectedThumbnailUrl: any;

  /** Dropdown inline edit vars - END*/

  selected = [];
  taskProgress: any;
  isProgressVisible: boolean;
  progressConfig: any;

  isSearching: boolean;
  searchPattern = "";

  assetFilters: any;
  sortBy: any = "";
  orderBy: any = "";
  subscription: Subscription;
  tableHeight: any = "calc(100vh - 200px)";

  isFilterApplied: boolean;

  type: any = "sequence";
  groupBy: any;
  isRowGroupEnabled: boolean = false;

  constructor(
    private showsService: ShowsService,
    private assetsService: AssetsService,
    private notificationService: NotificationService,
    private router: Router,
    private helperService: HelperService,
    private interactionService: InteractionService,
    private drawerService: NzDrawerService,
    private modalService: NzModalService,
    private tasksService: TasksService
  ) {
    this.page.pageNumber = 0;
    this.pageSizeOptions = AppConstants.TABLE_PAGE_SIZE_OPTIONS;
    this.page.size = AppConstants.PAGE_SIZE;
    this.selectedPageSize = this.page.size; //.toString();
  }

  ngOnInit() {
    this.isReadOnly = this.helperService.isReadOnly(
      AppConstants.PERMISSIONS.ASSET
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
    this.setGroupByValue();
    this.getUsersettings();
    this.getPageSize();
    await this.getStatuses();
    await this.getShow(this.showId);
    await this.getTableColumns();
    this.assetFilters = {
      customFieldId: null,
      customFieldValue: null,
      assetName: null,
      completionPercentage: null,
      assetTypeIds: [],
      parentAssetIds: [],
      subAssetIds: [],
      linkedShotIds: [],
      //parentAssetIds: [],
      //subAssetIds: [],
      //seasonIds: [],
      //episodeIds: [],
      //sequenceIds: [],
      //spotIds: [],
      status: [],
    };
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

  async getAssetColumnList() {
    let params = `?entityId=${this.showId}`;
    await this.assetsService
      .getAssetColumnList(params)
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
    await this.assetsService
      .getUsersettings()
      .toPromise()
      .then((resp: any) => {
        if (resp && resp.entity) {
          AppConstants.ASSET_USER_SETTINGS_ID = resp.entity.id;
          if (this.isValidArr(resp.entity.columns)) {
            this.userSettings = resp.entity.columns;
          }
        }
      })
      .catch((error: any) => {
        this.userSettings = null;
      });
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
    await this.getAssetColumnList();
    if (this.tableColumnsArr) {
      this.frameSelectedColumns(true);
      this.isDataReady = true;
    }
  }

  addEditableFlag() {
    let nonEditableCols = [
      "assetName",
      "templateName",
      "assetTypeName",
      "completionPercentage",
      "parentAssetNames",
      "subAssetNames",
      "referencePath",
    ];
    for (let i = 0; i < this.tableColumnsArr.length; i++) {
      let tableColumns = this.tableColumnsArr[i].fields;
      tableColumns.map((item: any) => {
        item.isEditable = nonEditableCols.includes(item.name) ? false : true;
        return item;
      });
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
        dataTableType: "asset",
        columns: columns,
      };
      this.assetsService
        .createUsersettings(settingsIn)
        .toPromise()
        .then((resp: any) => {
          AppConstants.ASSET_USER_SETTINGS_ID = resp.id;
        })
        .catch((error: any) => {});
    }

    /*this.selectedTableColumns = this.tableColumns.filter((item, index) => {
      item["index"] = index;
      return item.defaultDisplay;
    });*/
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

  searchHandler() {
    this.isSearching = true;
  }

  searchDetails() {
    this.assetFilters.assetName = null;
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
    this.assetFilters.assetName = null;
    this.searchPattern = "";
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

  onReorder(event: any) {
    let columns = [];
    for (let i = 1; i < this.table._internalColumns.length - 1; i++) {
      columns.push({
        indexId: i,
        columnName: this.table._internalColumns[i].prop,
      });
    }
    let settingsIn = {
      dataTableType: "asset",
      columns: columns,
    };

    if (AppConstants.ASSET_USER_SETTINGS_ID) {
      this.assetsService
        .updateUsersettings(AppConstants.ASSET_USER_SETTINGS_ID, settingsIn)
        .toPromise()
        .then((resp: any) => {})
        .catch((error: any) => {});
    } else {
      this.assetsService
        .createUsersettings(settingsIn)
        .toPromise()
        .then((resp: any) => {
          AppConstants.ASSET_USER_SETTINGS_ID = resp.id;
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

  progressHandler() {
    let selectedIds = this.selected.map((item) => {
      return item.id;
    });

    this.tasksService
      .getTaskProgressByAsset(selectedIds)
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
    this.currPageInfo = pageInfo;
    this.isLoading = true;
    this.page.pageNumber = pageInfo.offset;
    this.page.size = pageInfo.pageSize;
    this.page.sortBy = this.sortBy;
    this.page.orderBy = this.orderBy;
    this.showDummy = true;
    let filterParams = this.getFilterParams();
    this.page.search = this.searchPattern;
    this.isFilterApplied = false;
    if (filterParams != "") {
      this.isFilterApplied = true;
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
    let viewType = "SEQUENCE_VIEW";
    if (this.type === "spot") {
      viewType = "SPOT_VIEW";
    }
    this.assetsService.getAssetTableListNew(params).subscribe(
      (resp) => {
        if (resp && resp.valid) {
          this.page.totalElements = resp.total;
          this.page.totalPages = Math.ceil(resp.total / this.page.size);
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
            /*let parentHeight = this.table.bodyComponent.scroller.parentElement.getBoundingClientRect()
                  .height;
                let childHeight = this.table.bodyComponent.scroller.element.getBoundingClientRect()
                  .height;
                if (childHeight > parentHeight) {
                  this.showDummy = false;
                } else {
                  this.showDummy = true;
                }
                if (this.rows.length <= 10) {
                  this.showDummy = true;
                }*/
          }, 500);
        } else {
          this.isLoading = false;
          this.onDataError(resp);
        }
        this.setTableHeight();
      },
      (error) => {
        this.rows = [];
        this.isLoading = false;
        //this.onDataError(error);
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

  createAsset() {
    this.drawerTitle = "Add Asset";
    let assetOut = {
      showId: this.showId,
    };
    this.openAssetForm("create", assetOut);
  }

  async editHandler(row: any) {
    await this.getAsset(row.id);
    if (this.assetOut) {
      this.drawerTitle = "Edit Asset";
      this.openAssetForm("update", this.assetOut);
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

  async getAsset(id: any) {
    await this.assetsService
      .getAsset(id)
      .toPromise()
      .then((resp) => {
        this.assetOut = resp.entity;
      })
      .catch((error) => {
        this.assetOut = null;
      });
  }

  openAssetForm(mode: any, assetOut: any): void {
    this.childDrawerRef = this.drawerService.create<
      AssetFormComponent,
      {
        assetOut: any;
        mode: string;
        disableShowSelect?: boolean;
        showName?: any;
      },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: AssetFormComponent,
      nzContentParams: {
        assetOut: assetOut,
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

  deleteHandler(row: any) {
    this.isAlertVisible = true;
    this.assetToDelete = row;
  }

  deleteAssetConfirm = async () => {
    let successMessage = "Asset has been successfully deleted.";
    let errorMessage = "Asset deletion failed.";
    this.isAlertVisible = false;
    await this.assetsService
      .deleteAsset(this.assetToDelete.id)
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

  deleteAssetCancel = () => {
    this.isAlertVisible = false;
  };

  onAssetNameClick(row: any) {
    let routerLink = this.router.url + "/assets/" + row.id;
    this.router.navigate([routerLink]);
  }

  onSort(event) {
    this.sortBy = event.sorts[0].prop;
    this.orderBy = event.sorts[0].dir.toUpperCase();
    this.currPageInfo.offset = 0;
    this.setPage(this.currPageInfo);
  }

  toggleExpandGroup(group) {
    this.table.groupHeader.toggleExpandGroup(group);
  }

  onDetailToggle(event) {}

  getGroupHeader(group) {
    return group.key;
  }

  getColWidth(colName: any) {
    if (colName === "completionPercentage") {
      return 200;
    }
    return 250;
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

    this.isStatusSelect = false;
    this.isTaskTemplateSelect = false;
    this.isAssetTypeSelect = false;
    this.isThumbnailSelect = false;
    this.modalTitle = "";

    if (col.name === "status") {
      this.modalTitle = "Edit Status";
      this.selectedStatus = row.statusId;
      this.statusModel = row.statusId;
      this.isStatusSelect = true;
      //this.getStatuses();
    } else if (col.name === "templateName") {
      this.modalTitle = "Edit Task Template";
      this.selectedTaskTemplateId = row.taskTemplateId;
      this.isTaskTemplateSelect = true;
      this.getTaskTemplates();
    } else if (col.name === "assetTypeName") {
      this.modalTitle = "Edit Asset Type";
      this.selectedAssetTypeId = row.assetTypeId;
      this.isAssetTypeSelect = true;
      this.getAssetTypes();
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
    let assetId = row.id;
    let assetIn: any;
    if (col.name !== "thumbnail") {
      this.isVisible = false;
    }
    if (col.name === "status") {
      this.isStatusSelect = false;
      if (this.selectedStatus !== this.statusModel) {
        assetIn = {
          type: "status",
          statusId: this.statusModel,
        };
        await this.updateConfirm(row, col, assetId, assetIn);
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
    let assetIn = {
      type: "thumbnail",
      thumbnail: this.myrow.thumbnail,
    };
    this.updateConfirm(this.myrow, this.mycol, this.myrow.id, assetIn);
  }

  inlineEditCancel(row: any, col: any) {
    this.isVisible = false;
    if (col.name === "status") {
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
        entity: "ASSET",
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
        }
      }
    });
  }

  openFilterSettingsForm(): void {
    this.childDrawerRef = this.drawerService.create<
      AssetFilterSettingsComponent,
      {
        type: any;
        filters: any;
        showId: any;
      },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: AssetFilterSettingsComponent,
      nzContentParams: {
        type: "asset",
        filters: this.assetFilters,
        showId: this.showId,
      },
      nzClosable: false,
      nzWidth: "40%",
      nzWrapClassName: "modal-wrapper",
    });

    this.childDrawerRef.afterOpen.subscribe(() => {});

    this.childDrawerRef.afterClose.subscribe((data) => {
      if (data) {
        if (JSON.stringify(this.assetFilters) !== JSON.stringify(data)) {
          if (this.assetFilters.assetName && !data.assetName) {
            this.searchPattern = "";
          }
          this.assetFilters = data;
          this.currPageInfo.offset = 0;
          this.setPage(this.currPageInfo);
        } else {
        }
      }
    });
  }

  getFilterParams() {
    let filterParams = "";
    for (let i in this.assetFilters) {
      let item = this.assetFilters[i];
      if (
        i !== "customFieldValue" &&
        i !== "assetName" &&
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

    if (this.assetFilters.completionPercentage) {
      if (filterParams != "") {
        filterParams += "&";
      }
      filterParams += `completionPercentage=${this.assetFilters.completionPercentage}`;
    }
    if (this.assetFilters.assetName) {
      if (filterParams != "") {
        filterParams += "&";
      }
      filterParams += `assetName=${this.assetFilters.assetName}`;
      this.searchPattern = this.assetFilters.assetName;
    }

    if (this.assetFilters.customFieldId && this.assetFilters.customFieldValue) {
      if (filterParams != "") {
        filterParams += "&";
      }
      filterParams += `customFieldId=${this.assetFilters.customFieldId}&customFieldValue=${this.assetFilters.customFieldValue}`;
    }
    return filterParams;
  }

  async updateValue(row: any, col: any, event: any) {
    if (row[col.name] != event.target.value) {
      let assetId = row.id;
      let assetIn = {
        type: col.name,
      };
      assetIn[col.name] = event.target.value;
      await this.updateConfirm(row, col, assetId, assetIn);
    }
    if (this.isEditSuccess) {
      row[col.name] = event.target.value;
    }
    this.editing[row.id + "-" + col.name] = false;
  }

  async updateConfirm(row: any, col: any, assetId: any, assetIn: any) {
    this.isEditSuccess = false;
    let errorMessage = "Record update failed.";
    await this.assetsService
      .inlineEdit(assetId, assetIn)
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

  async getStatuses() {
    await this.showsService
      .getAllStatusNew()
      .toPromise()
      .then((resp: any) => {
        this.statuses = resp.entity;
      })
      .catch((error: any) => {
        this.statuses = [];
      });
  }

  async getTaskTemplates() {
    await this.showsService
      .getTaskTemplates()
      .toPromise()
      .then((resp: any) => {
        this.taskTemplates = resp.entity;
      })
      .catch((error: any) => {
        this.taskTemplates = [];
      });
  }

  async getAssetTypes() {
    await this.assetsService
      .getAssetTypes()
      .toPromise()
      .then((resp: any) => {
        this.assetTypes = resp.entity;
      })
      .catch((error: any) => {
        this.assetTypes = [];
      });
  }

  setTableHeight2() {
    if (!this.isValidArr(this.rows)) {
      this.tableHeight = 150 + "px";
    } else {
      if (this.rows.length <= 10) {
        this.tableHeight = this.rows.length * 50 + 120 + "px";
      } else {
        this.tableHeight = "calc(100vh - 300px)";
      }
    }
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
  getPercentage(value) {
    return Math.floor(value);
  }

  getSelectedIds() {
    return this.selected.map((item) => {
      return item.id;
    });
  }

  bulkStatusUpdate() {
    let selectedIds = this.getSelectedIds();
    console.log(selectedIds);
    if (selectedIds && selectedIds.length > 0) {
      this.isBulkStatusUpdate = true;
    }
  }
  

  bulkStatusUpdateConfirm() {
    let errorMessage = "Records update failed.";
    this.isBulkStatusUpdate = false;
    let selectedIds = this.getSelectedIds();
    let bulkUpdateIn = {
      type: "status",
      assetIds: selectedIds,
      statusId: this.bulkStatusId,
    };

    this.assetsService
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
  bulkStatusUpdateCancel() {
    this.isBulkStatusUpdate = false;
    this.bulkStatusId = null;
  }

 
  bulkDeleteHandler() {
    let selectedIds = this.getSelectedIds();
    if (selectedIds && selectedIds.length > 0) {
      this.isBulkDelete = true;
    }
  }
  bulkDeleteConfirm() {
    let successMessage = "Assets have been successfully deleted.";
    let errorMessage = "Assets deletion failed.";
    this.isBulkDelete = false;
    let selectedIds = this.getSelectedIds();
    let bulkUpdateIn = {
      type: "delete",
      assetIds: selectedIds,
    };

    this.assetsService
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


}
