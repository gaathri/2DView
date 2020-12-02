import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { ReportService } from "src/app/modules/system/report/report.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { ShowsService } from "src/app/modules/system/shows/shows.service";
import { ReportFilterSettingsComponent } from "src/app/modules/system/modals/report-filter-settings/report-filter-settings.component";
import { NzDrawerService } from "ng-zorro-antd";
import { RolesService } from "src/app/modules/system/configs/roles.service";
import { UserListFormComponent } from "src/app/modules/system/modals/user-list-form/user-list-form.component";
import { ReportFormComponent } from "src/app/modules/system/modals/report-form/report-form.component";
import { subMonths, endOfMonth } from "date-fns";
import { WorkstatusService } from "src/app/modules/system/configs/workstatus.service";
import { DepartmentsService } from "src/app/modules/system/configs/departments.service";

@Component({
  selector: "app-report-template",
  templateUrl: "./report-template.component.html",
  styleUrls: ["./report-template.component.scss"],
})
export class ReportTemplateComponent implements OnInit {
  @ViewChild("drawerHeader", { static: false }) drawerHeader: TemplateRef<{}>;
  childDrawerRef: any;
  drawerTitle: any;

  isShowSelect: boolean;
  shows: any;
  showId: any;

  isDepartSelect: boolean;
  departments: any;
  departmentId: any;

  isWorkStatusSelect: boolean;
  workStatuses: any;
  workStatusId: any;

  isDateSelect: boolean;
  date: any;

  dateTypes: any;
  dateTypeId = "clientEta";

  isArtistSelect: boolean;
  artists: any;
  artistId: any;

  ranges: any;
  dateRangeTypeId: any;

  reportTypes: any;
  reportTypeId: any;

  isCustom: boolean;
  dateRange: any;

  reportOut: any;
  reportData: any;
  chartData: any;
  barChartData: any;
  reportTableData: any;
  tableColumns: any;

  isLoading: any;
  reportFilters: any;
  contentHeight: number;
  graphContainerHeight: number;
  graphContainerWidth: number;
  boxCount = 7;
  boxArrRow1 = [];
  boxArrRow2 = [];
  isReportTemplateVisible: boolean;
  isTemplateListVisible: boolean;

  selectedReportTemplate: any;
  intervalId: any;

  isFilterApplied: boolean;
  hasChart: boolean;

  enableDepartmentFilter: boolean;
  constructor(
    private helperService: HelperService,
    private reportService: ReportService,
    private showsService: ShowsService,
    private rolesService: RolesService,
    private workstatusService: WorkstatusService,
    private drawerService: NzDrawerService,
    private departmentsService: DepartmentsService
  ) {}

  ngOnInit() {
    this.prepareData();
    this.showReportTemplate();
  }

  showReportTemplate() {
    this.isReportTemplateVisible = true;
    this.isTemplateListVisible = false;
  }

  showTemplateList() {
    this.selectedReportTemplate = null;
    this.reportTypeId = null;
    this.resetAll();
    this.isReportTemplateVisible = false;
    this.isTemplateListVisible = true;
  }

  onResize() {
    this.getBoxHeight();
  }
  calcDone: boolean;

  getBoxHeight() {
    if (document.getElementsByClassName("box")[0]) {
      let boxWidth = document.getElementsByClassName("box")[0].clientWidth;
      this.contentHeight = boxWidth;
      setTimeout(() => {
        let boxContainerHeight = document.getElementsByClassName(
          "box-container"
        )[0].clientHeight;
        let graphContainerWidth = document.getElementsByClassName(
          "graph-container"
        )[0].clientWidth;

        this.graphContainerHeight = boxContainerHeight;
        this.graphContainerWidth = graphContainerWidth;
        this.calcDone = true;
      }, 100);
    }
  }

  prepareData() {
    let count = 0;
    this.boxArrRow1 = [];
    this.boxArrRow2 = [];
    for (let i = 0; i < this.boxCount; i++) {
      this.boxArrRow1.push(count++);
    }
    for (let i = 0; i < this.boxCount; i++) {
      this.boxArrRow2.push(count++);
    }
    this.dateTypes = [
      {
        name: "Client ETA",
        id: "clientEta",
      },
      {
        name: "End Date",
        id: "endDate",
      },
      {
        name: "Delivery Date",
        id: "deliveryDate",
      },
    ];
    this.getReportTypes();
  }

