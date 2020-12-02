import {
  Component,
  OnInit,
  Input,
  ViewChild,
  TemplateRef,
  OnDestroy,
} from "@angular/core";
import { Page } from "src/app/modules/shared/model/page";
import { SpotsService } from "../spots.service";
import { NzDrawerService, NzModalService } from "ng-zorro-antd";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { SpotFormComponent } from "../../modals/spot-form/spot-form.component";
import { InteractionService } from "src/app/modules/core/services/interaction.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-spotlist-tab",
  templateUrl: "./spotlist-tab.component.html",
  styleUrls: ["./spotlist-tab.component.scss"],
})
export class SpotlistTabComponent implements OnInit, OnDestroy {
  @Input() showIn: any;
  @ViewChild("drawerHeader", { static: false }) drawerHeader: TemplateRef<{}>;
  @ViewChild("myTable", { static: false }) table: any;
  @Input() isReadOnly: boolean;

  showDummy: boolean;
  childDrawerRef: any;
  isEmptyData: boolean;
  isDataReady: boolean;
  isLoading: boolean = true;
  rows: any;
  showId: any;
  page = new Page();
  selectedPageSize: any;
  pageSizeOptions: any;
  editing = {};
  tableColumns: any;
  selectedTableColumns: any;
  selected = [];
  isEditSuccess: boolean;
  isAlertVisible: boolean;
  spotToDelete: any;
  spotOut: any;
  currPageInfo: any;

  isSearching: boolean;
  searchPattern = "";
  sortBy: any = "";
  orderBy: any = "";
  subscription: Subscription;
  drawerTitle: any;
  tableHeight: any = "calc(100vh - 200px)";

  constructor(
    private spotService: SpotsService,
    private notificationService: NotificationService,
    private drawerService: NzDrawerService,
    private modalService: NzModalService,
    private interactionService: InteractionService,
    private helperService: HelperService
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.pageSizeOptions = AppConstants.TABLE_PAGE_SIZE_OPTIONS;
    this.selectedPageSize = this.page.size;
  }

  ngOnInit() {
    this.isReadOnly = this.helperService.isReadOnly(
      AppConstants.PERMISSIONS.SPOT
    );
    this.showId = this.showIn.id;
    /*this.helperService.isGlobalAddEnabled = false;
    this.subscription = this.interactionService
      .getInteraction()
      .subscribe(interaction => {
        if (interaction.type === "global-add") {
          this.createSpot();
        }
      });*/

    this.getTableColumns();
  }

  ngOnDestroy() {
    //this.subscription.unsubscribe();
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
        name: "spotName",
        displayName: "Spot Name",
        defaultDisplay: true,
        sortable: true,
        isEditable: false,
      },
      {
        name: "description",
        displayName: "Description",
        defaultDisplay: true,
        sortable: false,
        isEditable: !this.isReadOnly ? true : false,
      },
      {
        name: "completionPercentage",
        displayName: "Progress",
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

  getSpace(value: any) {
    //return 0;
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
    //let code = this.getStatusColorCode(row); // && row.statusColorCode ? row.statusColorCode : defaultCode;
    return {
      showInfo: false,
      type: "line",
      strokeLinecap: "square",
      //strokeWidth: 8,
      //strokeColor: code,
    };
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
    this.spotService.getSpotTableList(this.page, this.showId).subscribe(
      (resp) => {
        if (resp && resp.valid) {
          this.page.totalElements = resp.total;
          this.page.totalPages = Math.ceil(resp.total / this.page.size);
          this.rows = resp.coll;
          //this.framePercent(this.rows);
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
              if (this.rows.length <= 10) {
                this.showDummy = true;
              }
            } catch (e) {}
          }, 500);
        } else {
          this.onDataError(resp);
          this.isLoading = false;
        }
        this.setTableHeight();
      },
      (error) => {
        this.isLoading = false;
        this.onDataError(error);
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

  createSpot() {
    this.drawerTitle = "Add Spot";
    let spotInfo = {
      showId: this.showId,
    };
    this.openSpotForm("create", spotInfo);
  }

  async editHandler(row: any) {
    await this.getSpot(row.id);
    if (this.spotOut) {
      this.drawerTitle = "Edit Spot";
      this.openSpotForm("update", this.spotOut);
    }
  }

  async getSpot(id: any) {
    await this.spotService
      .getSpot(id)
      .toPromise()
      .then((resp) => {
        this.spotOut = resp.entity;
      })
      .catch((error) => {
        this.spotOut = null;
      });
  }

  openSpotForm(mode: any, spotOut: any): void {
    this.childDrawerRef = this.drawerService.create<
      SpotFormComponent,
      {
        spotOut: any;
        mode: string;
        disableShowSelect?: boolean;
        showName?: any;
      },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: SpotFormComponent,
      nzContentParams: {
        spotOut: spotOut,
        mode: mode,
        disableShowSelect: true,
        showName: this.showIn.showName,
      },
      nzClosable: false,
      nzWidth: "30%",
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
        this.setPage(this.currPageInfo);
      }
    });
  }

  closeForm(): void {
    this.childDrawerRef.close();
  }

  onSort(event) {
    this.sortBy = event.sorts[0].prop;
    this.orderBy = event.sorts[0].dir.toUpperCase();
    this.currPageInfo.offset = 0;
    this.setPage(this.currPageInfo);
  }

  onSelect({ selected }) {}

  getColWidth(colName: any) {
    if (colName === "completionPercentage") {
      return 200;
    }
    return 500;
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

  async updateValue(row: any, col: any, event: any) {
    if (row[col.name] != event.target.value) {
      let spotId = row.id;
      let spotIn = {
        type: col.name,
      };
      spotIn[col.name] = event.target.value;
      await this.updateConfirm(row, col, spotId, spotIn);
    }
    if (this.isEditSuccess) {
      row[col.name] = event.target.value;
    }
    this.editing[row.id + "-" + col.name] = false;
  }

  async updateConfirm(row: any, col: any, spotId: any, spotIn: any) {
    this.isEditSuccess = false;
    let errorMessage = "Record update failed.";
    await this.spotService
      .inlineEdit(spotId, spotIn)
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

  deleteHandler(row: any) {
    this.isAlertVisible = true;
    this.spotToDelete = row;
  }

  deleteSpotConfirm = async () => {
    let successMessage = "Spot has been successfully deleted.";
    let errorMessage = "Spot deletion failed.";
    this.isAlertVisible = false;
    await this.spotService
      .deleteSpot(this.spotToDelete.id)
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

  deleteSpotCancel = () => {
    this.isAlertVisible = false;
  };

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
        this.tableHeight = "calc(100vh - 200px)";
      }
    }
  }
  getTableHeight() {
    return this.tableHeight;
  }
}
