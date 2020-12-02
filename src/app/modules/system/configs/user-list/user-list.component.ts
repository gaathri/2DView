import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  OnDestroy,
} from "@angular/core";
import { Page } from "src/app/modules/shared/model/page";
import { UsersService } from "../users.service";
import { NzDrawerService, NzModalService } from "ng-zorro-antd";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { UserFormComponent } from "../../modals/user-form/user-form.component";
import { InteractionService } from "src/app/modules/core/services/interaction.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-user-list",
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.scss"],
})
export class UserListComponent implements OnInit, OnDestroy {
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
  userToDelete: any;
  userOut: any;
  userToToggle: any;
  isToggleAlertVisible: boolean;

  isSearching: boolean;
  searchPattern = "";
  sortBy: any = "";
  orderBy: any = "";
  subscription: Subscription;
  drawerTitle: any;
  isReadOnly: boolean;

  constructor(
    private usersService: UsersService,
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
    //this.interactionService.sendInteraction("breadcrumb", "user listing");
    this.interactionService.sendInteraction("breadcrumb", "hide_breadcrumb");
    /*this.helperService.isGlobalAddEnabled = false;
    this.subscription = this.interactionService
      .getInteraction()
      .subscribe(interaction => {
        if (interaction.type === "global-add") {
          this.createUser();
        }
      });*/
    this.getTableColumns();
    this.isReadOnly = this.helperService.isReadOnly(
      AppConstants.PERMISSIONS.USER
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
        name: "firstName",
        displayName: "First Name",
        defaultDisplay: true,
        sortable: true,
        isEditable: false,
      },
      {
        name: "lastName",
        displayName: "Last Name",
        defaultDisplay: true,
        sortable: true,
        isEditable: false,
      },
      {
        name: "loginId",
        displayName: "Login Id",
        defaultDisplay: true,
        sortable: true,
        isEditable: false,
      },
      {
        name: "roleName",
        displayName: "Role",
        defaultDisplay: true,
        sortable: true,
        isEditable: false,
      },

      /*{
        name: "designation",
        displayName: "Designation",
        defaultDisplay: true,
        sortable: true,
        isEditable: false
      }, {
        name: "departmentName",
        displayName: "Department",
        defaultDisplay: true,
        sortable: true,
        isEditable: false
      }
      {
        name: "password",
        displayName: "Password",
        defaultDisplay: true,
        sortable: true,
        isEditable: false
      }, */
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
    this.usersService.getUserTableList(this.page).subscribe(
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
              console.log("showDummy >>>>>>>> " + this.showDummy);
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

  createUser() {
    this.drawerTitle = "Add User";
    this.openUserForm("create", null);
  }

  async editHandler(row: any) {
    await this.getUser(row.id);
    if (this.userOut) {
      console.log(this.userOut);
      this.drawerTitle = "Edit User";
      this.openUserForm("update", this.userOut);
    }
  }

  async getUser(id: any) {
    await this.usersService
      .getUser(id)
      .toPromise()
      .then((resp) => {
        this.userOut = resp.entity;
      })
      .catch((error) => {
        console.log(error);
        this.userOut = null;
      });
  }

  openUserForm(mode: any, userOut: any): void {
    this.childDrawerRef = this.drawerService.create<
      UserFormComponent,
      { userOut: any; mode: string },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: UserFormComponent,
      nzContentParams: {
        userOut: userOut,
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
      console.log("User Form Open");
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
    if (this.sortBy === "role") {
      this.sortBy = "roleName";
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
    } else if (colName === "thumbnail") {
      return 150;
    } else if (colName === "firstName") {
      return 100;
    } else if (colName === "lastName") {
      return 100;
    } else {
      return 200;
    }
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

  async updateValue(row: any, col: any, event: any) {}

  async updateConfirm(row: any, col: any, userId: any, userIn: any) {}

  showNotification(info: any) {
    this.notificationService.showNotification(info);
  }

  deleteHandler(row: any) {
    this.isAlertVisible = true;
    this.userToDelete = row;
  }

  deleteUserConfirm = async () => {
    console.log("Delete User " + this.userToDelete.id);
    let successMessage = "User has been successfully deleted.";
    let errorMessage = "User deletion failed.";
    this.isAlertVisible = false;
    await this.usersService
      .deleteUser(this.userToDelete.id)
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

  deleteUserCancel = () => {
    this.isAlertVisible = false;
    console.log("deleteUserCancel ");
  };

  closeForm(): void {
    this.childDrawerRef.close();
  }

  onToggleIconClick(row: any): void {
    if (this.isEditable(row)) {
      this.isToggleAlertVisible = true;
      this.userToToggle = row;
    }
  }

  toggleUserConfirm = async () => {
    let actionSuccess =
      this.userToToggle.isActive === 1 ? "deactivated" : "activated";
    let actionFail =
      this.userToToggle.isActive === 1 ? "deactivation" : "activation";
    let successMessage = `User has been successfully ${actionSuccess}.`;
    let errorMessage = `User ${actionFail} failed.`;
    this.isToggleAlertVisible = false;
    await this.usersService
      .toggleActivate(this.userToToggle.id)
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

  toggleUserCancel = () => {
    console.log("toggleUserCancel ");
    this.isToggleAlertVisible = false;
  };

  getToggleTitle() {
    let action =
      this.userToToggle && this.userToToggle.isActive === 1
        ? "deactivate"
        : "activate";
    return `Are you sure to ${action} this user?`;
  }

  getUserName(user: any) {
    let userName = "";
    if (user.firstName) {
      userName += user.firstName + " ";
    }
    if (user.lastName) {
      userName += user.lastName;
    }
    return userName;
  }
  filterHandler() {
    /*this.usersService.downloadPDF().subscribe(
      (res: any) => {
        const blob = new Blob([res], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.setAttribute("style", "display:none;");
        document.body.appendChild(a);
        a.href = url;
        a.download = "file.pdf";
        a.click();
      },
      (error) => {
        console.log(error);
      }
    );

    this.usersService.downloadXLS()
      .subscribe(
        (res: any) => {          
          const blob = new Blob([res], { type: 'application/vnd.ms.excel' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.setAttribute('style', 'display:none;');
          document.body.appendChild(a);
          a.href = url;
          a.download = 'file.xlsx';
          a.click();
        },
        error => {
          console.log(error);
        }
      );*/
  }

  getAvatarInfo(row: any) {
    let thumbnail = "";
    if (row.thumbnail) {
      thumbnail = row.thumbnail;
    }
    return {
      firstName: row.firstName,
      lastName: row.lastName,
      thumbnail: row.thumbnail,
      size: "large",
    };
  }
}