  dateTypeChangeHandler(e: any) {
    this.dateTypeId = e;
  }

  async getReportTypes() {
    await this.reportService
      .getReportTypes()
      .toPromise()
      .then((resp: any) => {
        this.reportTypes = resp.entity;
        this.onReportTypesResponse();
      })
      .catch((error: any) => {
        this.reportTypes = [];
      });
  }

  async getDaterange(id: any) {
    await this.reportService
      .getDaterange(id)
      .toPromise()
      .then((resp: any) => {
        this.ranges = resp.entity;
        this.onDateRangeTypesResponse();
      })
      .catch((error: any) => {
        this.ranges = [];
      });
  }

  async getShows() {
    await this.showsService
      .getShows()
      .toPromise()
      .then((resp) => {
        this.shows = resp.entity;
        this.onShowsResponse();
      })
      .catch((error) => {
        this.shows = null;
      });
  }

  async getWorkstatusByRole() {
    await this.workstatusService
      .getWorkstatusByRole()
      .toPromise()
      .then((resp: any) => {
        this.workStatuses = resp.entity;
        this.onWorkstatusesResponse();
      })
      .catch((error: any) => {
        this.workStatuses = [];
      });
  }

  async getUsersByPrivilege(privilegeId: any) {
    await this.rolesService
      .getUsersByPrivilege(privilegeId)
      .toPromise()
      .then((resp: any) => {
        this.artists = resp.entity;
        this.onArtistsResponse();
      })
      .catch((error: any) => {
        this.artists = [];
      });
  }
  async getDepartmentListSearch() {
    await this.departmentsService
      .getDepartmentListSearch()
      .toPromise()
      .then((resp: any) => {
        this.departments = resp.entity;
      })
      .catch((error: any) => {
        this.departments = [];
      });
  }
  isValidArr(arr: any) {
    return this.helperService.isValidArr(arr);
  }

  rangeChangeHandler(e: any) {
    this.dateRangeTypeId = e;
    this.isCustom = false;
    if (e === AppConstants.REPORT_CUSTOM_RANGE_ID) {
      this.isCustom = true;
    }
  }

  resetAll() {
    this.isFilterApplied = false;
    this.isShowSelect = false;
    this.isDepartSelect = false;
    this.isWorkStatusSelect = false;
    this.isDateSelect = false;
    this.dateTypeId = "clientEta";
    this.isArtistSelect = false;
    this.isCustom = false;
    this.showId = null;
    this.departmentId = null;
    this.workStatusId = null;
    this.dateRange = null;
    this.dateRangeTypeId = null;
    this.ranges = [];
    this.reportTableData = null;
    this.reportData = null;
    this.chartData = null;
    this.barChartData = null;
  }

  async reportTypeChangeHandler(e: any) {
    this.reportTypeId = e;
    this.resetAll();
    /*this.isShowSelect = false;
    this.isDateSelect = false;
    this.isArtistSelect = false;
    this.isCustom = false;
    this.showId = null;
    this.dateRange = null;
    this.dateRangeTypeId = null;
    this.ranges = [];
    this.reportTableData = null;
    this.reportData = null;
    this.chartData = null;
    this.barChartData = null;*/
    this.setFilters(e);
    if (e) {
      if (e !== AppConstants.DAYBOOK_REPORT_ID) {
        await this.getDaterange(e);
      }
    }
    if (e === AppConstants.DAYBOOK_REPORT_ID) {
      this.isDateSelect = true;
      if (
        this.selectedReportTemplate &&
        this.selectedReportTemplate.dataStartDate
      ) {
        this.date = this.selectedReportTemplate.dataStartDate;
      } else {
        //this.date = new Date();
      }

      //this.reportOut.reportFilter.dateType = this.dateTypeId;

      if (
        this.selectedReportTemplate &&
        this.selectedReportTemplate.reportFilter &&
        this.selectedReportTemplate.reportFilter.dateType
      ) {
        this.dateTypeId = this.selectedReportTemplate.reportFilter.dateType;
      } else {
        this.dateTypeId = "clientEta";
      }
    }
    if (
      e === AppConstants.PROJECT_REPORT_ID ||
      e === AppConstants.FINANCIAL_REPORT_ID
    ) {
      this.isShowSelect = true;
      this.getShows();
    }

    if (e === AppConstants.IN_PROGRESS_REPORT_ID) {
      this.isWorkStatusSelect = true;
      this.getWorkstatusByRole();
    }

    if (e === AppConstants.INDIVIDUAL_ARTIST_REPORT_ID) {
      this.isArtistSelect = true;
      this.getUsersByPrivilege(AppConstants.ARTIST_PRIVILEGE_ID);
    }
    if (e === AppConstants.DEPARTMENT_REPORT_ID) {
      this.isDepartSelect = true;
      this.getDepartmentListSearch();
    }
  }

