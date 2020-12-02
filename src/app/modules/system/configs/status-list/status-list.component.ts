import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  OnDestroy,
} from "@angular/core";
import { Page } from "src/app/modules/shared/model/page";
import { StatusService } from "../status.service";
import { NzDrawerService, NzModalService } from "ng-zorro-antd";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { InteractionService } from "src/app/modules/core/services/interaction.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { Subscription } from "rxjs";
import { ShotAssetStatusFormComponent } from "../../modals/shot-asset-status-form/shot-asset-status-form.component";

@Component({
  selector: "app-status-list",
  templateUrl: "./status-list.component.html",
  styleUrls: ["./status-list.component.scss"],
})
export class StatusListComponent implements OnInit {
  @ViewChild("myTable", { static: false }) table: any;
  @ViewChild("drawerHeader", { static: false }) drawerHeader: TemplateRef<{}>;

  showDummy: boolean;
  childDrawerRef: any;
  isEmptyData: boolean;
  isDataReady: boolean;
  isLoading: boolean = true;
  rows: any;
  page = new Page();
  currPageInfo: any;
  selectedPageSize: any;
  pageSizeOptions: any;
  editing = {};
  tableColumns: any;
  selectedTableColumns: any;
  selected = [];
  isEditSuccess: boolean;
  isAlertVisible: boolean;
  statusToDelete: any;
  statusOut: any;
  statusToToggle: any;
  isToggleAlertVisible: boolean;
  isSearching: boolean;
  searchPattern = "";
  sortBy: any = "";
  orderBy: any = "";
  subscription: Subscription;
  drawerTitle: any;
  isReadOnly: boolean;

  constructor(
    private statusService: StatusService,
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
    this.interactionService.sendInteraction("breadcrumb", "hide_breadcrumb");
    this.getTableColumns();
    this.isReadOnly = this.helperService.isReadOnly(
      AppConstants.PERMISSIONS.STATUS
    );
  }

