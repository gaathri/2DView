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
import { HolidayFormComponent } from "src/app/modules/system/modals/holiday-form/holiday-form.component";

@Component({
  selector: "app-holiday-list",
  templateUrl: "./holiday-list.component.html",
  styleUrls: ["./holiday-list.component.scss"],
})
export class HolidayListComponent implements OnInit {
  @ViewChild("drawerHeader", { static: false }) drawerHeader: TemplateRef<{}>;
  @ViewChild("myTable", { static: false }) table: any;
  @Input() isReadOnly: boolean;
  @Input() leaveDate: any;
  @Input() viewDate: any;
  @Output("listChange") listChange: EventEmitter<any> = new EventEmitter<any>();

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
  holidayToDelete: any;
  holidayOut: any;
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
    this.leaveDate = new Date();
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
        name: "leaveDate",
        displayName: "Date",
        defaultDisplay: true,
        sortable: true,
        isEditable: false,
      },
      {
        name: "reason",
        displayName: "Holiday Reason",
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
    let year = this.viewDate.getFullYear();
    this.hrService.getHolidayTableList(this.page, year).subscribe(
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

  onDateSelect(date: any) {
    this.leaveDate = date;
    this.createHoliday();
  }

  createHoliday() {
    this.drawerTitle = "Add Holiday";
    let holidayInfo = {
      leaveDate: this.leaveDate,
    };
    this.openHolidayForm("create", holidayInfo);
  }

  async editHandler(row: any) {
    await this.getHoliday(row.id);
    if (this.holidayOut) {
      this.drawerTitle = "Edit Holiday";
      this.openHolidayForm("update", this.holidayOut);
    }
  }

  async getHoliday(id: any) {
    await this.hrService
      .getHoliday(id)
      .toPromise()
      .then((resp) => {
        this.holidayOut = resp.entity;
      })
      .catch((error) => {
        this.holidayOut = null;
      });
  }

  openHolidayForm(mode: any, holidayOut: any): void {
    this.childDrawerRef = this.drawerService.create<
      HolidayFormComponent,
      {
        holidayOut: any;
        mode: string;
      },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: HolidayFormComponent,
      nzContentParams: {
        holidayOut: holidayOut,
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
      this.sortBy = "leaveDate";
    } else if (this.sortBy === "holidayReason") {
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
    this.holidayToDelete = row;
  }

  deleteHolidayConfirm = async () => {
    let successMessage = "Holiday has been successfully deleted.";
    let errorMessage = "Holiday deletion failed.";
    this.isAlertVisible = false;
    await this.hrService
      .deleteHoliday(this.holidayToDelete.id)
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

  deleteHolidayCancel = () => {
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
