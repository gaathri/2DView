import { Component, OnInit, Input } from "@angular/core";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { DepartmentsService } from "src/app/modules/system/configs/departments.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { StudioDashboardService } from "src/app/modules/system/dashboards/studio-dashboard.service";

@Component({
  selector: "app-manpower-details",
  templateUrl: "./manpower-details.component.html",
  styleUrls: ["./manpower-details.component.scss"],
})
export class ManpowerDetailsComponent implements OnInit {
  @Input() manpowerEntity: any;
  showLineChart: boolean;
  showDummyChart: boolean;
  isDataReady: boolean;

  departments: any;
  selectedDepartments: any;
  selectedDepartmentIds: any;

  rangeOptions: any;
  selectedRange: any;
  rangeMap: any;
  rangeData: any;

  chartLineMax = 3;
  eLineChart: any;
  lineChartOptions: any;
  lineChartOptionsDummy: any;
  updateLineOptions: any;
  seriesDataIndexMap: any;
  userSettings: any;

  constructor(
    private dashboardService: StudioDashboardService,
    private departmentsService: DepartmentsService,
    private helperService: HelperService
  ) {}

  ngOnInit() {
    this.prepareData();
  }

  async prepareData() {
    await this.getUserSettings();
    await this.getDepartments();
  }

  rangeChangeHandler(e) {
    this.selectedRange = e;
    this.updateChart();
    this.saveSettings();
  }

  async saveSettings() {
    await this.getUserSettings();
    this.userSettings.dashboard[0].dateRangeTypeId = this.selectedRange;
    this.userSettings.dashboard[0].departmentIds = this.selectedDepartments.map(
      (item: any) => {
        return item.id;
      }
    );
    this.updateUserSettings();
  }

  /*openChangeHandler(isOpen) {
    if (!isOpen) {
      this.updateChart();
    } else {

    }

  }*/

  departmentChangeHandler(e) {
    this.selectedDepartments = e;
    this.updateChart();
    this.saveSettings();
  }

  updateUserSettings() {
    this.dashboardService
      .updateUsersettings(
        AppConstants.STUDIO_DASHBOARD_USER_SETTINGS_ID,
        this.userSettings
      )
      .toPromise()
      .then((resp: any) => {
        this.userSettings = resp;
      })
      .catch((error: any) => {});
  }

  onLineChartInit(ec) {
    this.eLineChart = ec;
  }

  onResize(event) {
    try {
      this.eLineChart.resize();
    } catch (e) {}
  }

  updateChart() {
    this.showLineChart = false;
    this.showDummyChart = true;
    this.resetOptions();
    let key = this.rangeMap[this.selectedRange];
    this.rangeData = this.manpowerEntity.data[key];
    if (this.eLineChart) {
      this.eLineChart.clear();
      this.eLineChart.dispose();
      this.eLineChart = null;
    }
    this.prepareChartInfo();
    setTimeout(() => {
      this.showLineChart = true;
      this.showDummyChart = false;
      if (this.eLineChart) {
        this.eLineChart.resize();
      }
    }, 10);
  }

  prepareChartInfo() {
    this.lineChartOptions.xAxis[0].data = null;
    this.lineChartOptions.series = [];
    this.updateLineOptions = {
      series: [],
    };
    const start = this.rangeData.startDate;
    let count = this.rangeData.days;
    //hariharan
    if (count < 0) {
      count = count * -1;
    }

    var date = new Date(start);
    const arr = [];
    for (let i = 0; i <= count; i++) {
      arr.push(this.helperService.transformDate(date, "yyyy-MM-dd"));
      date.setDate(date.getDate() + 1);
    }
    this.lineChartOptions.xAxis[0].data = arr;
    this.prepareSeriesInfo();
    this.processChartInfo();
  }

  prepareSeriesInfo() {
    this.seriesDataIndexMap = {};
    let seriesData = {};
    for (let i = 0; i < this.selectedDepartments.length; i++) {
      let key = this.selectedDepartments[i].departmentName;
      let colorCode = this.selectedDepartments[i].colorCode;
      this.seriesDataIndexMap[key] = i;
      seriesData[key] = this.getSeries(key, colorCode, "#323232");
      this.lineChartOptions.series.push(seriesData[key]);
    }
  }

  getSeries(type, color, bgcolor) {
    const seriesInfo = {
      name: type,
      type: "line",
      showSymbol: true,
      symbol: "circle",
      symbolSize: 5,
      data: this.prepareDummyData(),
      itemStyle: {
        color: "rgb(255,255,255)",
        borderColor: color,
      },
      lineStyle: {
        color: color,
        opacity: 1,
        width: 4,
      },
      areaStyle: {
        color: color,
        opacity: 0.1,
      },
      smooth: true,
      tooltip: {
        show: true,
        animation: false,
        backgroundColor: bgcolor,
        //backgroundColor: this.helperService.hexToRGB(color, 0.2),
        borderColor: color,
        borderWidth: 3,
        padding: 10,
        textStyle: {
          color: color,
          fontWeight: "bold",
        },
        formatter: function (params, ticket, callback) {
          let hours = 0;
          if (params.value) {
            hours = Math.round(params.value * 100) / 100;
          }
          return (
            "Department: " +
            params.seriesName +
            "<br/>" +
            "Average Hours Worked: " +
            hours
          );
        },
      },
    };
    return seriesInfo;
  }

