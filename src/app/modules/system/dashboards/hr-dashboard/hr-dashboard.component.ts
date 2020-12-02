import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { HolidayListComponent } from "src/app/modules/shared/components/holiday-list/holiday-list.component";
import { HrKpiComponent } from "src/app/modules/shared/components/hr-kpi/hr-kpi.component";

@Component({
  selector: "app-hr-dashboard",
  templateUrl: "./hr-dashboard.component.html",
  styleUrls: ["./hr-dashboard.component.scss"],
})
export class HrDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild(HolidayListComponent, { static: false })
  holidayListComponent: HolidayListComponent;
  @ViewChild(HrKpiComponent, { static: false }) hrKpiComponent: HrKpiComponent;

  containerHeight: any;
  viewDate: any;

  constructor() {}

  ngOnInit() {
    this.viewDate = new Date();
  }

  ngAfterViewInit(): void {
    this.getBoxHeight();
  }

  onListChange(e: any) {
    if (e) {
      let currYear = e.date.getFullYear();
      let prevYear = this.viewDate.getFullYear();
      if (currYear == prevYear) {
        this.viewDate = e.date;
        this.hrKpiComponent.updateKPI(this.viewDate);
      }
    }
  }

  onDateChange(e: any) {
    if (e) {
      let currYear = e.date.getFullYear();
      let prevYear = this.viewDate.getFullYear();
      if (currYear != prevYear) {
        this.viewDate = e.date;
        this.hrKpiComponent.updateKPI(this.viewDate);
        this.holidayListComponent.updateTable(this.viewDate);
      }
      if (e.isMonthChange === false) {
        this.holidayListComponent.onDateSelect(e.date);
      }
    }
  }

  onResize() {
    this.getBoxHeight();
  }

  getBoxHeight() {
    if (document.getElementsByClassName("hr-cal")[0]) {
      setTimeout(() => {
        let boxContainerHeight = document.getElementsByClassName("hr-cal")[0]
          .clientHeight;
        this.containerHeight = boxContainerHeight;
      }, 100);
    }
  }

  getHeight() {
    return this.containerHeight + "px";
  }
}