  isEditable(row?: any) {
    if (this.isReadOnly) {
      return false;
    }
    if (row && row.isPredefined) {
      return false;
    }
    return true;
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
        name: "isActive",
        displayName: "Status",
        defaultDisplay: true,
        sortable: true,
        isEditable: false,
      },
      {
        name: "name",
        displayName: "Shot/Asset Status Name",
        defaultDisplay: true,
        sortable: true,
        isEditable: false,
      },
      {
        name: "desc",
        displayName: "Description",
        defaultDisplay: true,
        sortable: false,
        isEditable: false,
      },
      {
        name: "code",
        displayName: "Color Code",
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

  setPage(pageInfo: any) {
    this.currPageInfo = pageInfo;
    this.isLoading = true;
    this.page.pageNumber = pageInfo.offset;
    this.page.size = pageInfo.pageSize;
    this.page.search = this.searchPattern;
    this.page.sortBy = this.sortBy;
    this.page.orderBy = this.orderBy;
    this.showDummy = true;
    this.statusService.getStatusTableList(this.page).subscribe(
      (resp) => {
        if (resp && resp.valid) {
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
            } catch (e) {}
          }, 500);
        } else {
          this.onDataError(resp);
        }
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        this.onDataError(error);
      }
    );
  }

  onDataError(error: any) {
    this.isEmptyData = true;
  }

  createStatus() {
    this.drawerTitle = "Add Status";
    this.openStatusForm("create", null);
  }

  async editHandler(row: any) {
    await this.getStatus(row.id);
    if (this.statusOut) {
      console.log(this.statusOut);
      this.drawerTitle = "Edit Status";
      this.openStatusForm("update", this.statusOut);
    }
  }

  async getStatus(id: any) {
    await this.statusService
      .getStatus(id)
      .toPromise()
      .then((resp) => {
        this.statusOut = resp.entity;
      })
      .catch((error) => {
        console.log(error);
        this.statusOut = null;
      });
  }

  openStatusForm(mode: any, statusOut: any): void {
    this.childDrawerRef = this.drawerService.create<
      ShotAssetStatusFormComponent,
      { statusOut: any; mode: string },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: ShotAssetStatusFormComponent,
      nzContentParams: {
        statusOut: statusOut,
        mode: mode,
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

    this.childDrawerRef.afterOpen.subscribe(() => {
      console.log("Status Form Open");
    });

    this.childDrawerRef.afterClose.subscribe((isSuccess) => {
      console.log("childDrawerRef afterClose DATA " + isSuccess);
      if (isSuccess) {
        this.setPage(this.currPageInfo);
      }
    });
  }

  onSort(event) {
    console.log("Sort Event", event);
    this.sortBy = event.sorts[0].prop;
    if (this.sortBy === "shotAssetStatusName") {
      this.sortBy = "statusName";
    }
    if (this.sortBy === "status") {
      this.sortBy = "isActive";
    }
    this.orderBy = event.sorts[0].dir.toUpperCase();
    this.currPageInfo.offset = 0;
    this.setPage(this.currPageInfo);
  }

  onSelect({ selected }) {
    console.log("Select Event", selected, this.selected);
  }

  getColWidth(colName: any) {
    if (colName === "isActive") {
      return 160;
    }
    return 200;
  }

  getActiveStatus(row: any, col: any) {
    return row && col && col.name && row[col.name] === 1
      ? "ACTIVE"
      : "INACTIVE";
  }

  enableEdit(row: any, col: any) {
    console.log(this.editing);
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
    /*if (row[col.name] != event.target.value) {
      let statusId = row.id;
      let statusIn = {
        type: col.name
      };
      statusIn[col.name] = event.target.value;
      await this.updateConfirm(row, col, statusId, statusIn);
    }
    if (this.isEditSuccess) {
      row[col.name] = event.target.value;
    }
    this.editing[row.id + '-' + col.name] = false;*/
  }

  async updateConfirm(row: any, col: any, statusId: any, statusIn: any) {
    /*this.isEditSuccess = false;
    await this.statusService.inlineEdit(statusId, statusIn).toPromise()
      .then((resp: any) => {
        console.log('update success ');
        this.isEditSuccess = true;
      })
      .catch((error: any) => {
        console.log('update failed ');
        this.isEditSuccess = false;
      });
    if (this.isEditSuccess) {
      this.showNotification({
        type: "success",
        title: "Success",
        content: 'Record updated successfully.',
        duration: AppConstants.NOTIFICATION_DURATION
      });
    } else {
      this.showNotification({
        type: "error",
        title: "Error",
        content: 'Record update failed.',
        duration: AppConstants.NOTIFICATION_DURATION
      });
    }*/
  }

  showNotification(info: any) {
    this.notificationService.showNotification(info);
  }

  deleteHandler(row: any) {
    this.isAlertVisible = true;
    this.statusToDelete = row;
  }

  deleteStatusConfirm = async () => {
    console.log("Delete Status " + this.statusToDelete.id);
    let successMessage = "Status has been successfully deleted.";
    let errorMessage = "Status deletion failed.";
    this.isAlertVisible = false;
    await this.statusService
      .deleteStatus(this.statusToDelete.id)
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

  deleteStatusCancel = () => {
    this.isAlertVisible = false;
    console.log("deleteStatusCancel ");
  };

  closeForm(): void {
    this.childDrawerRef.close();
  }

  onToggleIconClick(row: any): void {
    if (this.isEditable(row)) {
      this.isToggleAlertVisible = true;
      this.statusToToggle = row;
    }
  }

  toggleStatusConfirm = async () => {
    let actionSuccess =
      this.statusToToggle.isActive === 1 ? "deactivated" : "activated";
    let actionFail =
      this.statusToToggle.isActive === 1 ? "deactivation" : "activation";
    let successMessage = `Status has been successfully ${actionSuccess}.`;
    let errorMessage = `Status ${actionFail} failed.`;
    this.isToggleAlertVisible = false;
    await this.statusService
      .toggleActivate(this.statusToToggle.id)
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

  toggleStatusCancel = () => {
    console.log("toggleStatusCancel ");
    this.isToggleAlertVisible = false;
  };

  getToggleTitle() {
    let action =
      this.statusToToggle && this.statusToToggle.isActive === 1
        ? "deactivate"
        : "activate";
    return `Are you sure to ${action} this status?`;
  }
}
