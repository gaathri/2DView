import { Component, OnInit, ViewChild } from "@angular/core";
import { TaskLogPanelComponent } from "../task-log-panel/task-log-panel.component";
import { WorklogService } from "src/app/modules/system/time-sheet/worklog.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { ArtistTableViewComponent } from "../artist-table-view/artist-table-view.component";
import { AppConstants } from "src/app/constants/AppConstants";
import { subDays } from "date-fns";
import { CalendarComponent } from "../calendar/calendar.component";

@Component({
  selector: "app-studio-time-sheet",
  templateUrl: "./studio-time-sheet.component.html",
  styleUrls: ["./studio-time-sheet.component.scss"],
})
export class StudioTimeSheetComponent implements OnInit {
  @ViewChild(TaskLogPanelComponent, { static: false })
  taskLogPanelComponent: TaskLogPanelComponent;
  @ViewChild(ArtistTableViewComponent, { static: false })
  artistTableViewComponent: ArtistTableViewComponent;
  @ViewChild("appCalendar", { static: false }) appCalendar: CalendarComponent;
  isDataReady: boolean;
  isTableView: boolean = true;
  events: any;
  workLogs: any;
  selectedDate: any;
  userId: any;
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
    await this.getTimesheet();
    this.isDataReady = true;
  }

  async getTimesheet() {
    let month = this.helperService._getMonth(this.selectedDate);
    let year = this.helperService._getYear(this.selectedDate);
    await this.worklogService
      .getTimesheet(month, year, this.userId)
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
    this.selectedDate = e.date;
    if (e.isMonthChange) {
      this.prepareData(true);
    }
    if (this.isTableView) {
      this.artistTableViewComponent.updatePage(this.selectedDate);
    } else {
      this.taskLogPanelComponent.prepareData(this.selectedDate);
    }
  }

  onUserSelect(e: any) {
    this.isTableView = false;
    this.userId = e.id;
    this.prepareData(true);
  }

  onUserClose(e: any) {
    this.isTableView = true;
    this.userId = null;
    this.prepareData(true);
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
    let progress = null;
    if (detailsJSON.overAllPer) {
      progress = detailsJSON.overAllPer;
    } else {
      progress = Math.round(
        (detailsJSON.hoursWorked * 100) / AppConstants.HOURS_PER_DAY
      );
    }
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
}
