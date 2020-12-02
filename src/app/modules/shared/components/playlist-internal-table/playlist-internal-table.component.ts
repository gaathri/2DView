import {
  Component,
  OnInit,
  Input,
  ViewChild,
  TemplateRef,
  OnDestroy,
  Output,
  EventEmitter,
} from "@angular/core";
import { Page } from "../../model/page";
import { ShowsService } from "src/app/modules/system/shows/shows.service";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { PlaylistService } from "src/app/modules/system/playlist/playlist.service";
import { NzDrawerService, NzModalService } from "ng-zorro-antd";
import { DailiesFilterSettingsComponent } from "src/app/modules/system/modals/dailies-filter-settings/dailies-filter-settings.component";
import { Router } from "@angular/router";
import { ReviewFormComponent } from "src/app/modules/system/modals/review-form/review-form.component";

@Component({
  selector: "app-playlist-internal-table",
  templateUrl: "./playlist-internal-table.component.html",
  styleUrls: ["./playlist-internal-table.component.scss"],
})
export class PlaylistInternalTableComponent implements OnInit, OnDestroy {
  @ViewChild("myTable", { static: false }) table: any;
  @ViewChild("drawerHeader", { static: false }) drawerHeader: TemplateRef<{}>;
  @Output("action") onAction = new EventEmitter<any>();
  @Input() playlistType: any;

  childDrawerRef: any;
  drawerTitle: any;
  playlistFilters: any;

  isReadOnly: boolean;
  showDummy: boolean;
  isEmptyData: boolean;
  isDataReady: boolean;
  isLoading: boolean = true;
  rows: any;
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

  isFilterApplied: boolean;
  isAlertVisible: boolean;
  itemToDelete: any;
  playlistInfo: any;
  isReviewOpen: boolean;
  isFilterOpen: boolean;

  selectedItem: any;

  moreActions: any;
  myActions: any;
  count = 0;

  statusList: any;
  status = "";
  showStatusFilter: boolean;

  constructor(
    private playlistService: PlaylistService,
    private notificationService: NotificationService,
    private modalService: NzModalService,
    private helperService: HelperService,
    private drawerService: NzDrawerService,
    private router: Router
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.pageSizeOptions = AppConstants.TABLE_PAGE_SIZE_OPTIONS;
    this.selectedPageSize = this.page.size;
  }

  async ngOnInit() {
    this.isReadOnly = this.helperService.isReadOnly(
      AppConstants.PERMISSIONS.PLAYLIST
    );
    this.getTableColumns();

    this.playlistFilters = {
      showId: null,
      shotIds: [],
      assetIds: [],
      accountableIds: [],
      artistIds: [],
      taskTypeIds: [],
      status: [],
    };

    this.statusList = AppConstants.PLAYLIST_STATUS_LIST;
    this.status = AppConstants.PLAYLIST_STATUS_LIST[0];
    /*this.showStatusFilter = false;
    if (this.playlistType !== AppConstants.PLAYLIST_TYPE.ARCHIVE) {
      this.showStatusFilter = true;
    }*/
    this.showStatusFilter = true;
  }

  ngOnDestroy(): void {
    this.closeForm();
  }

