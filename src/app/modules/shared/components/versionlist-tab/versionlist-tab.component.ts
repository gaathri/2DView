import {
  Component,
  OnInit,
  Input,
  ViewChild,
  TemplateRef,
  OnDestroy,
} from "@angular/core";
import { Page } from "../../model/page";
import { ShowsService } from "src/app/modules/system/shows/shows.service";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { NoteFormComponent } from "src/app/modules/system/modals/note-form/note-form.component";
import { NzDrawerService } from "ng-zorro-antd";
import { PlaylistService } from "src/app/modules/system/playlist/playlist.service";

@Component({
  selector: "app-versionlist-tab",
  templateUrl: "./versionlist-tab.component.html",
  styleUrls: ["./versionlist-tab.component.scss"],
})
export class VersionlistTabComponent implements OnInit {
  @Input() taskIn: any;
  @Input() versionTypes: any;

  @ViewChild("myTable", { static: false }) table: any;
  @ViewChild("drawerHeader", { static: false }) drawerHeader: TemplateRef<{}>;

  childDrawerRef: any;
  drawerTitle: any;

  isReadOnly: boolean;
  showDummy: boolean;
  isEmptyData: boolean;
  isDataReady: boolean;
  isLoading: boolean = true;
  rows: any;
  taskId: any;
  page = new Page();
  selectedPageSize: any;
  pageSizeOptions: any;
  tableColumns: any;
  selectedTableColumns: any;
  selected = [];
  currPageInfo: any;

  isSearching: boolean;
  searchPattern = "";
  sortBy: any = "";
  orderBy: any = "";
  tableHeight: any = "calc(100vh - 200px)";

  isVisible: boolean;
  playlistId: any;
  playlists: any;
  action: any;
  myrow: any;

  versionTypeArr = [];
  versionType: any;

  constructor(
    private showService: ShowsService,
    private playlistService: PlaylistService,
    private notificationService: NotificationService,
    private helperService: HelperService,
    private drawerService: NzDrawerService
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.pageSizeOptions = AppConstants.TABLE_PAGE_SIZE_OPTIONS;
    this.selectedPageSize = this.page.size;
  }

  ngOnInit() {
    this.isReadOnly = this.helperService.isReadOnly(
      AppConstants.PERMISSIONS.TASK
    );
    this.taskId = this.taskIn.id;
  
    this.getTableColumns();
    this.versionTypeArr = ["ALL", ...this.versionTypes.split(",")];
    this.versionType = this.versionTypeArr[0];
  }

  vTypeChangeHandler(e) {
    this.versionType = e;
    this.currPageInfo.offset = 0;
    this.setPage(this.currPageInfo);
  }

  setPageSize() {
    let pageInfo = {
      pageSize: this.selectedPageSize,
      offset: 0,
    };
    this.setPage(pageInfo);
  }