  downloadImage() {
    //return;
    let _url = this.eLineChart.getDataURL({
      type: "png",
      pixelRatio: 2,
      backgroundColor: "#323232",
    });
    var link = document.createElement("a");
    link.href = _url;
    link.download = "Download.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  prepareDummyData() {
    const data = [];
    const len = this.lineChartOptions.xAxis[0].data.length;
    for (let i = 0; i < len; i++) {
      data.push(0);
    }
    return data;
  }

  processChartInfo() {
    if (!this.rangeData) {
      return;
    }
    if (!this.rangeData.data) {
      return;
    }
    let info;
    let dateIndex = -1;
    let charInfoArr = this.rangeData.data;
    for (let i = 0; i < charInfoArr.length; i++) {
      info = charInfoArr[i];
      dateIndex = this.getIndex(this.lineChartOptions.xAxis[0].data, info[0]);
      if (info[1] && !isNaN(this.seriesDataIndexMap[info[1]])) {
        this.lineChartOptions.series[this.seriesDataIndexMap[info[1]]].data[
          dateIndex
        ] = info[2];
      }
    }
  }

  getIndex(dataArr, str) {
    let index = -1;
    for (let i = 0; i < dataArr.length; i++) {
      if (str === dataArr[i]) {
        index = i;
        break;
      }
    }
    return index;
  }

  isValidArr(arr: any) {
    return this.helperService.isValidArr(arr);
  }

  async getUserSettings() {
    await this.dashboardService
      .getUsersettings()
      .toPromise()
      .then((resp: any) => {
        if (resp && resp.entity) {
          AppConstants.STUDIO_DASHBOARD_USER_SETTINGS_ID = resp.entity.id;
          this.userSettings = resp.entity;
        }
      })
      .catch((error: any) => {
        this.userSettings = null;
      });
  }

  async getDepartments() {
    await this.departmentsService
      .getDepartmentListSearch()
      .toPromise()
      .then((resp: any) => {
        this.departments = resp.entity;
        this.addColorCodes();
        this.isDataReady = true;
        this.initOptions();
        try {
          this.updateChart();
        } catch (e) {}
      })
      .catch((error: any) => {
        this.departments = [];
      });
  }

  addColorCodes() {
    let colorCodes = AppConstants.COLOR_PALETTE_CODES;
    for (let i = 0; i < this.departments.length; i++) {
      if (colorCodes[i]) {
        this.departments[i].colorCode = colorCodes[i];
      } else {
        this.departments[i].colorCode = colorCodes[0];
      }
    }
  }

  getShotDate(date: string) {
    return this.helperService.transformDate(date, "MM-dd");
  }

  initOptions() {
    if (this.userSettings) {
      let selectedDepartmentIds = this.userSettings.dashboard[0].departmentIds;
      this.selectedDepartments = [];
      if (this.isValidArr(selectedDepartmentIds)) {
        this.selectedDepartments = this.departments.filter((item: any) => {
          if (selectedDepartmentIds.includes(item.id)) {
            return item;
          }
        });
      }

      this.selectedRange = this.userSettings.dashboard[0].dateRangeTypeId;
    } else {
    }

    this.rangeMap = {
      1: "CURRENT_WEEK",
      2: "LAST_WEEK",
      3: "LAST_MONTH",
      4: "CURRENT_MONTH",
    };
    this.rangeOptions = [
      {
        label: "This Week",
        value: 1,
        value_: "ls",
      },
      {
        label: "Last Week",
        value: 2,
        value_: "lw",
      },
      {
        label: "Last Month",
        value: 3,
        value_: "tm",
      },
      {
        label: "This Month",
        value: 4,
        value_: "lm",
      },
    ];
    this.resetOptions();
  }

  resetOptions() {
    this.lineChartOptions = this.getDefaultOption();
    this.lineChartOptionsDummy = this.getDefaultOption();
  }

  getDefaultOption() {
    let ref = this;
    return {
      animation: true,
      tooltip: {
        trigger: "item",
        axisPointer: {
          type: "cross",
          crossStyle: {
            color: "#fff",
            type: "solid",
            width: 1,
            opacity: 0.5,
          },
          label: {
            show: false,
          },
        },
      },
      grid: {
        left: "2%",
        right: "4%",
        bottom: "2%",
        containLabel: true,
      },
      xAxis: [
        {
          name: "Date",
          //nameLocation: 'center',
          //nameGap: 0
          show: true,
          type: "category",
          boundaryGap: true,
          offset: 5,
          data: [],
          axisLine: {
            lineStyle: {
              color: "#fff",
              opacity: "0.1",
              //type: 'dashed',
            },
          },
          axisLabel: {
            showMinLabel: true,
            formatter: function (value, index) {
              let label = ref.getShotDate(value);
              if (label) {
                return label;
              }
              return value;
            },
          },
          axisTick: {
            show: false,
          },
          minorSplitLine: {
            show: false,
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: "#fff",
              opacity: 0.1,
            },
            interval: "auto",
          },
        },
      ],
      yAxis: [
        {
          name: "Hours",
          type: "value",
          axisLabel: {
            formatter: function (value, index) {
              if (index === 0) {
                return "";
              } else {
                //return `${(value * 10)} %`;
                return value;
              }
            },
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#fff",
              opacity: 0.1,
            },
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#fff",
              opacity: "0.1",
              //type: 'dashed'
            },
          },
        },
      ],
      series: [],
    };
  }
}
