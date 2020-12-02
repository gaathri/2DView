import { Component, OnInit, ViewChild } from "@angular/core";
import { WorklogService } from "src/app/modules/system/time-sheet/worklog.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { TaskLogPanelComponent } from "../task-log-panel/task-log-panel.component";
import { AppConstants } from "src/app/constants/AppConstants";
import { subDays } from "date-fns";
import { CalendarComponent } from "../calendar/calendar.component";

@Component({
  selector: "app-artist-time-sheet",
  templateUrl: "./artist-time-sheet.component.html",
  styleUrls: ["./artist-time-sheet.component.scss"],
})
export class ArtistTimeSheetComponent implements OnInit {
  @ViewChild(TaskLogPanelComponent, { static: false })
  taskLogPanelComponent: TaskLogPanelComponent;

  @ViewChild("appCalendar", { static: false }) appCalendar: CalendarComponent;

  isDataReady: boolean;
  events: any;
  workLogs: any;
  selectedDate: any;
  startDate: any;
  endDate: any;
  isRefresh: any;
  constructor(
    private worklogService: WorklogService,
    private helperService: HelperService
  ) {}

  ngOnInit() {
    this.selectedDate = new Date();
    this.prepareData(false);
  }

  async prepareData(isRefresh) {
    this.isRefresh = isRefresh;
    //this.isDataReady = false;
    let workLogLimit = AppConstants.WORK_LOG_LIMIT;
    let minDate = subDays(new Date(), workLogLimit);
    this.startDate = this.helperService.transformDate(minDate, "L/dd/yyyy");
    this.endDate = this.helperService.transformDate(new Date(), "L/dd/yyyy");
    //alert(this.startDate + " -- " + this.endDate);
    await this.getTimesheet();
    this.isDataReady = true;
  }

  async getTimesheet() {
    let month = this.helperService._getMonth(this.selectedDate);
    let year = this.helperService._getYear(this.selectedDate);
    await this.worklogService
      .getTimesheet(month, year, null)
      .toPromise()
      .then((resp) => {
        this.workLogs = resp.entity;
        this.frameEvents();
      })
      .catch((error) => {
        this.events = null;
      });
  }

  onDateChange(e: any) {
    console.log("onDateChange ", e);
    this.selectedDate = e.date;
    if (e.isMonthChange) {
      this.prepareData(true);
    }
    this.taskLogPanelComponent.prepareData(this.selectedDate);
  }

  onUpdateLog(e: any) {
    this.selectedDate = e;
    this.prepareData(true);
  }

  frameEvents() {
    this.events = [];
    if (this.workLogs && this.workLogs.length > 0) {
      for (let index = 0; index < this.workLogs.length; index++) {
        this.addLogEvent(
          this.workLogs[index].loggedDate,
          JSON.stringify(this.workLogs[index]),
          this.workLogs[index]
        );
      }
    }
    if (this.isRefresh) {
      this.appCalendar.refreshData(this.events);
    }
  }

  addLogEvent(_date: any, details: any, detailsJSON: any): void {
    //"{"loggedDate":"2020-06-30","hoursWorked":8}"
    let progress = Math.round(
      (detailsJSON.hoursWorked * 100) / AppConstants.HOURS_PER_DAY
    );
    let date = detailsJSON.loggedDate;
    let hours = detailsJSON.hoursWorked;
    this.events = [
      ...this.events,
      {
        date,
        hours,
        progress,
        title: details,
        start: new Date(_date),
        end: new Date(_date),
        draggable: false,
        resizable: {
          beforeStart: false,
          afterEnd: false,
        },
      },
    ];
  }

  /*setSelectedDate(date: any) {
    this.selectedDate = this.helperService.transformDate(date, 'yyyy-MM-dd');
  }*/
}
