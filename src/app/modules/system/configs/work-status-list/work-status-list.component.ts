import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  OnDestroy,
} from "@angular/core";
import { Page } from "src/app/modules/shared/model/page";
import { WorkstatusService } from "../workstatus.service";
import { NzDrawerService, NzModalService } from "ng-zorro-antd";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { WorkstatusFormComponent } from "../../modals/workstatus-form/workstatus-form.component";
import { InteractionService } from "src/app/modules/core/services/interaction.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-work-status-list",
  templateUrl: "./work-status-list.component.html",
  styleUrls: ["./work-status-list.component.scss"],
})
export class WorkStatusListComponent implements OnInit, OnDestroy {
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
  workstatusToDelete: any;
  workstatusOut: any;
  workstatusToToggle: any;
  isToggleAlertVisible: boolean;
  isSearching: boolean;
  searchPattern = "";
  sortBy: any = "";
  orderBy: any = "";
  subscription: Subscription;
  drawerTitle: any;
  isReadOnly: boolean;

  constructor(
    private workstatusService: WorkstatusService,
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
    /*this.interactionService.sendInteraction(
      "breadcrumb",
      "work status listing"
    );
    this.helperService.isGlobalAddEnabled = false;
    this.subscription = this.interactionService
      .getInteraction()
      .subscribe(interaction => {
        if (interaction.type === "global-add") {
          this.createWorkStatus();
        }
      });*/
    this.getTableColumns();
    this.isReadOnly = this.helperService.isReadOnly(
      AppConstants.PERMISSIONS.WORK_STATUS
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
        displayName: "Work Status Name",
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
    this.workstatusService.getWorkstatusTableList(this.page).subscribe(
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

  createWorkStatus() {
    this.drawerTitle = "Add Work Status";
    this.openWorkstatusForm("create", null);
  }

  async editHandler(row: any) {
    await this.getWorkstatus(row.id);
    if (this.workstatusOut) {
      console.log(this.workstatusOut);
      this.drawerTitle = "Edit Work Status";
      this.openWorkstatusForm("update", this.workstatusOut);
    }
  }

  async getWorkstatus(id: any) {
    await this.workstatusService
      .getWorkstatus(id)
      .toPromise()
      .then((resp) => {
        this.workstatusOut = resp.entity;
      })
      .catch((error) => {
        console.log(error);
        this.workstatusOut = null;
      });
  }

  openWorkstatusForm(mode: any, workstatusOut: any): void {
    this.childDrawerRef = this.drawerService.create<
      WorkstatusFormComponent,
      { workstatusOut: any; mode: string },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: WorkstatusFormComponent,
      nzContentParams: {
        workstatusOut: workstatusOut,
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
      console.log("Workstatus Form Open");
    });

    this.childDrawerRef.afterClose.subscribe((isSuccess) => {
      console.log("childDrawerRef afterClose DATA " + isSuccess);
      if (isSuccess) {
        this.setPage(this.currPageInfo);
      }
    });
  }

  onSort(event) {
    this.sortBy = event.sorts[0].prop;
    if (this.sortBy === "workStatusName") {
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
      let workstatusId = row.id;
      let workstatusIn = {
        type: col.name
      };
      workstatusIn[col.name] = event.target.value;
      await this.updateConfirm(row, col, workstatusId, workstatusIn);
    }
    if (this.isEditSuccess) {
      row[col.name] = event.target.value;
    }
    this.editing[row.id + '-' + col.name] = false;*/
  }

  async updateConfirm(
    row: any,
    col: any,
    workstatusId: any,
    workstatusIn: any
  ) {
    /*this.isEditSuccess = false;
    await this.workstatusService.inlineEdit(workstatusId, workstatusIn).toPromise()
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
    this.workstatusToDelete = row;
  }

  deleteWorkstatusConfirm = async () => {
    console.log("Delete Workstatus " + this.workstatusToDelete.id);
    let successMessage = "Work status has been successfully deleted.";
    let errorMessage = "Work status deletion failed.";
    this.isAlertVisible = false;
    await this.workstatusService
      .deleteWorkstatus(this.workstatusToDelete.id)
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

  deleteWorkstatusCancel = () => {
    this.isAlertVisible = false;
    console.log("deleteWorkstatusCancel ");
  };

  closeForm(): void {
    this.childDrawerRef.close();
  }

  onToggleIconClick(row: any): void {
    if (this.isEditable(row)) {
      this.isToggleAlertVisible = true;
      this.workstatusToToggle = row;
    }
  }

  toggleWorkstatusConfirm = async () => {
    let actionSuccess =
      this.workstatusToToggle.isActive === 1 ? "deactivated" : "activated";
    let actionFail =
      this.workstatusToToggle.isActive === 1 ? "deactivation" : "activation";
    let successMessage = `Work status has been successfully ${actionSuccess}.`;
    let errorMessage = `Work status ${actionFail} failed.`;
    this.isToggleAlertVisible = false;
    await this.workstatusService
      .toggleActivate(this.workstatusToToggle.id)
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

  toggleWorkstatusCancel = () => {
    console.log("toggleWorkstatusCancel ");
    this.isToggleAlertVisible = false;
  };

  getToggleTitle() {
    let action =
      this.workstatusToToggle && this.workstatusToToggle.isActive === 1
        ? "deactivate"
        : "activate";
    return `Are you sure to ${action} this work status?`;
  }
}
