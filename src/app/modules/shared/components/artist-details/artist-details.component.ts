import { Component, OnInit, Input } from '@angular/core';
import { HelperService } from 'src/app/modules/core/services/helper.service';

@Component({
  selector: 'app-artist-details',
  templateUrl: './artist-details.component.html',
  styleUrls: ['./artist-details.component.scss']
})
export class ArtistDetailsComponent implements OnInit {

  @Input() artistAvailability: any;
  isDataReady: boolean;
  ePieChart;
  options = {
    title: {
      text: "Artist Availability",
      textStyle: {
        color: "#ffffff"
      },
      show: false
    },
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} ({d}%)"
    },
    legend: {
      show: false
    },
    series: [
      {
        name: "Availability",
        type: "pie",
        radius: ["50%", "70%"],
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: false,
            position: "center"
          },
          emphasis: {
            show: false
            /*textStyle: {
              fontSize: '20',
              fontWeight: 'bold',
              color: '#fff',
            },
            formatter: (params: any) => {
              return 'Status'
            }*/
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
        data: []
      }
    ]
  };

  constructor(
    private helperService: HelperService
  ) { }

  ngOnInit() {
    this.prepareChartData();
  }

  prepareChartData() {
    let completedPercentage = "0%";
    //this.artistAvailability = { "available": 100, "occupied": 25, "leave": 50, "availablityPer": 100.0 };
    if (this.artistAvailability.availablityPer) {
      completedPercentage =
        Math.round(this.artistAvailability.availablityPer) + "%";
    }

    let colorCode = {
      available: "#00c293",
      occupied: "#00b1fb",
      leave: "#ff902b",
    }

    let availabilityCount = [
      {
        name: "Available",
        code: "#00c293",
        value: (this.artistAvailability.available) ? this.artistAvailability.available : 0,
        per: 0.0
      },
      {
        name: "Occupied",
        code: "#00b1fb",
        value: (this.artistAvailability.occupied) ? this.artistAvailability.occupied : 0,
        per: 0.0
      },
      {
        name: "Leave",
        code: "#ff902b",
        value: (this.artistAvailability.leave) ? this.artistAvailability.leave : 0,
        per: 0.0
      }
    ];

    this.options.series[0].data = availabilityCount;
    for (let i = 0; i < availabilityCount.length; i++) {
      if (availabilityCount[i].code) {
        this.options.series[0].data[i].itemStyle = {
          color: availabilityCount[i].code
        };
        let corlorCode = availabilityCount[i].code;
        let corlorCodeWithOpacity = this.helperService.hexToRGB(corlorCode, 0.9);
        this.options.series[0].data[i].tooltip = {
          backgroundColor: corlorCodeWithOpacity
        };

        if (i === 0) {
          this.options.series[0].data[i].label = {
            normal: {
              show: true,
              position: "center",
              textStyle: {
                fontSize: "20",
                fontWeight: "bold",
                color: "#fff"
              },
              formatter: (params: any) => {
                return completedPercentage;
              }
            }
          };
        }
      }
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

  onPieChartInit = ec => {
    this.ePieChart = ec;
  };

  downloadImage() {
    return;
    let _url = this.ePieChart.getDataURL({
      type: 'png',
      pixelRatio: 2,
      backgroundColor: '#323232',
    });
    var link = document.createElement('a');
    link.href = _url;
    link.download = 'Download.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  onChartEvent(event: any, type: string) {
  }

  onResize(event) {
    try {
      if (this.ePieChart) {
        this.ePieChart.resize();
      }
    } catch (e) { }
  }

}
