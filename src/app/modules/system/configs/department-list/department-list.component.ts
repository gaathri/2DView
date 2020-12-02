import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  OnDestroy,
} from "@angular/core";
import { Page } from "src/app/modules/shared/model/page";
import { DepartmentsService } from "../departments.service";
import { NzDrawerService, NzModalService, NzDrawerRef } from "ng-zorro-antd";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { DepartmentFormComponent } from "../../modals/department-form/department-form.component";
import { InteractionService } from "src/app/modules/core/services/interaction.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-department-list",
  templateUrl: "./department-list.component.html",
  styleUrls: ["./department-list.component.scss"],
})
export class DepartmentListComponent implements OnInit, OnDestroy {
  @ViewChild("myTable", { static: false }) table: any;
  @ViewChild("drawerHeader", { static: false }) drawerHeader: TemplateRef<{}>;
  @ViewChild("drawerTemplate", { static: false }) drawerTemplate: TemplateRef<{
    $implicit: { items: any };
    drawerRef: NzDrawerRef<string>;
  }>;

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
  departmentToDelete: any;
  departmentOut: any;
  departmentToToggle: any;
  isToggleAlertVisible: boolean;

  isSearching: boolean;
  searchPattern = "";
  sortBy: any = "";
  orderBy: any = "";
  subscription: Subscription;
  drawerTitle: any;
  isReadOnly: boolean;

  constructor(
    private departmentService: DepartmentsService,
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
    //this.interactionService.sendInteraction("breadcrumb", "department listing");
    this.interactionService.sendInteraction("breadcrumb", "hide_breadcrumb");
    /*this.helperService.isGlobalAddEnabled = false;
    this.subscription = this.interactionService
      .getInteraction()
      .subscribe(interaction => {
        if (interaction.type === "global-add") {
          this.createDepartment();
        }
      });*/
    this.getTableColumns();
    this.isReadOnly = this.helperService.isReadOnly(
      AppConstants.PERMISSIONS.DEPARTMENT
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
        name: "departmentName",
        displayName: "Department Name",
        defaultDisplay: true,
        sortable: true,
        isEditable: false,
      },
      {
        name: "departmentDesc",
        displayName: "Description",
        defaultDisplay: true,
        sortable: false,
        isEditable: false,
      },
      {
        name: "taskCount",
        displayName: "Task Count",
        defaultDisplay: true,
        sortable: false,
        isEditable: false,
      },
      {
        name: "artistCount",
        displayName: "Artist Count",
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
    this.departmentService.getDepartmentTableList(this.page).subscribe(
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

  getTaskCount(row: any, col: any) {
    return row[col.name];
  }

  getArtistCount(row: any, col: any) {
    return row[col.name];
  }

  viewHandler(row: any, col: any) {
    let items = null;
    if (col.name == "taskCount") {
      this.drawerTitle = "Task Types";
      items = row.tasks;
    } else if (col.name == "artistCount") {
      this.drawerTitle = "Artists";
      items = row.artists;
    }
    const drawerRef = this.drawerService.create({
      nzTitle: this.drawerHeader,
      nzContent: this.drawerTemplate,
      nzClosable: false,
      nzWidth: "30%",
      nzWrapClassName: "modal-wrapper",
      nzContentParams: {
        items: items,
      },
    });

    drawerRef.afterOpen.subscribe(() => {});

    drawerRef.afterClose.subscribe(() => {});
  }

  createDepartment() {
    this.drawerTitle = "Add Department";
    this.openDepartmentForm("create", null);
  }

  async editHandler(row: any) {
    await this.getDepartment(row.id);
    if (this.departmentOut) {
      this.drawerTitle = "Edit Department";
      this.openDepartmentForm("update", this.departmentOut);
    }
  }

  async getDepartment(id: any) {
    await this.departmentService
      .getDepartment(id)
      .toPromise()
      .then((resp) => {
        this.departmentOut = resp.entity;
      })
      .catch((error) => {
        this.departmentOut = null;
      });
  }

  openDepartmentForm(mode: any, departmentOut: any): void {
    this.childDrawerRef = this.drawerService.create<
      DepartmentFormComponent,
      { departmentOut: any; mode: string },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: DepartmentFormComponent,
      nzContentParams: {
        departmentOut: departmentOut,
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
    this.orderBy = event.sorts[0].dir.toUpperCase();
    this.currPageInfo.offset = 0;
    this.setPage(this.currPageInfo);
  }

  onSelect({ selected }) {}

  getColWidth(colName: any) {
    if (colName === "isActive") {
      return 150;
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

  async updateValue(row: any, col: any, event: any) {
    if (row[col.name] != event.target.value) {
      let departmentId = row.id;
      let departmentIn = {
        type: col.name,
      };
      departmentIn[col.name] = event.target.value;
      await this.updateConfirm(row, col, departmentId, departmentIn);
    }
    if (this.isEditSuccess) {
      row[col.name] = event.target.value;
    }
    this.editing[row.id + "-" + col.name] = false;
  }

  async updateConfirm(
    row: any,
    col: any,
    departmentId: any,
    departmentIn: any
  ) {
    this.isEditSuccess = false;
    let errorMessage = "Record update failed.";
    await this.departmentService
      .inlineEdit(departmentId, departmentIn)
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
    this.departmentToDelete = row;
  }

  deleteDepartmentConfirm = async () => {
    let successMessage = "Department has been successfully deleted.";
    let errorMessage = "Department deletion failed.";
    this.isAlertVisible = false;
    await this.departmentService
      .deleteDepartment(this.departmentToDelete.id)
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

  deleteDepartmentCancel = () => {
    this.isAlertVisible = false;
  };

  closeForm(): void {
    this.childDrawerRef.close();
  }

  onToggleIconClick(row: any): void {
    if (this.isEditable(row)) {
      this.isToggleAlertVisible = true;
      this.departmentToToggle = row;
    }
  }

  toggleDepartmentConfirm = async () => {
    let actionSuccess =
      this.departmentToToggle.isActive === 1 ? "deactivated" : "activated";
    let actionFail =
      this.departmentToToggle.isActive === 1 ? "deactivation" : "activation";
    let successMessage = `Department has been successfully ${actionSuccess}.`;
    let errorMessage = `Department ${actionFail} failed.`;
    this.isToggleAlertVisible = false;
    await this.departmentService
      .toggleActivate(this.departmentToToggle.id)
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

  toggleDepartmentCancel = () => {
    this.isToggleAlertVisible = false;
  };

  getToggleTitle() {
    let action =
      this.departmentToToggle && this.departmentToToggle.isActive === 1
        ? "deactivate"
        : "activate";
    return `Are you sure to ${action} this department?`;
  }
}