  customChangeHandler(e) {}

  submitHandler(isRunNow: boolean) {
    this.hasChart = true;
    if (
      this.reportTypeId === AppConstants.DAYBOOK_REPORT_ID ||
      this.reportTypeId === AppConstants.IN_PROGRESS_REPORT_ID
    ) {
      this.hasChart = false;
    }
    let params = this.getParams();
    let filterParams = this.getFilterParams();
    if (filterParams !== "") {
      if (params != "") {
        params += "&";
      }
      params += filterParams;
    }
    if (isRunNow) {
      if (this.reportTypeId === AppConstants.ARTIST_AVAILABILITY_REPORT_ID) {
        this.reportService
          .downloadReportData(this.reportTypeId, this.dateRangeTypeId, params)
          .subscribe(
            (res: any) => {
              let fileName = "";
              try {
                let contentDispositionHeader = res.headers.get(
                  "Content-Disposition"
                );
                fileName = contentDispositionHeader.split("=")[1];
              } catch (e) {}

              const blob = new Blob([res.body], {
                type:
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.setAttribute("style", "display:none;");
              document.body.appendChild(a);
              a.href = url;
              a.download = fileName.replace("xls", "xlsx");
              a.click();
            },
            (error) => {}
          );
      } else {
        this.reportService
          .downloadReportKPI(this.reportTypeId, params)
          .subscribe(
            (res: any) => {
              let fileName = "";
              try {
                let contentDispositionHeader = res.headers.get(
                  "Content-Disposition"
                );
                fileName = contentDispositionHeader.split("=")[1];
              } catch (e) {}
              console.log(fileName);
              const blob = new Blob([res.body], {
                type:
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.setAttribute("style", "display:none;");
              document.body.appendChild(a);
              a.href = url;
              a.download = fileName.replace("xls", "xlsx");
              a.click();
            },
            (error) => {}
          );
      }
    } else {
      this.isLoading = true;
      this.calcDone = false;
      if (this.reportTypeId === AppConstants.ARTIST_AVAILABILITY_REPORT_ID) {
        this.reportService
          .getReportData(this.reportTypeId, this.dateRangeTypeId, params)
          .toPromise()
          .then((resp: any) => {
            this.isLoading = false;
            this.reportTableData = this.frameReportTableData(resp.entity);
          })
          .catch((error: any) => {
            this.isLoading = false;
            this.reportTableData = [];
          });
      } else {
        this.chartData = null;
        /*if (this.reportTypeId === AppConstants.PROJECT_REPORT_ID) {
          this.showsService
            .getShowStatus(this.showId)
            .toPromise()
            .then((resp: any) => {
              this.chartData = resp.entity.workStatusCount;
            })
            .catch((error: any) => {
              this.chartData = null;
            });
        }*/
        this.reportService
          .getReportKPI(this.reportTypeId, params)
          .toPromise()
          .then((resp: any) => {
            this.reportData = this.frameReportData(resp.entity);
            //if (this.reportTypeId !== AppConstants.PROJECT_REPORT_ID) {
            this.chartData = resp.entity.status;
            //console.log(" 2 chartData ", this.chartData);
            //}
            if (this.reportTypeId === AppConstants.FINANCIAL_REPORT_ID) {
              this.barChartData = {
                actual: resp.entity.actual,
                achieved: resp.entity.achieved,
              };
            }
            this.isLoading = false;

            setTimeout(() => {
              this.getBoxHeight();
            }, 100);
          })
          .catch((error: any) => {
            this.reportData = [];
            this.isLoading = false;
          });
      }
    }
  }

  getParams() {
    let params = "";
    if (this.dateRangeTypeId) {
      params = this.addParam(params, "dateRangeTypeId", this.dateRangeTypeId);
    }
    if (this.isShowSelect) {
      params = this.addParam(params, "showIds", this.showId);
    }
    if (this.isDepartSelect) {
      params = this.addParam(params, "departmentIds", this.departmentId);
    }
    if (this.isWorkStatusSelect) {
      params = this.addParam(params, "statusId", this.workStatusId);
    }
    if (this.isDateSelect) {
      let dateStr = "";
      if (this.date) {
        dateStr = this.helperService.transformDate(this.date, "yyyy-MM-dd"); //dataStartDate=2020-04-01
      }
      params = this.addParam(params, "dataStartDate", dateStr);
      params = this.addParam(params, "dateType", this.dateTypeId);
    }
    if (this.isArtistSelect) {
      params = this.addParam(params, "artistId", this.artistId);
    }
    if (this.isCustom) {
      params = this.addParam(
        params,
        "dataStartDate",
        this.helperService.transformDate(this.dateRange[0], "yyyy-MM-dd")
      );
      params = this.addParam(
        params,
        "dataEndDate",
        this.helperService.transformDate(this.dateRange[1], "yyyy-MM-dd")
      );
    }
    return params;
  }

  addParam(params: any, key: any, value: any) {
    if (params != "") {
      params += "&";
    }
    params += `${key}=${value}`;
    return params;
  }

  getFilterParams() {
    let filterParams = "";
    for (let i in this.reportFilters) {
      let item = this.reportFilters[i];
      if (item && item.length > 0) {
        if (filterParams != "") {
          filterParams += "&";
        }
        filterParams += `${i}=${item.toString()}`;
      }
    }
    return filterParams;
  }

  isSubmitEnabled() {
    console.log(this.departmentId);
    let enabled = this.reportTypeId ? true : false;
    if (this.isValidArr(this.ranges)) {
      enabled = this.dateRangeTypeId ? true : false;
    }
    if (enabled && this.isShowSelect) {
      enabled = this.showId ? true : false;
    }
    if (enabled && this.isDepartSelect) {
      enabled = this.departmentId ? true : false;
    }
    if (enabled && this.isWorkStatusSelect) {
      enabled = this.workStatusId ? true : false;
    }

    if (enabled && this.isDateSelect) {
      //enabled = this.date ? true : false;
      enabled = true;
    }
    if (enabled && this.isArtistSelect) {
      enabled = this.artistId ? true : false;
    }
    if (enabled && this.isCustom) {
      enabled = this.dateRange ? true : false;
    }
    return enabled;
  }

  isSaveDisabled() {
    let disabled = true;
    if (
      this.isValidArr(this.reportData) ||
      this.isValidArr(this.reportTableData)
    ) {
      disabled = false;
    }
    return disabled;
  }

  isFilterDisabled() {
    let disabled = false;
    let advFilterDisabledReportIds = [
      AppConstants.PROJECT_REPORT_ID,
      AppConstants.INDIVIDUAL_ARTIST_REPORT_ID,
      AppConstants.FINANCIAL_REPORT_ID,
      AppConstants.DEPARTMENT_REPORT_ID,
    ];
    if (!this.reportTypeId) {
      disabled = true;
    }
    if (advFilterDisabledReportIds.includes(this.reportTypeId)) {
      disabled = true;
    }
    return disabled;
  }

  setFilters(reportTypeId: any) {
    this.reportFilters = {};
    let reportIdsWithShowFilter = AppConstants.SHOW_FILTER_REPORT_IDS;
    let reportIdsWithDepartmentFilter =
      AppConstants.DEPARTMENT_FILTER_REPORT_IDS;
    if (reportIdsWithShowFilter.includes(reportTypeId)) {
      this.reportFilters.showIds = null;
    }

    if (reportIdsWithDepartmentFilter.includes(reportTypeId)) {
      this.reportFilters.departmentIds = null;
    }
  }

  filterHandler() {
    this.openFilterSettingsForm();
  }

  getDate(date: any) {
    return this.helperService.transformDate(date, "MMM dd, yyyy");
  }

  getAvailableArtists(data: any) {
    //data = 'Test User1,Test User1,Test User1,Test User1,Test User1,Test User1,Test User1,Test User1,Test User1,Test User1,Test User1, ';
    return data.split(",").join(" | ");
  }

  getColWidth(colName: any) {
    if (colName === "availableArtists") {
      return 500;
    }
    return 150;
  }

  frameReportTableData(entity: any) {
    let reportTableData = [];
    if (!entity) {
      return reportTableData;
    }
    if (!entity.data) {
      return reportTableData;
    }
    if (!entity.schema) {
      return reportTableData;
    }
    if (entity.data.length < 1) {
      return reportTableData;
    }
    if (entity.schema.length < 1) {
      return reportTableData;
    }

    this.tableColumns = [
      {
        name: "date",
        displayName: "Date",
        defaultDisplay: true,
        sortable: false,
        isEditable: false,
      },
      {
        name: "availableArtistCount",
        displayName: "Available Artists",
        defaultDisplay: true,
        sortable: false,
        isEditable: false,
      },
      {
        name: "department",
        displayName: "Department",
        defaultDisplay: true,
        sortable: false,
        isEditable: false,
      },
      /*{
        name: "availableArtists",
        displayName: "Available Artists",
        defaultDisplay: true,
        sortable: false,
        isEditable: false
      },*/
    ];

    let row = null;
    for (let i = 0; i < entity.data.length; i++) {
      row = this.getRowInfo(entity.schema, entity.data[i]);
      reportTableData.push(row);
    }
    return reportTableData;
  }

  getRowInfo(schema: any, data: any) {
    let row = new Object();
    let schemaKey = "";
    for (let i = 0; i < schema.length; i++) {
      schemaKey = schema[i].split(" ").join("");
      schemaKey = schemaKey.charAt(0).toLowerCase() + schemaKey.slice(1);
      row[schemaKey] = data[i] ? data[i] : "";
    }
    return row;
  }

  frameReportData(entity: any) {
    let reportData = [];
    let info = null;
    for (let i = 0; i < entity.schema.length; i++) {
      info = new Object();
      info.key = entity.schema[i];
      info.value = 0;
      if (entity.data && entity.data[0] && entity.data[0][i]) {
        info.value = entity.data[0][i];
      }
      reportData.push(info);
    }
    return reportData;
  }

  isMoreVisible(row: any) {
    let isVisible = false;
    if (row.availableArtistCount > 1) {
      isVisible = true;
    }
    return isVisible;
  }

  viewHandler(row: any): void {
    let data = row["availableArtists"].split(",");
    this.drawerTitle = "Artist List";
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

  isValidData(index: any) {
    return index < this.reportData.length;
  }

  getArtistName(artist: any) {
    let name = "";
    if (artist.firstName) {
      name += artist.firstName + " ";
    }
    if (artist.lastName) {
      name += artist.lastName;
    }
    return name;
  }

  getKey(index: any) {
    return this.reportData[index] && this.reportData[index].key
      ? this.reportData[index].key
      : "";
  }

  getValue(index: any) {
    return this.reportData[index] && this.reportData[index].value
      ? this.reportData[index].value
      : 0;
  }

  saveHandler() {
    let mode = "create";
    if (this.selectedReportTemplate) {
      mode = "update";
    }
    this.frameReportIn();
    this.openSaveReportForm(mode);
  }

  fillFormControls() {
    this.reportOut.reportName = "";
    this.reportOut.reportFrequency = 1;
    this.reportOut.reportDeliveryEndDate = null;
    this.reportOut.distributionEmail = null;
    this.reportOut.sheduledHourMin = "18:00";
    if (this.selectedReportTemplate) {
      this.reportOut.sheduledHourMin = this.selectedReportTemplate.sheduledHourMin;
      this.reportOut.id = this.selectedReportTemplate.id;
      this.reportOut.reportName = this.selectedReportTemplate.reportName;
      this.reportOut.reportFrequency = this.selectedReportTemplate.reportFrequency;
      this.reportOut.reportDeliveryEndDate = this.selectedReportTemplate.reportDeliveryEndDate;
      if (
        this.selectedReportTemplate &&
        this.selectedReportTemplate.distributionEmail &&
        this.selectedReportTemplate.distributionEmail.length > 0
      ) {
        this.reportOut.distributionEmail = this.selectedReportTemplate.distributionEmail.split(
          ","
        );
      }
    }
  }

  disabledDate = (startValue: Date): boolean => {
    if (!startValue) {
      return false;
    }
    let today = new Date();
    let lastMonths = subMonths(endOfMonth(today), 2);
    if (startValue.getTime() > endOfMonth(today).getTime()) {
      return true;
    }
    if (startValue.getTime() < lastMonths.getTime()) {
      return true;
    }
    return false;
  };

  frameReportIn() {
    this.reportOut = new Object();
    this.fillFormControls();
    this.reportOut.reportTypeId = this.reportTypeId;
    if (this.dateRangeTypeId) {
      this.reportOut.dateRangeTypeId = this.dateRangeTypeId;
    }
    if (this.isCustom) {
      this.reportOut.dataStartDate = this.helperService.transformDate(
        this.dateRange[0],
        "yyyy-MM-dd"
      );
      this.reportOut.dataEndDate = this.helperService.transformDate(
        this.dateRange[1],
        "yyyy-MM-dd"
      );
    }
    if (this.isDateSelect) {
      this.reportOut.dateRangeTypeId = 5;
      if (this.date) {
        this.reportOut.dataStartDate = this.helperService.transformDate(
          this.date,
          "yyyy-MM-dd"
        );
      } else {
        this.reportOut.dataStartDate = null;
      }
    }
    this.reportOut = {
      ...this.reportOut,
      reportFilter: { ...this.reportFilters },
    };
    if (this.isShowSelect) {
      if (!this.reportOut.reportFilter) {
        this.reportOut.reportFilter = {};
      }
      this.reportOut.reportFilter.showIds = [this.showId];
    }
    if (this.isShowSelect) {
      if (!this.reportOut.reportFilter) {
        this.reportOut.reportFilter = {};
      }
      this.reportOut.reportFilter.showIds = [this.showId];
    }

    if (this.isWorkStatusSelect) {
      if (!this.reportOut.reportFilter) {
        this.reportOut.reportFilter = {};
      }
      this.reportOut.reportFilter.statusId = this.workStatusId;
    }

    if (this.isDateSelect) {
      if (!this.reportOut.reportFilter) {
        this.reportOut.reportFilter = {};
      }
      this.reportOut.reportFilter.dateType = this.dateTypeId;
    }

    if (this.isArtistSelect) {
      if (!this.reportOut.reportFilter) {
        this.reportOut.reportFilter = {};
      }
      this.reportOut.reportFilter.artistId = this.artistId;
    }
  }

  openSaveReportForm(mode: any): void {
    this.drawerTitle = "Save Report";
    this.childDrawerRef = this.drawerService.create<
      ReportFormComponent,
      {
        reportOut: any;
        mode: any;
      },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: ReportFormComponent,
      nzContentParams: {
        reportOut: this.reportOut,
        mode: mode,
      },
      nzClosable: false,
      nzWidth: "40%",
      nzWrapClassName: "modal-wrapper",
    });

    this.childDrawerRef.afterOpen.subscribe(() => {});

    this.childDrawerRef.afterClose.subscribe((data) => {
      if (data) {
        if (mode == "update") {
          this.showTemplateList();
        }
      }
    });
  }

  openFilterSettingsForm(): void {
    this.drawerTitle = "Filters";
    this.childDrawerRef = this.drawerService.create<
      ReportFilterSettingsComponent,
      {
        reportTypeId: any;
        filters: any;
      },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: ReportFilterSettingsComponent,
      nzContentParams: {
        reportTypeId: this.reportTypeId,
        filters: this.reportFilters,
      },
      nzClosable: false,
      nzWidth: "40%",
      nzWrapClassName: "modal-wrapper",
    });

    this.childDrawerRef.afterOpen.subscribe(() => {});

    this.childDrawerRef.afterClose.subscribe((data) => {
      if (data) {
        if (JSON.stringify(this.reportFilters) !== JSON.stringify(data)) {
          this.reportFilters = data;
        } else {
        }
        this.isFilterApplied = false;
        let filterParams = this.getFilterParams();
        if (this.reportTypeId === AppConstants.DAYBOOK_REPORT_ID) {
          this.isFilterApplied = false;
          if (
            this.reportFilters.showIds &&
            this.isValidArr(this.reportFilters.showIds)
          ) {
            this.isFilterApplied = true;
          }
        } else {
          if (filterParams !== "") {
            this.isFilterApplied = true;
          }
        }
      }
    });
  }

  closeForm(): void {
    this.childDrawerRef.close();
  }

  getBtnText() {
    return this.selectedReportTemplate ? "Edit Template" : "Add Template";
  }

  reportSelectHandler(event: any) {
    this.selectedReportTemplate = null;
    this.reportService
      .getReportTemplate(event.id)
      .toPromise()
      .then((resp: any) => {
        this.selectedReportTemplate = resp.entity;
        this.loadReportTemplate();
      })
      .catch((error: any) => {
        this.selectedReportTemplate = null;
      });
  }

  loadReportTemplate() {
    this.prepareData();
    this.showReportTemplate();
  }

  async onReportTypesResponse() {
    if (this.selectedReportTemplate) {
      if (this.selectedReportTemplate.reportTypeId) {
        await this.reportTypeChangeHandler(
          this.selectedReportTemplate.reportTypeId
        );
      }
      if (this.selectedReportTemplate.reportFilter) {
        this.reportFilters = this.selectedReportTemplate.reportFilter;
      }
      if (!this.isFilterDisabled()) {
        let filterParams = this.getFilterParams();
        if (this.reportTypeId === AppConstants.DAYBOOK_REPORT_ID) {
          this.isFilterApplied = false;
          if (
            this.reportFilters.showIds &&
            this.isValidArr(this.reportFilters.showIds)
          ) {
            this.isFilterApplied = true;
          }
        } else {
          if (filterParams !== "") {
            this.isFilterApplied = true;
          }
        }
      }
      this.intervalId = setInterval(() => {
        this.checkSubmit();
      }, 500);
    }
  }

  checkSubmit() {
    if (this.isSubmitEnabled()) {
      clearInterval(this.intervalId);
      this.submitHandler(false);
    } else {
    }
  }

  onDateRangeTypesResponse() {
    if (this.selectedReportTemplate) {
      if (this.selectedReportTemplate.dateRangeTypeId) {
        this.rangeChangeHandler(this.selectedReportTemplate.dateRangeTypeId);
        if (this.isCustom) {
          this.dateRange = [];
          if (this.selectedReportTemplate.dataStartDate) {
            this.dateRange[0] = this.selectedReportTemplate.dataStartDate;
          }
          if (this.selectedReportTemplate.dataEndDate) {
            this.dateRange[1] = this.selectedReportTemplate.dataEndDate;
          }
        }
      }
    }
  }

  onShowsResponse() {
    if (this.selectedReportTemplate) {
      if (
        this.selectedReportTemplate.reportFilter &&
        this.selectedReportTemplate.reportFilter.showIds
      ) {
        this.showId = this.selectedReportTemplate.reportFilter.showIds[0];
      }
    }
  }
  onDeptResponse() {
    if (this.selectedReportTemplate) {
      if (
        this.selectedReportTemplate.reportFilter &&
        this.selectedReportTemplate.reportFilter.departmentIds
      ) {
        this.departmentId = this.selectedReportTemplate.reportFilter.departmentIds[0];
      }
    }
  }

  onWorkstatusesResponse() {
    if (this.selectedReportTemplate) {
      if (
        this.selectedReportTemplate.reportFilter &&
        this.selectedReportTemplate.reportFilter.statusId
      ) {
        this.workStatusId = this.selectedReportTemplate.reportFilter.statusId;
      }
    }
  }

  onArtistsResponse() {
    if (this.selectedReportTemplate) {
      if (
        this.selectedReportTemplate.reportFilter &&
        this.selectedReportTemplate.reportFilter.artistId
      ) {
        this.artistId = this.selectedReportTemplate.reportFilter.artistId;
      }
    }
  }

  isUpdateMode() {
    return this.selectedReportTemplate != null;
  }

  getDisplayDateFormat() {
    return AppConstants.DISPLAY_DATE_FORMAT;
  }
}
