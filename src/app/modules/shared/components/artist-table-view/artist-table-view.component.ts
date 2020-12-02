import {
  Component,
  OnInit,
  Input,
  ViewChild,
  TemplateRef,
} from "@angular/core";
import { WorklogService } from "src/app/modules/system/time-sheet/worklog.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { Page } from "../../model/page";
import { AppConstants } from "src/app/constants/AppConstants";
import { NzDrawerService } from "ng-zorro-antd";
import { TimeSheetFilterSettingsComponent } from "src/app/modules/system/modals/time-sheet-filter-settings/time-sheet-filter-settings.component";

@Component({
  selector: "app-artist-table-view",
  templateUrl: "./artist-table-view.component.html",
  styleUrls: ["./artist-table-view.component.scss"],
})
export class ArtistTableViewComponent implements OnInit {
  @ViewChild("myTable", { static: false }) table: any;
  @Input("selectedDate") selectedDate: any;

  @ViewChild("drawerHeader", { static: false }) drawerHeader: TemplateRef<{}>;

  showDummy: boolean;
  isEmptyData: boolean;
  isDataReady: boolean;
  isLoading: boolean = true;
  rows: any;
  page = new Page();
  selectedPageSize: any;
  tableColumns: any;
  selectedTableColumns: any;
  intervalId: any;
  pageSizeOptions: any;
  currPageInfo: any;
  isSearching: boolean;
  searchPattern = "";
  sortBy: any = "";
  orderBy: any = "";
  isRowGroupEnabled: boolean = true;
  childDrawerRef: any;
  drawerTitle: any;
  taskFilters: any;
  isFilterApplied: boolean;

  constructor(
    private worklogService: WorklogService,
    private helperService: HelperService,
    private drawerService: NzDrawerService
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.pageSizeOptions = AppConstants.TABLE_PAGE_SIZE_OPTIONS;
    this.selectedPageSize = this.page.size; //.toString();
  }

  ngOnInit() {
    this.prepareData();
  }

  prepareData() {
    this.getTableColumns();
    this.setFilters();
    this.isDataReady = true;
  }

  filterHandler() {
    this.drawerTitle = "Filter Settings";
    this.openFilterSettingsForm();
  }

  closeForm(): void {
    this.childDrawerRef.close();
  }

  openFilterSettingsForm(): void {
    this.childDrawerRef = this.drawerService.create<
      TimeSheetFilterSettingsComponent,
      {
        filters: any;
      },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: TimeSheetFilterSettingsComponent,
      nzContentParams: {
        filters: this.taskFilters,
      },
      nzClosable: false,
      nzWidth: "40%",
      nzWrapClassName: "modal-wrapper",
    });

    this.childDrawerRef.afterOpen.subscribe(() => {});

    this.childDrawerRef.afterClose.subscribe((data) => {
      if (data) {
        if (JSON.stringify(this.taskFilters) !== JSON.stringify(data)) {
          this.taskFilters = data;
          this.currPageInfo.offset = 0;
          this.setPage(this.currPageInfo);
        } else {
        }
      }
    });
  }

  getFilterParams() {
    let filterParams = "";
    for (let i in this.taskFilters) {
      let item = this.taskFilters[i];
      if (item && item.length > 0) {
        if (filterParams != "") {
          filterParams += "&";
        }
        filterParams += `${i}=${item.toString()}`;
      }
    }

    if (this.taskFilters.showIds) {
      if (filterParams != "") {
        filterParams += "&";
      }
      filterParams += `showIds=${this.taskFilters.showIds}`;
    }
    return filterParams;
  }

  getTableColumns() {
    this.tableColumns = [
      /*{
        name: "thumbnail",
        displayName: "Thumbnail",
        defaultDisplay: true,
        sortable: false,
        isEditable: false
      },*/
      /*{
        name: "userName",
        displayName: "User",
        defaultDisplay: true,
        sortable: true,
        isEditable: false
      },*/

      {
        name: "showName",
        displayName: "Show Name",
        defaultDisplay: true,
        sortable: true,
        isEditable: false,
      },
      {
        name: "entityName",
        displayName: "Shot / Asset",
        defaultDisplay: true,
        sortable: false,
        isEditable: false,
      },
      {
        name: "taskName",
        displayName: "Task Name",
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
        name: "departmentName",
        displayName: "Department Name",
        defaultDisplay: true,
        sortable: true,
        isEditable: false,
      },

      {
        name: "notes",
        displayName: "Notes",
        defaultDisplay: true,
        sortable: false,
        isEditable: false,
      },
      {
        name: "hoursWorked",
        displayName: "Hours Worked",
        defaultDisplay: true,
        sortable: false,
        isEditable: false,
      },
      {
        name: "completionPercentage",
        displayName: "Progress",
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

  setFilters() {
    this.taskFilters = {
      showIds: null,
      taskTypeIds: [],
      departmentIds: [],
    };
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

  setPageSize() {
    let pageInfo = {
      pageSize: this.selectedPageSize,
      offset: 0,
    };
    this.setPage(pageInfo);
  }

  updatePage(date: any) {
    this.selectedDate = date;
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
    let date = this.helperService.transformDate(
      this.selectedDate,
      "yyyy-MM-dd"
    );
    let params = "";
    params = `search=${this.page.search}&pageNo=${this.page.pageNumber}&pageSize=${this.page.size}&sortBy=${this.page.sortBy}&orderBy=${this.page.orderBy}&date=${date}`;
    let filterParams = this.getFilterParams();
    this.isFilterApplied = false;
    if (filterParams !== "") {
      this.isFilterApplied = true;
      params += `&${filterParams}`;
    }
    this.worklogService.getWorklogList(params).subscribe(
      (resp) => {
        this.onDataReceived(resp);
      },
      (error) => {
        this.isLoading = false;
        this.onDataError(error);
      }
    );
  }

  onDataReceived(resp: any) {
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
  }

  onDataError(error: any) {
    this.isEmptyData = true;
  }

  getDate() {
    return this.selectedDate;
  }

  getTitle(row: any, col: any) {
    return row[col.name] ? row[col.name] : "";
    //return row[col.name];
  }

  getTaskTypeColorCode(row: any) {
    let defaultCode = "#fff";
    return row && row.colorCode ? row.colorCode : defaultCode;
  }

  getEntityName(row: any) {
    if (row.assetName) {
      return `Asset : ${row.assetName}`;
    } else if (row.shotCode) {
      return `Shot : ${row.shotCode}`;
    } else {
      return "-";
    }
  }

  onSort(event) {
    this.sortBy = event.sorts[0].prop;
    /*if (this.sortBy === "startDate") {
      this.sortBy = "projectedStartDt";
    }
    if (this.sortBy === "endDate") {
      this.sortBy = "projectedEndDt";
    }*/
    this.orderBy = event.sorts[0].dir.toUpperCase();
    this.currPageInfo.offset = 0;
    this.setPage(this.currPageInfo);
  }

  getColWidth(colName) {
    if (
      colName === "artistName" ||
      colName === "accountableName" ||
      colName === "workStatus" ||
      colName === "sequenceName"
    ) {
      return 200;
    } else if (
      colName === "shotName" ||
      colName === "taskName" ||
      colName === "completionPercentage" ||
      colName === "annotationPath" ||
      colName === "referencePath" ||
      colName === "description"
    ) {
      return 250;
    } else if (colName === "thumbnail") {
      return 150;
    } else {
      return 200;
    }
  }

  toggleExpandGroup(group) {
    this.table.groupHeader.toggleExpandGroup(group);
  }

  getGroupName(group) {
    return group.value[0]["userName"];
  }
}