  clickHandler(item: any) {
    if (item) {
      this.count = item.taskCount;
      this.selectedItem = null;
      this.searchPattern = "";
      this.isSearching = false;

      setTimeout(() => {
        this.selectedItem = item;
        this.getMoreActions();
      }, 200);
    }
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
        name: "taskName",
        displayName: "Task Name",
        defaultDisplay: true,
        sortable: true,
        isEditable: false,
      },
      {
        name: "taskCode",
        displayName: "Task Code",
        defaultDisplay: true,
        sortable: true,
        isEditable: false,
      },
      {
        name: "status",
        displayName: "Status",
        defaultDisplay: true,
        sortable: true,
        isEditable: false,
      },
      // {
      //   name: "revision",
      //   displayName: "Revision",
      //   defaultDisplay: true,
      //   sortable: true,
      //   isEditable: false,
      // },
      {
        //name: "taskRevisionId",
        name: "taskRevisionName",
        displayName: "Revision",
        defaultDisplay: true,
        sortable: true,
        isEditable: false,
      },
      {
        name: "showName",
        displayName: "Show Name",
        defaultDisplay: true,
        sortable: true,
        isEditable: false,
      },
      {
        name: "shotName",
        displayName: "Shot Name",
        defaultDisplay: true,
        sortable: true,
        isEditable: false,
      },
      {
        name: "assetName",
        displayName: "Asset Name",
        defaultDisplay: true,
        sortable: true,
        isEditable: false,
      },
      {
        name: "artistName",
        displayName: "Artist Name",
        defaultDisplay: true,
        sortable: false,
        isEditable: false,
      },
      {
        name: "accountable",
        displayName: "Accountable",
        defaultDisplay: true,
        sortable: false,
        isEditable: false,
      },
      {
        name: "startDate",
        displayName: "Start Date",
        defaultDisplay: true,
        sortable: false,
        isEditable: false,
      },
      {
        name: "endDate",
        displayName: "End Date",
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

  statusChangeHandler(e: any) {
    this.status = e;
    this.currPageInfo.offset = 0;
    this.setPage(this.currPageInfo);
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
    let params = `search=${this.page.search}&pageNo=${this.page.pageNumber}&pageSize=${this.page.size}&sortBy=${this.page.sortBy}&orderBy=${this.page.orderBy}`;
    if (this.status !== AppConstants.PLAYLIST_STATUS_LIST[0]) {
      params += `&status=${this.status}`;
    }
    //let params = `search=${this.page.search}&pageNo=${this.page.pageNumber}&pageSize=${this.page.size}&sortBy=${this.page.sortBy}&orderBy=${this.page.orderBy}`;
    let filterParams = this.getFilterParams();
    this.isFilterApplied = false;
    if (filterParams !== "") {
      this.isFilterApplied = true;
      params += `&${filterParams}`;
    }
    this.playlistService
      .getVersionsByPlaylist(this.selectedItem.id, params)
      .subscribe(
        (resp) => {
          if (resp && resp.valid) {
            //this.count = resp.total;
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
    this.rows = [];
  }

  onSort(event: any) {
    this.sortBy = event.sorts[0].prop;
    this.orderBy = event.sorts[0].dir.toUpperCase();
    if (this.sortBy === "revision") {
      this.sortBy = "taskRevisionName";
    }
    if (this.sortBy === "status") {
      this.sortBy = "revisionStatus";
    }

    this.currPageInfo.offset = 0;
    this.setPage(this.currPageInfo);
  }

  onSelect({ selected }) {}

  reviewHandler(rowIndex: any) {
    /*let routerLink = this.router.url + "/" + this.selectedItem.id + "/annotation";
    this.router.navigate([routerLink]);*/
    let pageNumber = this.currPageInfo.offset;
    let pageSize = this.currPageInfo.pageSize;
    let actualIndex = rowIndex + pageNumber * pageSize;
    this.openReviewForm(this.selectedItem.id, actualIndex);
    /*await this.getPlaylist(this.selectedItem.id);
    if (this.playlistInfo) {
      this.openReviewForm(this.selectedItem.id, row, actualIndex);
    }*/
  }

  /*async getPlaylist(playlistId: any) {
    await this.playlistService
      .getPlaylist(playlistId)
      .toPromise()
      .then((resp: any) => {
        this.playlistInfo = resp.entity;
      })
      .catch((error) => {
        this.playlistInfo = null;
      });
  }*/

  deleteHandler(row: any) {
    this.isAlertVisible = true;
    this.itemToDelete = row;
  }

  deletePlaylistConfirm = async () => {
    let successMessage = "Revision has been successfully deleted.";
    let errorMessage = "Revision deletion failed.";
    this.isAlertVisible = false;
    await this.playlistService
      .deleteRevision(this.itemToDelete.taskRevisionId, this.selectedItem.id)
      .toPromise()
      .then((resp) => {
        this.showNotification({
          type: "success",
          title: "Success",
          content: successMessage,
          duration: AppConstants.NOTIFICATION_DURATION,
        });
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

  deletePlaylistCancel = () => {
    this.isAlertVisible = false;
  };

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

  filterHandler() {
    this.openFilterSettingsForm();
  }

  getFilterParams() {
    let filterParams = "";

    for (let i in this.playlistFilters) {
      let item = this.playlistFilters[i];

      if (item && item.length > 0) {
        if (filterParams != "") {
          filterParams += "&";
        }
        filterParams += `${i}=${item.toString()}`;
      }
    }

    if (this.playlistFilters.showId) {
      if (filterParams != "") {
        filterParams += "&";
      }
      filterParams += `showIds=${this.playlistFilters.showId}`;
    }
    return filterParams;
  }

  openFilterSettingsForm(): void {
    this.drawerTitle = "Filters";
    this.isFilterOpen = true;
    this.childDrawerRef = this.drawerService.create<
      DailiesFilterSettingsComponent,
      {
        filters: any;
      },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: DailiesFilterSettingsComponent,
      nzContentParams: {
        filters: this.playlistFilters,
      },
      nzClosable: false,
      nzWidth: "40%",
      nzWrapClassName: "modal-wrapper",
    });

    this.childDrawerRef.afterOpen.subscribe(() => {});

    this.childDrawerRef.afterClose.subscribe((data) => {
      this.isFilterOpen = false;
      if (data) {
        if (JSON.stringify(this.playlistFilters) !== JSON.stringify(data)) {
          this.playlistFilters = data;
          this.currPageInfo.offset = 0;
          this.setPage(this.currPageInfo);
        } else {
        }
      }
    });
  }

  openReviewForm(playlistId: any, rowIndex: any): void {
    this.isReviewOpen = true;
    this.drawerTitle = "Review Screen";
    this.childDrawerRef = this.drawerService.create<
      ReviewFormComponent,
      {
        playlistId: any;
        //playlistInfo: any;
        //revisionInfo: any;
        rowIndex: any;
      },
      string
    >({
      nzTitle: null,
      nzContent: ReviewFormComponent,
      nzContentParams: {
        playlistId: playlistId,
        //playlistInfo: this.playlistInfo,
        //revisionInfo: revisionInfo,
        rowIndex: rowIndex,
      },
      nzClosable: false,
      //nzWidth: "calc(100% - 50px)",
      nzWidth: "100%",
      nzWrapClassName: "modal-wrapper review-wrapper no-header-footer",
      nzNoAnimation: true,
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
      this.isReviewOpen = false;
      if (isSuccess) {
        this.setPage(this.currPageInfo);
      }
    });
  }

  closeForm(): void {
    if (this.childDrawerRef) {
      if (this.drawerTitle == "Review Screen" && this.isReviewOpen) {
        this.childDrawerRef.close();
      } else if (this.drawerTitle == "Filters" && this.isFilterOpen) {
        this.childDrawerRef.close();
      }
    }
  }

  getDisplayDate(date: any) {
    return this.helperService.transformDate(
      date,
      AppConstants.DISPLAY_DATE_FORMAT
    );
  }

  actionHandler(action: any) {
    if (action.id === "review") {
      if (this.isValidArr(this.rows)) {
        this.reviewHandler(0);
      }
    } else {
      this.onAction.emit(action);
    }
  }

  hasEditPermission() {
    if (
      this.isReadOnly ||
      this.playlistType === AppConstants.PLAYLIST_TYPE.ARCHIVE ||
      this.playlistType === AppConstants.PLAYLIST_TYPE.DAILIES
    ) {
      return false;
    }
    let privilegeId = this.helperService.getPrivilegeId();
    if (privilegeId === AppConstants.CLIENT_PRIVILEGE_ID) {
      return false;
    }
    return true;
  }

  hasDeletePermission() {
    if (
      this.isReadOnly ||
      this.playlistType !== AppConstants.PLAYLIST_TYPE.ARCHIVE
    ) {
      return false;
    }
    return true;
  }

  hasSendPermission() {
    if (
      this.isReadOnly ||
      this.playlistType === AppConstants.PLAYLIST_TYPE.ARCHIVE ||
      this.playlistType === AppConstants.PLAYLIST_TYPE.DAILIES
    ) {
      return false;
    }
    let privilegeId = this.helperService.getPrivilegeId();
    if (privilegeId === AppConstants.CLIENT_PRIVILEGE_ID) {
      return false;
    }
    return true;
  }

  hasSharePermission() {
    if (
      this.isReadOnly ||
      this.playlistType === AppConstants.PLAYLIST_TYPE.ARCHIVE ||
      this.playlistType === AppConstants.PLAYLIST_TYPE.DAILIES
    ) {
      return false;
    }
    let privilegeId = this.helperService.getPrivilegeId();
    if (privilegeId === AppConstants.CLIENT_PRIVILEGE_ID) {
      return false;
    }
    return true;
  }

  hasRestorePermission() {
    if (
      this.isReadOnly ||
      this.playlistType !== AppConstants.PLAYLIST_TYPE.ARCHIVE
    ) {
      return false;
    }
    return true;
  }

  hasEmailPermission() {
    if (
      this.isReadOnly ||
      this.playlistType === AppConstants.PLAYLIST_TYPE.ARCHIVE
    ) {
      return false;
    }
    return true;
  }

  hasDownloadPermission() {
    if (
      this.isReadOnly ||
      this.playlistType === AppConstants.PLAYLIST_TYPE.ARCHIVE
    ) {
      return false;
    }
    return true;
  }

  hasLockPermission() {
    if (
      this.isReadOnly ||
      this.playlistType === AppConstants.PLAYLIST_TYPE.ARCHIVE
    ) {
      return false;
    }
    let privilegeId = this.helperService.getPrivilegeId();
    if (privilegeId === AppConstants.CLIENT_PRIVILEGE_ID) {
      return false;
    }
    return true;
  }

  hasArchivePermission() {
    if (
      this.isReadOnly ||
      this.playlistType === AppConstants.PLAYLIST_TYPE.ARCHIVE
    ) {
      return false;
    }
    return true;
  }

  hasReviewPermission() {
    if (
      this.isReadOnly ||
      this.playlistType === AppConstants.PLAYLIST_TYPE.ARCHIVE
    ) {
      return false;
    }
    return true;
  }

  getMoreActions() {
    this.moreActions = [
      {
        id: "edit",
        title: "Edit Playlist",
        show: this.hasEditPermission(),
      },
      {
        id: "delete",
        title: "Delete Playlist",
        show: this.hasDeletePermission(),
      },
      {
        id: "send",
        title: "Send Playlist",
        show: this.hasSendPermission(),
      },
      {
        id: "share",
        title: "Share Playlist",
        show: this.hasSharePermission(),
      },
      {
        id: "lock",
        title:
          this.selectedItem && this.selectedItem.isLocked === 1
            ? "Unlock Playlist"
            : "Lock Playlist",
        show: this.hasLockPermission(),
      },
      {
        id: "review",
        title: "Review Playlist",
        show: this.hasReviewPermission(),
      },
      {
        id: "archive",
        title: "Archive Playlist",
        show: this.hasArchivePermission(),
      },
      {
        id: "email_feedbacks",
        title: "Email Feedbacks",
        show: this.hasEmailPermission(),
      },
      {
        id: "download_feedbacks",
        title: "Download Feedbacks",
        show: this.hasDownloadPermission(),
      },
      {
        id: "restore",
        title: "Restore Playlist",
        show: this.hasRestorePermission(),
      },
    ];
    this.myActions = this.moreActions.filter((item: any) => item.show);
  }
}
