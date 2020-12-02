import { Component, OnInit, Input } from "@angular/core";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { DecimalPipe } from "@angular/common";

@Component({
  selector: "app-report-chart",
  templateUrl: "./report-chart.component.html",
  styleUrls: ["./report-chart.component.scss"],
})
export class ReportChartComponent implements OnInit {
  @Input() chartData: any;
  @Input() barChartData: any;
  @Input() chartHeight: any;
  @Input() chartWidth: any;
  isDataReady: boolean;
  isBar: boolean;
  ePieChart;
  eBarChart;
  options = {
    title: {
      text: "Artist Availability",
      textStyle: {
        color: "#ffffff",
      },
      show: false,
      textAlign: "center",
      textVerticalAlign: "middle",
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
    },
    legend: {
      show: false,
    },
    series: [
      {
        name: "Tasks",
        type: "pie",
        radius: ["50%", "70%"],
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: false,
            position: "center",
          },
          emphasis: {
            show: false,
            label: {
              show: false,
            },
          },
        },
        labelLine: {
          normal: {
            show: false,
          },
        },
        data: [],
      },
    ],
  };

  barOptions = {
    xAxis: {
      type: "category",
      data: [],
      axisLine: {
        lineStyle: {
          color: "#fff",
        },
      },
    },
    yAxis: {
      type: "value",
      axisLine: {
        lineStyle: {
          color: "#fff",
        },
      },
    },
    series: [
      {
        data: [],
        type: "bar",
        barGap: 0,
        itemStyle: {
          color: "#5cc7ff",
        },
      },
    ],
  };

  constructor(
    private helperService: HelperService,
    private decimalPipe: DecimalPipe
  ) {}

  ngOnInit() {
    this.prepareChartData();
    this.prepareBarChartData();
  }

  getChartHeight() {
    return this.chartHeight - 40;
  }

  getChartWidth() {
    return this.chartWidth;
  }

  prepareBarChartData() {
    if (this.barChartData) {
      for (var i in this.barChartData) {
        this.barOptions.xAxis.data.push(i);
        this.barOptions.series[0].data.push(this.barChartData[i]);
      }
    }
  }

  prepareChartData() {
    if (!this.helperService.isValidArr(this.chartData)) {
      return;
    }
    const totalTasks = this.chartData.reduce(
      (prev: any, next: any) => prev + next.value,
      0
    );
    this.options.series[0].data = this.chartData;
    for (let i = 0; i < this.chartData.length; i++) {
      let corlorCode = "";
      //this.getColorCode(i);
      if (this.chartData[i] && this.chartData[i].code) {
        corlorCode = this.chartData[i].code;
      } else {
        corlorCode = this.getColorCode(i);
      }
      this.options.series[0].data[i].itemStyle = {
        color: corlorCode,
      };

      let corlorCodeWithOpacity = this.helperService.hexToRGB(corlorCode, 0.9);
      this.options.series[0].data[i].tooltip = {
        backgroundColor: corlorCodeWithOpacity,
      };

      /*if (i === 0) {
        this.options.series[0].data[i].label = {
          normal: {
            show: true,
            position: "center",
            textStyle: {
              fontSize: "14",
              fontWeight: "bold",
              color: "#fff"
            },
            formatter: (params: any) => {
              return 'Total Tasks\n\n' + this.decimalPipe.transform(totalTasks);
            }
          }
        };
      }*/
    }
    this.isDataReady = true;
  }

  hexToRGB(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);
    if (alpha) {
      return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
      return "rgb(" + r + ", " + g + ", " + b + ")";
    }
  }

  getColorCode(index) {
    return AppConstants.COLOR_PALETTE_CODES[index];
  }

  onPieChartInit = (ec) => {
    this.ePieChart = ec;
  };

  onBarChartInit = (ec) => {
    this.eBarChart = ec;
  };

  downloadImage() {
    return;
    let _url = this.ePieChart.getDataURL({
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

  onChartEvent(event: any, type: string) {}

  onResize(event) {
    try {
      if (this.ePieChart) {
        this.ePieChart.resize();
      }
      if (this.eBarChart) {
        this.eBarChart.resize();
      }
    } catch (e) {}
  }
}