  getTableColumns() {
    this.tableColumns = [
      {
        name: "revisionId",
        displayName: "Version",
        defaultDisplay: true,
        sortable: true,
        isEditable: false,
      },

      {
        name: "versionType",
        displayName: "Version Type",
        defaultDisplay: true,
        sortable: true,
        isEditable: false,
      },

      /*{
        name: "thumbnail",
        displayName: "Thumbnail",
        defaultDisplay: true,
        sortable: false,
        isEditable: false,
      },
      {
        name: "description",
        displayName: "Description",
        defaultDisplay: true,
        sortable: false,
        isEditable: false,
      },*/

      {
        name: "creativeUrl",
        displayName: "Creative Url",
        defaultDisplay: true,
        sortable: false,
        isEditable: false,
      },
      {
        name: "status",
        displayName: "Status",
        defaultDisplay: true,
        sortable: false,
        isEditable: false,
      },
      {
        name: "createDate",
        displayName: "Create Date",
        defaultDisplay: true,
        sortable: false,
        isEditable: false,
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
  isNotesDisabled(row: any)
  {
    if (
      row.versionType === "RENDER"  && this.taskIn.workStatusId !== 8 &&  this.taskIn.workStatusId !== 9
    ) {
      return false;
    }
    return true;    
  }
  isPublishDisabled()
  {
    return this.taskIn.workStatusId !== 8 &&  this.taskIn.workStatusId !== 9
  }
  isDailiesDisabled(row: any) {
    if (
      row.versionType === "RENDER" &&
      this.taskIn &&
      this.taskIn.workStatusId &&
      this.taskIn.workStatusId !== 1 && this.taskIn.workStatusId !== 8 &&  this.taskIn.workStatusId !== 9
    ) {
      return false;
    }
    return true;
  }

  isInternalDisabled(row: any) {
    if (
      row.versionType === "RENDER" &&
      this.taskIn &&
      this.taskIn.workStatusId &&
      this.taskIn.workStatusId !== 1 && this.taskIn.workStatusId !== 8 &&  this.taskIn.workStatusId !== 9
    ) {
      return false;
    }
    return true;
  }

  isExternalDisabled(row: any) {
    if (row.versionType === "INTERNAL" && row.status === "APPROVED" && this.taskIn.workStatusId !== 8 &&  this.taskIn.workStatusId !== 9) {
      return false;
    }
    return true;
  }

  setPage(pageInfo: any) {
    this.currPageInfo = pageInfo;
    this.isLoading = true;
    this.page.pageNumber = pageInfo.offset;
    this.page.size = pageInfo.pageSize;
    this.page.search = this.searchPattern;
    this.page.sortBy = this.sortBy;
    this.page.orderBy = this.orderBy;
    this.showDummy = true;
    let versionTypes = this.versionTypes;
    if (this.versionType != "ALL") {
      versionTypes = this.versionType;
    }
    this.showService
      .getVersionsByTaskId(this.page, this.taskId, versionTypes)
      .subscribe(
        (resp) => {
          if (resp && resp.valid) {
            this.page.totalElements = resp.total;
            this.page.totalPages = Math.ceil(resp.total / this.page.size);
            this.rows = resp.coll;
            setTimeout(() => {
              this.isLoading = false;
              this.table.recalculate();
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
            }, 500);
          } else {
            this.isLoading = false;
            this.onDataError(resp);
          }

          this.setTableHeight();
        },
        (error) => {
          this.isLoading = false;
          this.setTableHeight();
          this.onDataError(error);
        }
      );
  }

  onDataError(error: any) {
    this.isEmptyData = true;
  }

  createVersion() {}

  onSort(event: any) {
    this.sortBy = event.sorts[0].prop;
    if (this.sortBy === "version") {
      this.sortBy = "revisionId";
    }
    this.orderBy = event.sorts[0].dir.toUpperCase();
    this.currPageInfo.offset = 0;
    this.setPage(this.currPageInfo);
  }

  onSelect({ selected }) {}

  async dailiesHandler(row: any) {
    let isEditSuccess = false;
    let errorMessage = "Record update failed.";
    await this.playlistService
      .addToDailies(row.id)
      .toPromise()
      .then((resp: any) => {
        isEditSuccess = true;
        this.currPageInfo.offset = 0;
        this.setPage(this.currPageInfo);
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
  }

  internalHandler(row: any) {
    this.playlistId = null;
    this.action = "internal";
    this.myrow = row;
    this.isVisible = true;
    this.getSharedPlaylists(this.action.toUpperCase());
  }

  externalHandler(row: any) {
    this.playlistId = null;
    this.action = "external";
    this.myrow = row;
    this.isVisible = true;
    this.getSharedPlaylists(this.action.toUpperCase());
  }

  async selectConfirm(row: any) {
    this.isVisible = false;
    if (!this.playlistId) {
      return;
    }
    let serviceName = "";
    if (this.action === "internal") {
      serviceName = "addToInternal";
    } else if (this.action === "external") {
      serviceName = "addToExternal";
    }

    if (!serviceName) {
      return;
    }

    let isEditSuccess = false;
    let errorMessage = "Record update failed.";
    await this.playlistService[serviceName](row.id, this.playlistId)
      .toPromise()
      .then((resp: any) => {
        isEditSuccess = true;
        this.currPageInfo.offset = 0;
        this.setPage(this.currPageInfo);
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
  }

  selectCancel(row: any) {
    this.playlistId = null;
    this.isVisible = false;
  }

  noteHandler(row: any) {
    this.drawerTitle = "Revision Notes";
    this.openNotes(row.id);
    
  }

  publishTask() {
    let publishIn = {
      taskId: this.taskId,
      revisionType: "Existing",
    };

    this.playlistService
      .publishTask(publishIn)
      .toPromise()
      .then((resp: any) => {
        this.showNotification({
          type: "success",
          title: "Success",
          content: "Record updated successfully.",
          duration: AppConstants.NOTIFICATION_DURATION,
        });

        this.setPage(this.currPageInfo);
      })
      .catch((error: any) => {
        let errorMessage = "Record update failed.";
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

  openNotes(taskId: any): void {
    this.childDrawerRef = this.drawerService.create<
      NoteFormComponent,
      { itemId: any; type: any },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: NoteFormComponent,
      nzContentParams: {
        itemId: taskId,
        type: "revision",
      },
      nzClosable: false,
      nzWidth: "50%",
      nzWrapClassName: "modal-wrapper",
    });

    this.childDrawerRef.afterOpen.subscribe(() => {});

    this.childDrawerRef.afterClose.subscribe((isSuccess) => {});
  }

  closeForm(): void {
    this.childDrawerRef.close();
  }

  editHandler(row: any) {}

  getColWidth(colName: any) {
    return 200;
  }

  showNotification(info: any) {
    this.notificationService.showNotification(info);
  }

  isValidArr(arr: any) {
    return this.helperService.isValidArr(arr);
  }

  setTableHeight() {
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

  getTableHeight() {
    return this.tableHeight;
  }

  getDisplayDate(date: any) {
    return this.helperService.transformDate(
      date,
      AppConstants.DISPLAY_DATE_FORMAT
    );
  }

  getSharedPlaylists(type) {
    this.playlistService
      .getSharedPlaylists(type)
      .toPromise()
      .then((resp: any) => {
        this.playlists = resp.entity;
      })
      .catch((error: any) => {
        this.playlists = [];
      });
  }
  getTitle() {
    let revisionId = "";
    if (this.myrow && this.myrow.revisionId) {
      revisionId = this.myrow.revisionId;
    }
    return "Select playlist : " + revisionId;
  }
}
