import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { HrService } from "src/app/modules/system/dashboards/hr.service";
import { subYears, addYears } from "date-fns";

@Component({
  selector: "app-hr-kpi",
  templateUrl: "./hr-kpi.component.html",
  styleUrls: ["./hr-kpi.component.scss"],
})
export class HrKpiComponent implements OnInit {
  @Input() viewDate: any;
  @Output("dateChange") dateChange: EventEmitter<any> = new EventEmitter<any>();
  isDataReady: boolean;
  kpiInfo: any;
  count: any;
  max = 5;

  constructor(private hrService: HrService) {}

  ngOnInit() {
    //this.year = this.viewDate.getFullYear();
    this.count = 0;
    this.prepareData();
  }

  getHeight() {
    return "calc(100% - 41px)";
  }

  updateKPI(viewDate: any) {
    this.viewDate = viewDate;
    let currYear = new Date().getFullYear();
    let prevYear = this.viewDate.getFullYear();
    this.count = prevYear - currYear;
    this.prepareData();
  }

  async prepareData() {
    let year = this.viewDate.getFullYear();
    await this.hrService
      .getKPIInfo(year)
      .toPromise()
      .then((resp) => {
        this.kpiInfo = resp.entity;
      })
      .catch((error) => {
        this.kpiInfo = null;
      });
    this.isDataReady = true;
  }
  moveBack() {
    this.count--;
    this.viewDate = subYears(this.viewDate, 1);
    let event = {
      date: this.viewDate,
      isMonthChange: true,
    };
    this.dateChange.emit(event);
    //this.updateKPI(this.viewDate);
  }
  moveNext() {
    this.count++;
    this.viewDate = addYears(this.viewDate, 1);
    let event = {
      date: this.viewDate,
      isMonthChange: true,
    };
    this.dateChange.emit(event);
    //this.updateKPI(this.viewDate);
  }

  disabledPrev() {
    if (this.count <= -this.max) {
      return true;
    }
    return false;
  }
  disableNext() {
    if (this.count >= this.max) {
      return true;
    }
    return false;
  }
}
