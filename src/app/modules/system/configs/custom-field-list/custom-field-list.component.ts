import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { Page } from "src/app/modules/shared/model/page";
import { CustomFieldService } from "../custom-field.service";
import { NzDrawerService, NzModalService } from "ng-zorro-antd";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { CustomFieldFormComponent } from "../../modals/custom-field-form/custom-field-form.component";
import { HelperService } from "src/app/modules/core/services/helper.service";

@Component({
  selector: "app-custom-field-list",
  templateUrl: "./custom-field-list.component.html",
  styleUrls: ["./custom-field-list.component.scss"],
})
export class CustomFieldListComponent implements OnInit {
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
  customFieldToDelete: any;
  customFieldOut: any;
  customFieldToToggle: any;
  isToggleAlertVisible: boolean;

  isSearching: boolean;
  searchPattern = "";
  sortBy: any = "";
  orderBy: any = "";
  drawerTitle: any;
  isReadOnly: boolean;

  constructor(
    private customFieldService: CustomFieldService,
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
      AppConstants.PERMISSIONS.CUSTOM_FIELDS
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
        displayName: "Name",
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
      {
        name: "format",
        displayName: "Format",
        defaultDisplay: true,
        sortable: true,
        isEditable: false,
      },
      {
        name: "isGolbal",
        displayName: "Global Field",
        defaultDisplay: true,
        sortable: true,
        isEditable: false,
      },
      {
        name: "isMandatory",
        displayName: "Mandatory",
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
    this.customFieldService.getCustomFieldTableList(this.page).subscribe(
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

  createCustomField() {
    this.drawerTitle = "Add Custom Field";
    this.openCustomFieldForm("create", null);
  }

  async editHandler(row: any) {
    await this.getCustomField(row.id);
    if (this.customFieldOut) {
      this.drawerTitle = "Edit Custom Field";
      this.openCustomFieldForm("update", this.customFieldOut);
    }
  }

  async getCustomField(id: any) {
    await this.customFieldService
      .getCustomField(id)
      .toPromise()
      .then((resp) => {
        this.customFieldOut = resp.entity;
      })
      .catch((error) => {
        this.customFieldOut = null;
      });
  }

  openCustomFieldForm(mode: any, customFieldOut: any): void {
    this.childDrawerRef = this.drawerService.create<
      CustomFieldFormComponent,
      { customFieldOut: any; mode: string },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: CustomFieldFormComponent,
      nzContentParams: {
        customFieldOut: customFieldOut,
        mode: mode,
      },
      nzClosable: false,
      nzWidth: "40%",
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
    if (this.sortBy === "globalField") {
      this.sortBy = "isGolbal";
    }
    if (this.sortBy === "mandatory") {
      this.sortBy = "isMandatory";
    }

    this.orderBy = event.sorts[0].dir.toUpperCase();
    this.currPageInfo.offset = 0;
    this.setPage(this.currPageInfo);
  }

  onSelect({ selected }) {}

  getColWidth(colName: any) {
    if (colName === "isActive") {
      return 100;
    }
    return 150;
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

  showNotification(info: any) {
    this.notificationService.showNotification(info);
  }

  deleteHandler(row: any) {
    this.isAlertVisible = true;
    this.customFieldToDelete = row;
  }

  deleteCustomFieldConfirm = async () => {
    let successMessage = "Custom Field has been successfully deleted.";
    let errorMessage = "Custom Field deletion failed.";
    this.isAlertVisible = false;
    await this.customFieldService
      .deleteCustomField(this.customFieldToDelete.id)
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

  deleteCustomFieldCancel = () => {
    this.isAlertVisible = false;
  };

  closeForm(): void {
    this.childDrawerRef.close();
  }

  onToggleIconClick(row: any): void {
    if (this.isEditable(row)) {
      this.isToggleAlertVisible = true;
      this.customFieldToToggle = row;
    }
  }

  toggleCustomFieldConfirm = async () => {
    let actionSuccess =
      this.customFieldToToggle.isActive === 1 ? "deactivated" : "activated";
    let actionFail =
      this.customFieldToToggle.isActive === 1 ? "deactivation" : "activation";
    let successMessage = `Custom Field has been successfully ${actionSuccess}.`;
    let errorMessage = `Custom Field ${actionFail} failed.`;
    this.isToggleAlertVisible = false;
    await this.customFieldService
      .toggleActivate(this.customFieldToToggle.id)
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

  toggleCustomFieldCancel = () => {
    this.isToggleAlertVisible = false;
  };

  getToggleTitle() {
    let action =
      this.customFieldToToggle && this.customFieldToToggle.isActive === 1
        ? "deactivate"
        : "activate";
    return `Are you sure to ${action} this custom field?`;
  }

  getFlagValue(value: any) {
    if (value === 1) {
      return "Yes";
    } else if (value === 0) {
      return "No";
    }
    return "-";
  }
}
