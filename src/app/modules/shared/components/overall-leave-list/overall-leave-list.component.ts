import {
  Component,
  OnInit,
  Input,
  ViewChild,
  TemplateRef,
} from "@angular/core";
import { Page } from "src/app/modules/shared/model/page";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { HrService } from "src/app/modules/system/dashboards/hr.service";

@Component({
  selector: "app-overall-leave-list",
  templateUrl: "./overall-leave-list.component.html",
  styleUrls: ["./overall-leave-list.component.scss"],
})
export class OverallLeaveListComponent implements OnInit {
  @ViewChild("myTable", { static: false }) table: any;
  @Input() viewDate: any;

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
  currPageInfo: any;
  isSearching: boolean;
  searchPattern = "";
  sortBy: any = "";
  orderBy: any = "";
  tableHeight: any = "calc(100vh - 200px)";

  statusArr = [
    {
      name: "All",
      id: "",
    },
    {
      name: "Working",
      id: "WORKING",
    },
    {
      name: "Leave",
      id: "LEAVE",
    },
    {
      name: "Exception",
      id: "EXCEPTION",
    },
  ];

  status = "";

  constructor(
    private helperService: HelperService,
    private hrService: HrService
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.pageSizeOptions = AppConstants.TABLE_PAGE_SIZE_OPTIONS;
    this.selectedPageSize = this.page.size;
  }

  ngOnInit() {
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

  getTextColorCode(row) {
    let color = "white";
    if (row && row.status) {
      if (row.status.toLowerCase() == "exception") {
        color = "#424242";
      }
    }
    return color;
  }

  getStatusColorCode(row) {
    let color = "#19c293";
    if (row && row.status) {
      if (row.status.toLowerCase() == "exception") {
        color = "#ffd538";
      } else if (row.status.toLowerCase() == "working") {
        color = "#19c293";
      } else if (row.status.toLowerCase() == "leave") {
        color = "#ff643d";
      }
    }
    return color;
  }

  getTableColumns() {
    this.tableColumns = [
      {
        name: "userName",
        displayName: "User Name",
        defaultDisplay: true,
        sortable: true,
        isEditable: false,
      },
      // {
      //   name: "duration",
      //   displayName: "Leave Session",
      //   defaultDisplay: true,
      //   sortable: false,
      //   isEditable: false,
      // },

      {
        name: "status",
        displayName: "Status",
        defaultDisplay: true,
        sortable: true,
        isEditable: false,
      },

      {
        name: "reason",
        displayName: "Reason",
        defaultDisplay: true,
        sortable: false,
        isEditable: false,
      },

      {
        name: "role",
        displayName: "Role",
        defaultDisplay: true,
        sortable: true,
        isEditable: false,
      },

      {
        name: "designation",
        displayName: "Designation",
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

  statusChangeHandler(e) {
    this.status = e;
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
    let date = this.helperService.transformDate(this.viewDate, "yyyy-MM-dd");
    this.hrService.getLeaveTableList(this.page, date, this.status).subscribe(
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

  onSort(event: any) {
    this.sortBy = event.sorts[0].prop;
    this.orderBy = event.sorts[0].dir.toUpperCase();
    this.currPageInfo.offset = 0;
    this.setPage(this.currPageInfo);
  }

  onSelect({ selected }) {}

  getColWidth(colName: any) {
    return 150;
  }

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

  getAvatarInfo(row: any) {
    let thumbnail = "";
    if (row.thumbnail) {
      thumbnail = row.thumbnail;
    }
    return {
      firstName: row.userName,
      lastName: row.userName,
      thumbnail: row.thumbnail,
      size: "large",
    };
  }
}
