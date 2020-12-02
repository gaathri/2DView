import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { AppConstants } from "src/app/constants/AppConstants";
import { ShowsService } from "src/app/modules/system/shows/shows.service";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { Page } from "../../model/page";

@Component({
  selector: "app-favorite-shows",
  templateUrl: "./favorite-shows.component.html",
  styleUrls: ["./favorite-shows.component.scss"],
})
export class FavoriteShowsComponent implements OnInit {
  @ViewChild("myTable", { static: false }) table: any;
  @Input() isReadOnly: boolean;
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
  currPageInfo: any;
  isSearching: boolean;
  searchPattern = "";
  sortBy: any = "";
  orderBy: any = "";
  tableHeight: any = "calc(100vh - 200px)";

  constructor(
    private showsService: ShowsService,
    private notificationService: NotificationService,
    private helperService: HelperService
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.pageSizeOptions = AppConstants.TABLE_PAGE_SIZE_OPTIONS;
    this.selectedPageSize = this.page.size;
  }

  ngOnInit() {
    this.getTableColumns();
  }

  setPageSize() {
    let pageInfo = {
      pageSize: this.selectedPageSize,
      offset: 0,
    };
    this.setPage(pageInfo);
  }

  getTitle(row: any) {
    if (row.favorite === 1) {
      return "Remove from favorite list";
    } else {
      return "Add to favorite list";
    }
  }

  likeHandler(row: any) {
    if (this.isReadOnly) {
      return;
    }
    if (row.favorite === 1) {
      this.dislikeShow(row.id);
    } else {
      this.likeShow(row.id);
    }
  }

  getIconTheme(row: any) {
    let isFavorite = false;
    if (row.favorite === 1) {
      isFavorite = true;
    }
    return isFavorite ? "fill" : "outline";
  }

  getTableColumns() {
    this.tableColumns = [
      {
        name: "thumbnail",
        displayName: "Thumbnail",
        defaultDisplay: true,
        sortable: false,
        isEditable: false,
      },
      {
        name: "showName",
        displayName: "Show Name",
        defaultDisplay: true,
        sortable: true,
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

  setPage(pageInfo: any) {
    this.currPageInfo = pageInfo;
    this.isLoading = true;
    this.page.pageNumber = pageInfo.offset;
    this.page.size = pageInfo.pageSize;
    this.page.search = this.searchPattern;
    this.page.sortBy = this.sortBy;
    this.page.orderBy = this.orderBy;
    this.showDummy = true;
    this.showsService.getFavoriteShowsByUser(this.page).subscribe(
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

  onSort(event: any) {
    this.sortBy = event.sorts[0].prop;
    this.orderBy = event.sorts[0].dir.toUpperCase();
    this.currPageInfo.offset = 0;
    this.setPage(this.currPageInfo);
  }

  getColWidth(colName: any) {
    if (colName === "thumbnail") {
      return 100;
    }
    return 500;
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

  onDataError(error: any) {
    this.isEmptyData = true;
  }

  dislikeShow = async (id: any) => {
    let successMessage = AppConstants.SHOW_DISLIKE_SUCCESS;
    let errorMessage = AppConstants.SHOW_DISLIKE_ERROR;
    await this.showsService
      .dislikeShow(id)
      .toPromise()
      .then((resp) => {
        this.showNotification({
          type: "success",
          title: "Success",
          content: successMessage,
          duration: AppConstants.NOTIFICATION_DURATION,
        });
        this.setPage(this.currPageInfo);
      })
      .catch((error) => {
        if (error && error.error && error.error.body) {
          if (error.error.body[0] && error.error.body[0].message) {
            errorMessage =
              errorMessage + "<br/>Reason : " + error.error.body[0].message;
          }
        }
        this.showNotification({
          type: "error",
          title: "Error",
          content: errorMessage,
          duration: AppConstants.NOTIFICATION_DURATION,
        });
      });
  };

  async likeShow(id: any) {
    let likeIn = {
      entityTypeName: "Show",
      entityId: id,
    };
    let successMessage = AppConstants.SHOW_LIKE_SUCCESS;
    let errorMessage = AppConstants.SHOW_LIKE_ERROR;
    await this.showsService
      .likeShow(likeIn)
      .toPromise()
      .then((resp) => {
        this.showNotification({
          type: "success",
          title: "Success",
          content: successMessage,
          duration: AppConstants.NOTIFICATION_DURATION,
        });
        this.setPage(this.currPageInfo);
      })
      .catch((error) => {
        if (error && error.error && error.error.body) {
          if (error.error.body[0] && error.error.body[0].message) {
            errorMessage =
              errorMessage + "<br/>Reason : " + error.error.body[0].message;
          }
        }
        this.showNotification({
          type: "error",
          title: "Error",
          content: errorMessage,
          duration: AppConstants.NOTIFICATION_DURATION,
        });
      });
  }

  isValidArr(arr: any) {
    return this.helperService.isValidArr(arr);
  }

  showNotification(info: any) {
    this.notificationService.showNotification(info);
  }
}
