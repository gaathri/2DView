import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  OnDestroy,
  Output,
  EventEmitter,
} from "@angular/core";
import { Page } from "src/app/modules/shared/model/page";

import { NzDrawerService } from "ng-zorro-antd";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { ReportService } from "src/app/modules/system/report/report.service";
import { UserListFormComponent } from "src/app/modules/system/modals/user-list-form/user-list-form.component";
import { ReportInstanceListComponent } from "src/app/modules/system/modals/report-instance-list/report-instance-list.component";

@Component({
  selector: "app-report-template-list",
  templateUrl: "./report-template-list.component.html",
  styleUrls: ["./report-template-list.component.scss"],
})
export class ReportTemplateListComponent implements OnInit {
  @ViewChild("myTable", { static: false }) table: any;
  @ViewChild("drawerHeader", { static: false }) drawerHeader: TemplateRef<{}>;
  @Output("select") selectEvent: EventEmitter<any> = new EventEmitter<any>();

  showDummy: boolean;
  childDrawerRef: any;
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
  templateToDelete: any;
  clientOut: any;
  clientToToggle: any;
  isToggleAlertVisible: boolean;
  isSearching: boolean;
  searchPattern = "";
  sortBy: any = "";
  orderBy: any = "";
  drawerTitle: any;

  constructor(
    private reportService: ReportService,
    private notificationService: NotificationService,
    private drawerService: NzDrawerService,
    private helperService: HelperService
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.pageSizeOptions = AppConstants.TABLE_PAGE_SIZE_OPTIONS;
    this.selectedPageSize = this.page.size;
  }

  ngOnInit() {
    this.getTableColumns();
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
      /*{
        name: "isActive",
        displayName: "Status",
        defaultDisplay: true,
        sortable: false,
        isEditable: false
      },*/
      {
        name: "reportName",
        displayName: "Report Name",
        defaultDisplay: true,
        sortable: false,
        isEditable: false,
      },
      {
        name: "reportTypeName",
        displayName: "Report Type",
        defaultDisplay: true,
        sortable: false,
        isEditable: false,
      },
      {
        name: "reportFrequency",
        displayName: "Frequency In Days",
        defaultDisplay: true,
        sortable: false,
        isEditable: false,
      },
      {
        name: "reportDeliveryEndDate",
        displayName: "Delivery End Date",
        defaultDisplay: true,
        sortable: false,
        isEditable: false,
      },
      /*{
        name: "executedCount",
        displayName: "Executed Count",
        defaultDisplay: true,
        sortable: false,
        isEditable: false
      },*/
      {
        name: "nextExecutionTime",
        displayName: "Next Execution Time",
        defaultDisplay: true,
        sortable: false,
        isEditable: false,
      },
      {
        name: "dateRangeTypeName",
        displayName: "Date Range",
        defaultDisplay: true,
        sortable: false,
        isEditable: false,
      },
      {
        name: "dataStartDate",
        displayName: "Start Date",
        defaultDisplay: true,
        sortable: false,
        isEditable: false,
      },
      {
        name: "dataEndDate",
        displayName: "End Date",
        defaultDisplay: true,
        sortable: false,
        isEditable: false,
      },
      {
        name: "distributionEmail",
        displayName: "Recipients",
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
    //this.showDummy = true;
    this.reportService.getReportTemplateList(this.page).subscribe(
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
                //this.showDummy = false;
              } else {
                //this.showDummy = true;
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

  onDataError(error: any) {}

  onSort(event: any) {
    this.sortBy = event.sorts[0].prop;
    this.orderBy = event.sorts[0].dir.toUpperCase();
    this.currPageInfo.offset = 0;
    this.setPage(this.currPageInfo);
  }

  getColWidth(colName: any) {
    return 200;
  }

  getDate(date: any, colName: any) {
    try {
      if (date) {
        let format = AppConstants.DISPLAY_DATE_FORMAT;
        if (colName === "nextExecutionTime") {
          if (date.indexOf(" ") > 0) {
            let part1 = date.split(" ")[0];
            let part2 = date.split(" ")[1];
            return (
              this.helperService.transformDate(part1, format) + " " + part2
            );
          }
        }
        return this.helperService.transformDate(date, format);
      } else {
        return "-";
      }
    } catch (e) {
      return "-";
    }
  }
  getRecipientsCount(data: any) {
    if (data && data.split(",").length > 0) {
      return data.split(",").length;
    }
    return 0;
  }

  viewRecipients(row: any): void {
    let data = null;
    if (row["distributionEmail"]) {
      data = row["distributionEmail"].split(",");
      this.drawerTitle = "Recipients List";
      this.childDrawerRef = this.drawerService.create<
        UserListFormComponent,
        { data: any },
        string
      >({
        nzTitle: this.drawerHeader,
        nzContent: UserListFormComponent,
        nzContentParams: {
          data: data,
        },
        nzClosable: false,
        nzWrapClassName: "modal-wrapper",
        nzWidth: "30%",
      });

      this.childDrawerRef.afterOpen.subscribe(() => {});

      this.childDrawerRef.afterClose.subscribe((data) => {});
    }
  }

  viewHandler(row: any) {
    this.drawerTitle = "Report Instance List";
    this.childDrawerRef = this.drawerService.create<
      ReportInstanceListComponent,
      { row: any },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: ReportInstanceListComponent,
      nzContentParams: {
        row: row,
      },
      nzClosable: false,
      nzWrapClassName: "modal-wrapper",
      nzWidth: "50%",
    });

    this.childDrawerRef.afterOpen.subscribe(() => {});

    this.childDrawerRef.afterClose.subscribe((data) => {});
  }

  deleteHandler(row: any) {
    this.isAlertVisible = true;
    this.templateToDelete = row;
  }

  deleteClientConfirm = async () => {
    let successMessage = "Report template has been successfully deleted.";
    let errorMessage = "Report template deletion failed.";
    this.isAlertVisible = false;
    await this.reportService
      .deleteReportTemplate(this.templateToDelete.id)
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

  deleteClientCancel = () => {
    this.isAlertVisible = false;
  };

  editHandler(row: any) {
    this.selectEvent.emit({ id: row.id });
  }

  showNotification(info: any) {
    this.notificationService.showNotification(info);
  }

  getActiveStatus(row: any, col: any) {
    return row && col && col.name && row[col.name] === 1
      ? "ACTIVE"
      : "INACTIVE";
  }

  closeForm() {
    this.childDrawerRef.close();
  }
}
