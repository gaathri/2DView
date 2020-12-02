import {
  Component,
  OnInit,
  Input,
  ViewChild,
  TemplateRef,
  Output,
  EventEmitter,
} from "@angular/core";
import { Page } from "src/app/modules/shared/model/page";
import { NzDrawerService, NzModalService } from "ng-zorro-antd";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { HrService } from "src/app/modules/system/dashboards/hr.service";
import { LeaveFormComponent } from "src/app/modules/system/modals/leave-form/leave-form.component";

@Component({
  selector: "app-user-leave-list",
  templateUrl: "./user-leave-list.component.html",
  styleUrls: ["./user-leave-list.component.scss"],
})
export class UserLeaveListComponent implements OnInit {
  @ViewChild("drawerHeader", { static: false }) drawerHeader: TemplateRef<{}>;
  @ViewChild("myTable", { static: false }) table: any;

  @Input() viewDate: any;
  @Input() user: any;

  @Output("listChange") listChange: EventEmitter<any> = new EventEmitter<any>();

  isReadOnly: boolean;
  showDummy: boolean;
  childDrawerRef: any;
  isEmptyData: boolean;
  isDataReady: boolean;
  isLoading: boolean = true;
  rows: any;
  page = new Page();
  selectedPageSize: any;
  pageSizeOptions: any;
  editing = {};
  tableColumns: any;
  selectedTableColumns: any;
  selected = [];
  isEditSuccess: boolean;
  isAlertVisible: boolean;
  leaveToDelete: any;
  leaveOut: any;
  currPageInfo: any;

  isSearching: boolean;
  searchPattern = "";
  sortBy: any = "";
  orderBy: any = "";
  drawerTitle: any;
  tableHeight: any = "calc(100vh - 200px)";

  constructor(
    private notificationService: NotificationService,
    private drawerService: NzDrawerService,
    private modalService: NzModalService,
    private helperService: HelperService,
    private hrService: HrService
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.pageSizeOptions = AppConstants.TABLE_PAGE_SIZE_OPTIONS;
    this.selectedPageSize = this.page.size;
  }

  ngOnInit() {
    this.isReadOnly = this.helperService.isReadOnly(
      AppConstants.PERMISSIONS.LEAVE_MANAGEMENT
    );
    this.getTableColumns();
  }

  updateTable(viewDate: any) {
    this.viewDate = viewDate;
    this.searchPattern = "";
    this.isSearching = false;
    this.currPageInfo.offset = 0;
    this.setPage(this.currPageInfo);
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
        name: "appliedDate",
        displayName: "Date",
        defaultDisplay: true,
        sortable: true,
        isEditable: false,
      },
      {
        name: "duration",
        displayName: "Leave Session",
        defaultDisplay: true,
        sortable: false,
        isEditable: false,
      },
      {
        name: "reason",
        displayName: "Leave Reason",
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
    let year = this.viewDate.getFullYear();
    let month = this.helperService._getMonth(this.viewDate);
    let userId = this.user.id;
    this.hrService
      .getLeaveTableListByUser(this.page, month, year, userId)
      .subscribe(
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

  onDataError(error: any) {
    this.isEmptyData = true;
  }

  createLeave() {
    this.drawerTitle = "Add Leave";
    let leaveOut = {
      userId: this.user.id,
      leaveData: null,
      reason: null,
      startDate: this.viewDate,
      endDate: null,
    };
    this.openLeaveForm("create", leaveOut);
  }

  async editHandler(row: any) {
    await this.getLeave(row.id);
    if (this.leaveOut) {
      this.drawerTitle = "Edit Leave";
      this.openLeaveForm("update", this.leaveOut);
    }
  }

  async getLeave(id: any) {
    await this.hrService
      .getLeave(id)
      .toPromise()
      .then((resp) => {
        this.leaveOut = resp.entity;
      })
      .catch((error) => {
        this.leaveOut = null;
      });
  }

  openLeaveForm(mode: any, leaveOut: any): void {
    this.childDrawerRef = this.drawerService.create<
      LeaveFormComponent,
      {
        leaveOut: any;
        mode: string;
        user: any;
        viewDate: any;
      },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: LeaveFormComponent,
      nzContentParams: {
        leaveOut: leaveOut,
        mode: mode,
        user: this.user,
        viewDate: this.viewDate,
      },
      nzClosable: false,
      nzWidth: "600px",
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
        let event = {
          date: this.viewDate,
        };
        this.listChange.emit(event);
      }
    });
  }

  closeForm(): void {
    this.childDrawerRef.close();
  }

  onSort(event: any) {
    this.sortBy = event.sorts[0].prop;
    if (this.sortBy === "date") {
      this.sortBy = "appliedDate";
    } else if (this.sortBy === "leaveReason") {
      this.sortBy = "reason";
    }

    this.orderBy = event.sorts[0].dir.toUpperCase();
    this.currPageInfo.offset = 0;
    this.setPage(this.currPageInfo);
  }

  onSelect({ selected }) {}

  getColWidth(colName: any) {
    return 150;
  }

  showNotification(info: any) {
    this.notificationService.showNotification(info);
  }

  deleteHandler(row: any) {
    this.isAlertVisible = true;
    this.leaveToDelete = row;
  }

  deleteLeaveConfirm = async () => {
    let successMessage = "Leave has been successfully deleted.";
    let errorMessage = "Leave deletion failed.";
    this.isAlertVisible = false;
    await this.hrService
      .deleteLeave(this.leaveToDelete.id)
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
        let event = {
          date: this.viewDate,
        };
        this.listChange.emit(event);
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

  deleteLeaveCancel = () => {
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
        this.tableHeight = "calc(100vh - 300px)";
      }
    }
  }

  getTableHeight() {
    return this.tableHeight;
  }

  getDisplayDate(date: any) {
    return this.helperService.transformDate(
      date,
      AppConstants.DISPLAY_DATE_FORMAT
    );
  }
}
