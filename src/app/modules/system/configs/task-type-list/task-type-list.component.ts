import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  OnDestroy,
} from "@angular/core";
import { Page } from "src/app/modules/shared/model/page";
import { TasktypesService } from "../tasktypes.service";
import { NzDrawerService, NzModalService } from "ng-zorro-antd";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { TasktypeFormComponent } from "../../modals/tasktype-form/tasktype-form.component";
import { InteractionService } from "src/app/modules/core/services/interaction.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-task-type-list",
  templateUrl: "./task-type-list.component.html",
  styleUrls: ["./task-type-list.component.scss"],
})
export class TaskTypeListComponent implements OnInit, OnDestroy {
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
  tasktypeToDelete: any;
  tasktypeOut: any;
  tasktypeToToggle: any;
  isToggleAlertVisible: boolean;
  isSearching: boolean;
  searchPattern = "";
  sortBy: any = "";
  orderBy: any = "";
  subscription: Subscription;
  drawerTitle: any;
  isReadOnly: boolean;

  constructor(
    private tasktypeService: TasktypesService,
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
    //this.interactionService.sendInteraction("breadcrumb", "task type listing");
    this.interactionService.sendInteraction("breadcrumb", "hide_breadcrumb");
    /*this.helperService.isGlobalAddEnabled = false;
    this.subscription = this.interactionService
      .getInteraction()
      .subscribe(interaction => {
        if (interaction.type === "global-add") {
          this.createTasktype();
        }
      });*/
    this.getTableColumns();
    this.isReadOnly = this.helperService.isReadOnly(
      AppConstants.PERMISSIONS.TASK_TYPE
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
        name: "taskTypeName",
        displayName: "Task Type Name",
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
        name: "colorCode",
        displayName: "Color Code",
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
    this.tasktypeService.getTasktypeTableList(this.page).subscribe(
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

  createTasktype() {
    this.drawerTitle = "Add Task Type";
    this.openTasktypeForm("create", null);
  }

  async editHandler(row: any) {
    this.drawerTitle = "Edit Task Type";
    await this.getTasktype(row.id);
    if (this.tasktypeOut) {
      console.log(this.tasktypeOut);
      this.openTasktypeForm("update", this.tasktypeOut);
    }
  }

  async getTasktype(id: any) {
    await this.tasktypeService
      .getTasktype(id)
      .toPromise()
      .then((resp) => {
        this.tasktypeOut = resp.entity;
      })
      .catch((error) => {
        console.log(error);
        this.tasktypeOut = null;
      });
  }

  openTasktypeForm(mode: any, tasktypeOut: any): void {
    this.childDrawerRef = this.drawerService.create<
      TasktypeFormComponent,
      { tasktypeOut: any; mode: string },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: TasktypeFormComponent,
      nzContentParams: {
        tasktypeOut: tasktypeOut,
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
      console.log("Tasktype Form Open");
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
    if (row[col.name] != event.target.value) {
      let tasktypeId = row.id;
      let tasktypeIn = {
        type: col.name,
      };
      tasktypeIn[col.name] = event.target.value;
      await this.updateConfirm(row, col, tasktypeId, tasktypeIn);
    }
    if (this.isEditSuccess) {
      row[col.name] = event.target.value;
    }
    this.editing[row.id + "-" + col.name] = false;
  }

  async updateConfirm(row: any, col: any, tasktypeId: any, tasktypeIn: any) {
    this.isEditSuccess = false;
    let errorMessage = "Record update failed.";
    await this.tasktypeService
      .inlineEdit(tasktypeId, tasktypeIn)
      .toPromise()
      .then((resp: any) => {
        console.log("update success ");
        this.isEditSuccess = true;
      })
      .catch((error: any) => {
        console.log("update failed ");
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
    this.tasktypeToDelete = row;
  }

  deleteTasktypeConfirm = async () => {
    console.log("Delete Tasktype " + this.tasktypeToDelete.id);
    let successMessage = "Task type has been successfully deleted.";
    let errorMessage = "Task type deletion failed.";
    this.isAlertVisible = false;
    await this.tasktypeService
      .deleteTasktype(this.tasktypeToDelete.id)
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

  deleteTasktypeCancel = () => {
    this.isAlertVisible = false;
    console.log("deleteTasktypeCancel ");
  };

  closeForm(): void {
    this.childDrawerRef.close();
  }

  onToggleIconClick(row: any): void {
    if (this.isEditable(row)) {
      this.isToggleAlertVisible = true;
      this.tasktypeToToggle = row;
    }
  }

  toggleTasktypeConfirm = async () => {
    let actionSuccess =
      this.tasktypeToToggle.isActive === 1 ? "deactivated" : "activated";
    let actionFail =
      this.tasktypeToToggle.isActive === 1 ? "deactivation" : "activation";
    let successMessage = `Task type has been successfully ${actionSuccess}.`;
    let errorMessage = `Task type ${actionFail} failed.`;
    this.isToggleAlertVisible = false;
    await this.tasktypeService
      .toggleActivate(this.tasktypeToToggle.id)
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

  toggleTasktypeCancel = () => {
    console.log("toggleTasktypeCancel ");
    this.isToggleAlertVisible = false;
  };

  getToggleTitle() {
    let action =
      this.tasktypeToToggle && this.tasktypeToToggle.isActive === 1
        ? "deactivate"
        : "activate";
    return `Are you sure to ${action} this task type?`;
  }
}
