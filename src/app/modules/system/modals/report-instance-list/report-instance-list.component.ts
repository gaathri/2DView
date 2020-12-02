import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { Page } from "src/app/modules/shared/model/page";
import { NzDrawerService } from "ng-zorro-antd";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { ReportService } from "src/app/modules/system/report/report.service";

@Component({
  selector: "app-report-instance-list",
  templateUrl: "./report-instance-list.component.html",
  styleUrls: ["./report-instance-list.component.scss"],
})
export class ReportInstanceListComponent implements OnInit {
  @ViewChild("myTable", { static: false }) table: any;
  @Input() row: any;

  showDummy: boolean;
  isDataReady: boolean;
  isLoading: boolean = true;
  rows: any;
  page = new Page();
  currPageInfo: any;
  selectedPageSize: any;
  pageSizeOptions: any;
  tableColumns: any;
  selectedTableColumns: any;
  selected = [];
  isSearching: boolean;
  searchPattern = "";
  sortBy: any = "";
  orderBy: any = "";

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
      {
        name: "reportInstanceDeliveryTime",
        displayName: "Generated Date",
        defaultDisplay: true,
        sortable: true,
        isEditable: false,
      },
      {
        name: "reportStatus",
        displayName: "Status",
        defaultDisplay: true,
        sortable: true,
        isEditable: false,
      },
      /*{
        name: "reportSizeBytes",
        displayName: "Report Size",
        defaultDisplay: true,
        sortable: true,
        isEditable: false
      }*/
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
    this.currPageInfo.offset = 0;
    this.setPage(this.currPageInfo);
  }

  searchBlur() {
    if (this.searchPattern == "") {
      this.isSearching = false;
    }
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
    this.reportService.getReportInstanceList(this.page, this.row.id).subscribe(
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

  showNotification(info: any) {
    this.notificationService.showNotification(info);
  }

  downloadHandler(row: any) {
    this.reportService.downloadReport(row.id).subscribe(
      (res: any) => {
        let fileName = "";
        try {
          let contentDispositionHeader = res.headers.get("Content-Disposition");
          fileName = contentDispositionHeader.split("=")[1];
        } catch (e) {}

        const blob = new Blob([res.body], { type: "application/vnd.ms.excel" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.setAttribute("style", "display:none;");
        document.body.appendChild(a);
        a.href = url;
        a.download = fileName;
        a.click();
      },
      (error) => {}
    );
  }

  getDate(date: any) {
    try {
      if (date) {
        //let format = "MMM dd, yyyy";
        let format = AppConstants.DISPLAY_DATE_FORMAT;
        return this.helperService.transformDate(date, format);
      } else {
        return "";
      }
    } catch (e) {
      return "";
    }
  }

  getStatusText(value: any) {
    if (value) {
      try {
        let text = value.toLowerCase();
        text = text.charAt(0).toUpperCase() + text.slice(1);
        return text;
      } catch (e) {}
    }
    return value;
  }

  getStatusColorCode(row: any) {
    let defaultCode = "#ccc";
    let colorCode = {
      success: "#00C293",
      failed: "#FF902B",
      "not started": "#bebebe",
    };
    if (row && row.reportStatus) {
      let key = row.reportStatus.toLowerCase();
      if (colorCode[key]) {
        return colorCode[key];
      }
    }
    return defaultCode;
  }

  isDownloadDisabled(row: any) {
    if (
      row &&
      row.reportStatus &&
      row.reportStatus.toLowerCase() !== "success"
    ) {
      return true;
    }
    return false;
  }
}
