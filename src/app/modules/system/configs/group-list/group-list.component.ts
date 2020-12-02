import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  OnDestroy,
} from "@angular/core";
import { Page } from "src/app/modules/shared/model/page";
import { GroupsService } from "../groups.service";
import { NzDrawerService, NzModalService } from "ng-zorro-antd";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { GroupFormComponent } from "../../modals/group-form/group-form.component";
import { InteractionService } from "src/app/modules/core/services/interaction.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-group-list",
  templateUrl: "./group-list.component.html",
  styleUrls: ["./group-list.component.scss"],
})
export class GroupListComponent implements OnInit, OnDestroy {
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
  groupToDelete: any;
  groupOut: any;
  groupToToggle: any;
  isToggleAlertVisible: boolean;

  isSearching: boolean;
  searchPattern = "";
  sortBy: any = "";
  orderBy: any = "";
  subscription: Subscription;
  drawerTitle: any;
  isReadOnly: boolean;

  constructor(
    private groupService: GroupsService,
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
    //this.interactionService.sendInteraction("breadcrumb", "group listing");
    this.interactionService.sendInteraction("breadcrumb", "hide_breadcrumb");
    /*this.helperService.isGlobalAddEnabled = false;
    this.subscription = this.interactionService
      .getInteraction()
      .subscribe(interaction => {
        if (interaction.type === "global-add") {
          this.createGroup();
        }
      });*/
    this.getTableColumns();
    this.isReadOnly = this.helperService.isReadOnly(
      AppConstants.PERMISSIONS.GROUP
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
        name: "thumbnail",
        displayName: "Thumbnail",
        defaultDisplay: true,
        sortable: false,
        isEditable: false,
      },
      {
        name: "groupName",
        displayName: "Group Name",
        defaultDisplay: true,
        sortable: true,
        isEditable: false,
      },
      {
        name: "groupDesc",
        displayName: "Description",
        defaultDisplay: true,
        sortable: false,
        isEditable: false,
      },
      {
        name: "userVOs",
        displayName: "Members",
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
    this.groupService.getGroupTableList(this.page).subscribe(
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

  createGroup() {
    this.drawerTitle = "Add Group";
    this.openGroupForm("create", null);
  }

  async viewHandler(row: any) {
    await this.getGroup(row.id);
    if (this.groupOut) {
      this.drawerTitle = "Members";
      this.openGroupForm("view_users", this.groupOut);
    }
  }

  async editHandler(row: any) {
    await this.getGroup(row.id);
    if (this.groupOut) {
      this.drawerTitle = "Edit Group";
      this.openGroupForm("update", this.groupOut);
    }
  }

  async getGroup(id: any) {
    await this.groupService
      .getGroup(id)
      .toPromise()
      .then((resp) => {
        this.groupOut = resp.entity;
      })
      .catch((error) => {
        this.groupOut = null;
      });
  }

  openGroupForm(mode: any, groupOut: any): void {
    this.childDrawerRef = this.drawerService.create<
      GroupFormComponent,
      { groupOut: any; mode: string },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: GroupFormComponent,
      nzContentParams: {
        groupOut: groupOut,
        mode: mode,
      },
      nzClosable: false,
      nzWidth: "50%",
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
        //this.prepareData();
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
    /*if (colName === "isActive") {
      return 160;
    } else if (colName === "userVOs") {
      return 200;
    }*/
    return 150;
  }

  getActiveStatus(row: any, col: any) {
    return row && col && col.name && row[col.name] === 1
      ? "ACTIVE"
      : "INACTIVE";
  }

  getMembersCount(row: any, col: any) {
    let membersCount = 0;
    if (row && col && col.name && row[col.name]) {
      if (row.userIds) {
        membersCount = row.userIds.length;
      }
    }
    return membersCount;
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
      let groupId = row.id;
      let groupIn = {
        type: col.name,
      };
      groupIn[col.name] = event.target.value;
      await this.updateConfirm(row, col, groupId, groupIn);
    }
    if (this.isEditSuccess) {
      row[col.name] = event.target.value;
    }
    this.editing[row.id + "-" + col.name] = false;
  }

  async updateConfirm(row: any, col: any, groupId: any, groupIn: any) {
    this.isEditSuccess = false;
    let errorMessage = "Record update failed.";
    await this.groupService
      .inlineEdit(groupId, groupIn)
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
    this.groupToDelete = row;
  }

  deleteGroupConfirm = async () => {
    let successMessage = "Group has been successfully deleted.";
    let errorMessage = "Group deletion failed.";
    this.isAlertVisible = false;
    await this.groupService
      .deleteGroup(this.groupToDelete.id)
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

  deleteGroupCancel = () => {
    this.isAlertVisible = false;
  };

  closeForm(): void {
    this.childDrawerRef.close();
  }

  onToggleIconClick(row: any): void {
    if (this.isEditable(row)) {
      this.isToggleAlertVisible = true;
      this.groupToToggle = row;
    }
  }

  toggleGroupConfirm = async () => {
    let actionSuccess =
      this.groupToToggle.isActive === 1 ? "deactivated" : "activated";
    let actionFail =
      this.groupToToggle.isActive === 1 ? "deactivation" : "activation";
    let successMessage = `Group has been successfully ${actionSuccess}.`;
    let errorMessage = `Group ${actionFail} failed.`;
    this.isToggleAlertVisible = false;
    await this.groupService
      .toggleActivate(this.groupToToggle.id)
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

  toggleGroupCancel = () => {
    this.isToggleAlertVisible = false;
  };

  getToggleTitle() {
    let action =
      this.groupToToggle && this.groupToToggle.isActive === 1
        ? "deactivate"
        : "activate";
    return `Are you sure to ${action} this group?`;
  }
}
