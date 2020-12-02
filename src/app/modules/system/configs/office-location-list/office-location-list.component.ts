import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { Page } from "src/app/modules/shared/model/page";
import { OfficeLocationService } from "../office-location.service";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { NzDrawerService, NzModalService } from "ng-zorro-antd";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { OfficeLocationFormComponent } from "../../modals/office-location-form/office-location-form.component";

@Component({
  selector: "app-office-location-list",
  templateUrl: "./office-location-list.component.html",
  styleUrls: ["./office-location-list.component.scss"],
})
export class OfficeLocationListComponent implements OnInit {
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
  officeLocationToDelete: any;
  officeLocationOut: any;
  officeLocationToToggle: any;
  isToggleAlertVisible: boolean;
  isSearching: boolean;
  searchPattern = "";
  sortBy: any = "";
  orderBy: any = "";
  drawerTitle: any;
  isReadOnly: boolean;

  constructor(
    private officeLocationService: OfficeLocationService,
    private notificationService: NotificationService,
    private drawerService: NzDrawerService,
    private modalService: NzModalService,
    private helperService: HelperService
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.pageSizeOptions = AppConstants.TABLE_PAGE_SIZE_OPTIONS;
    this.selectedPageSize = this.page.size;
  }

  ngOnInit() {
    this.getTableColumns();
    this.isReadOnly = this.helperService.isReadOnly(
      AppConstants.PERMISSIONS.OFFICE_LOCATION
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
        displayName: "Location",
        defaultDisplay: true,
        sortable: true,
        isEditable: false,
      },
      {
        name: "description",
        displayName: "Description",
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
    this.officeLocationService.getOfficeLocationTableList(this.page).subscribe(
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

  createOfficeLocation() {
    this.drawerTitle = "Add Office Location";
    this.openOfficeLocationForm("create", null);
  }

  async editHandler(row: any) {
    await this.getOfficeLocation(row.id);
    if (this.officeLocationOut) {
      this.drawerTitle = "Edit Office Location";
      this.openOfficeLocationForm("update", this.officeLocationOut);
    }
  }

  async getOfficeLocation(id: any) {
    await this.officeLocationService
      .getOfficeLocation(id)
      .toPromise()
      .then((resp) => {
        this.officeLocationOut = resp.entity;
      })
      .catch((error) => {
        this.officeLocationOut = null;
      });
  }

  openOfficeLocationForm(mode: any, officeLocationOut: any): void {
    this.childDrawerRef = this.drawerService.create<
      OfficeLocationFormComponent,
      { officeLocationOut: any; mode: string },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: OfficeLocationFormComponent,
      nzContentParams: {
        officeLocationOut: officeLocationOut,
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

    this.childDrawerRef.afterOpen.subscribe(() => {});

    this.childDrawerRef.afterClose.subscribe((isSuccess) => {
      if (isSuccess) {
        this.setPage(this.currPageInfo);
      }
    });
  }

  onSort(event) {
    this.sortBy = event.sorts[0].prop;
    if (this.sortBy === "status") {
      this.sortBy = "isActive";
    }

    if (this.sortBy === "location") {
      this.sortBy = "name";
    }

    this.orderBy = event.sorts[0].dir.toUpperCase();
    this.currPageInfo.offset = 0;
    this.setPage(this.currPageInfo);
  }

  onSelect({ selected }) {}

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

  async updateValue(row: any, col: any, event: any) {}

  async updateConfirm(
    row: any,
    col: any,
    officeLocationId: any,
    officeLocationIn: any
  ) {}

  showNotification(info: any) {
    this.notificationService.showNotification(info);
  }

  deleteHandler(row: any) {
    this.isAlertVisible = true;
    this.officeLocationToDelete = row;
  }

  deleteOfficeLocationConfirm = async () => {
    let successMessage = "Office location has been successfully deleted.";
    let errorMessage = "Office location deletion failed.";
    this.isAlertVisible = false;
    await this.officeLocationService
      .deleteOfficeLocation(this.officeLocationToDelete.id)
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

  deleteOfficeLocationCancel = () => {
    this.isAlertVisible = false;
  };

  closeForm(): void {
    this.childDrawerRef.close();
  }

  onToggleIconClick(row: any): void {
    if (this.isEditable(row)) {
      this.isToggleAlertVisible = true;
      this.officeLocationToToggle = row;
    }
  }

  toggleOfficeLocationConfirm = async () => {
    let actionSuccess =
      this.officeLocationToToggle.isActive === 1 ? "deactivated" : "activated";
    let actionFail =
      this.officeLocationToToggle.isActive === 1
        ? "deactivation"
        : "activation";
    let successMessage = `Office location has been successfully ${actionSuccess}.`;
    let errorMessage = `Office location ${actionFail} failed.`;
    this.isToggleAlertVisible = false;
    await this.officeLocationService
      .toggleActivate(this.officeLocationToToggle.id)
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

  toggleOfficeLocationCancel = () => {
    this.isToggleAlertVisible = false;
  };

  getToggleTitle() {
    let action =
      this.officeLocationToToggle && this.officeLocationToToggle.isActive === 1
        ? "deactivate"
        : "activate";
    return `Are you sure to ${action} this office location?`;
  }
}
