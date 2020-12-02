import { Component, OnInit, Input } from "@angular/core";
import { HelperService } from "src/app/modules/core/services/helper.service";

@Component({
  selector: "app-chart-view",
  templateUrl: "./chart-view.component.html",
  styleUrls: ["./chart-view.component.scss"],
})
export class ChartViewComponent implements OnInit {
  @Input() progressData: any;
  /**Chart Variables START */
  statusName: any;
  statusValue: any;
  isDataReady: boolean;
  autoResize = true;
  ePieChart;
  options = {
    title: {
      text: "Progress Monitor",
      textStyle: {
        color: "#ffffff",
      },
      show: false,
    },
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} ({d}%)",
    },
    legend: {
      show: false,
    },
    series: [
      {
        name: "Status",
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
            /*textStyle: {
              fontSize: '20',
              fontWeight: 'bold',
              color: '#fff',
            },
            formatter: (params: any) => {
              return 'Status'
            }*/
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

  /**Chart Variables END */
  constructor(private helperService: HelperService) {}

  ngOnInit() {
    this.prepareChartData();
  }

  prepareChartData() {
    console.log(this.progressData);
    let completedPercentage = "0%";
    if (this.progressData.completedPercentage) {
      completedPercentage =
        Math.round(this.progressData.completedPercentage) + "%";
    }
    let workStatusCountDummy = [
      {
        name: "Not Started",
        code: "#F86292",
        value: 0,
        per: 0.0,
      },
      {
        name: "WIP",
        code: "#00B1FB",
        value: 0,
        per: 0.0,
      },
      {
        name: "Review",
        code: "#009688",
        value: 0,
        per: 0.0,
      },
      {
        name: "Feedback",
        code: "#576CBD",
        value: 0,
        per: 0.0,
      },
      {
        name: "Approved",
        code: "#00C293",
        value: 0,
        per: 0.0,
      },
      {
        name: "Invoiced",
        code: "#906E64",
        value: 0,
        per: 0.0,
      },
      {
        name: "Omit",
        code: "#EF5350",
        value: 0,
        per: 0.0,
      },
      {
        name: "On hold",
        code: "#FF902B",
        value: 0,
        per: 0.0,
      },
      {
        name: "Need Assistance",
        code: "#BE69C5",
        value: 0,
        per: 0.0,
      },
      {
        name: "Completed",
        code: "#4CAF50",
        value: 0,
        per: 0.0,
      },
    ];
    if (!this.progressData.workStatusCount) {
      this.progressData.workStatusCount = workStatusCountDummy;
    }
    if (
      this.progressData.workStatusCount &&
      this.progressData.workStatusCount.length > 0
    ) {
      this.options.series[0].data = this.progressData.workStatusCount;
      for (let i = 0; i < this.progressData.workStatusCount.length; i++) {
        if (this.progressData.workStatusCount[i].code) {
          this.options.series[0].data[i].itemStyle = {
            color: this.progressData.workStatusCount[i].code,
          };
          let corlorCode = this.progressData.workStatusCount[i].code;
          let corlorCodeWithOpacity = this.helperService.hexToRGB(
            corlorCode,
            0.9
          );
          this.options.series[0].data[i].tooltip = {
            backgroundColor: corlorCodeWithOpacity,
          };
          // if (i === 0) {
          //   this.options.series[0].data[i].selected = true;
          // }

          if (i === 0) {
            this.options.series[0].data[i].label = {
              normal: {
                show: true,
                position: "center",
                textStyle: {
                  fontSize: "20",
                  fontWeight: "bold",
                  color: "#fff",
                },
                formatter: (params: any) => {
                  return completedPercentage;
                },
              },
            };
          }
        }
      }
      this.isDataReady = true;
    } else {
      this.isDataReady = false;
    }
  }

  onPieChartInit = (ec) => {
    this.ePieChart = ec;
  };

  downloadImage() {
    //return;
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

  onChartEvent(event: any, type: string) {
    this.statusName = event.data.name;
    this.statusValue = event.data.value;
  }

  onResize(event) {
    try {
      if (this.ePieChart) {
        this.ePieChart.resize();
      }
    } catch (e) {}
  }
}
