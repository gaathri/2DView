import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  Injectable,
} from "@angular/core";
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
  subWeeks,
  addWeeks,
  addMonths,
  subMonths,
  startOfWeek,
  startOfMonth,
  endOfWeek,
  isToday,
  differenceInCalendarMonths,
  isFuture,
  isBefore,
  isAfter,
} from "date-fns";
import { Subject } from "rxjs";
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
  CalendarViewPeriod,
  CalendarMonthViewDay,
} from "angular-calendar";
import { RolesService } from "src/app/modules/system/configs/roles.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { HelperService } from "src/app/modules/core/services/helper.service";
/*
type CalendarPeriod = 'day' | 'week' | 'month';

function addPeriod(period: CalendarPeriod, date: Date, amount: number): Date {
  return {
    day: addDays,
    week: addWeeks,
    month: addMonths
  }[period](date, amount);
}

function subPeriod(period: CalendarPeriod, date: Date, amount: number): Date {
  return {
    day: subDays,
    week: subWeeks,
    month: subMonths
  }[period](date, amount);
}

function startOfPeriod(period: CalendarPeriod, date: Date): Date {
  return {
    day: startOfDay,
    week: startOfWeek,
    month: startOfMonth
  }[period](date);
}

function endOfPeriod(period: CalendarPeriod, date: Date): Date {
  return {
    day: endOfDay,
    week: endOfWeek,
    month: endOfMonth
  }[period](date);
}
*/

@Component({
  selector: "app-calendar-view",
  templateUrl: "./calendar-view.component.html",
  styleUrls: ["./calendar-view.component.scss"],
})
export class CalendarViewComponent implements OnInit {
  @Input("allowUserSearch") allowUserSearch: any;
  @Input("events") events: any;
  @Output("dateChange") dateChange: EventEmitter<any> = new EventEmitter<any>();
  @Output("userSelect") userSelect: EventEmitter<any> = new EventEmitter<any>();
  @Output("userClose") userClose: EventEmitter<any> = new EventEmitter<any>();

  CalendarView = CalendarView;
  viewDate: Date = new Date();
  //events: CalendarEvent[] = [];
  activeDayIsOpen: boolean = true;
  view: CalendarView | CalendarViewPeriod = CalendarView.Month;

  workLogLimit: any;

  minDate: Date;
  maxDate: Date = new Date();
  prevBtnDisabled: boolean = false;
  nextBtnDisabled: boolean = false;
  users: any;
  user: any;
  isUserSelected: boolean;

  constructor(
    private rolesService: RolesService,
    private helperService: HelperService
  ) {}

  ngOnInit() {
    let thisMonthEndDate = endOfMonth(new Date());
    let last1Month = subMonths(thisMonthEndDate, 2);
    this.minDate = last1Month;
    this.workLogLimit = AppConstants.WORK_LOG_LIMIT;
    this.minDate = subDays(new Date(), this.workLogLimit);

    if (this.allowUserSearch) {
      this.getUsersByPrivilege(AppConstants.ARTIST_PRIVILEGE_ID);
    } else {
      this.isUserSelected = true;
    }
  }

  async getUsersByPrivilege(privilegeId: any) {
    await this.rolesService
      .getUsersByPrivilege(privilegeId)
      .toPromise()
      .then((resp: any) => {
        this.users = resp.entity;
      })
      .catch((error: any) => {
        this.users = [];
      });
  }

  userChangeHandler(e) {
    this.user = e;
    this.userSelect.emit(this.user);
    this.isUserSelected = true;
  }

  getAvatarInfo(user: any) {
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      thumbnail: user.thumbnail,
      size: "large",
    };
  }

  getUserName(user) {
    let name = "";
    if (user.firstName) {
      name += user.firstName + " ";
    }
    if (user.lastName) {
      name += user.lastName;
    }
    return name;
  }

  closeUser() {
    this.isUserSelected = false;
    this.user = null;
    this.userClose.emit(null);
  }

  isValidArr(users: any) {
    return this.helperService.isValidArr(users);
  }

  /*frameEvents() {
    if (this.workLogs && this.workLogs.length > 0) {
      for (let index = 0; index < this.workLogs.length; index++) {
        this.addLogEvent(this.workLogs[index].loggedDate, JSON.stringify(this.workLogs[index]));
      }
    }
  }*/

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    this.viewDate = date;
    let event = {
      date: this.viewDate,
      isMonthChange: false,
    };
    this.dateChange.emit(event);
  }

  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    body.forEach((day) => {
      if (!this.dateIsValid(day.date)) {
        day.cssClass = "cal-disabled";
      }
    });
  }

  dateIsValid(date: Date): boolean {
    if (isSameMonth(date, this.viewDate)) {
      if (isSameDay(date, this.minDate)) {
        return true;
      }
      if (
        isAfter(date, this.minDate) &&
        isBefore(date, this.maxDate) /**date <= this.maxDate */
      ) {
        return true;
      }
      //return date >= this.minDate && date <= this.maxDate;
    }
    return false;
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  closeOpenMonthViewDay() {
    if (isFuture(this.viewDate)) {
      this.viewDate = new Date();
    } else if (isBefore(this.viewDate, this.minDate)) {
      this.viewDate = this.minDate;
    }
    this.activeDayIsOpen = false;
    let event = {
      date: this.viewDate,
      isMonthChange: true,
    };
    this.dateChange.emit(event);
  }

  getTitle(day) {
    if (day && day.events && day.events.length > 0) {
      return day.events[0].title;
    } else {
      return "no event";
    }
  }

  isSelected(day: any) {
    return isSameDay(this.viewDate, day.date);
  }

  isClickable(day: any) {
    if (day && day.cssClass && day.cssClass == "cal-disabled") {
      return false;
    }
    return true;
  }

  getHours(day: any) {
    // if (day && day.events && day.events.length > 0) {
    //   let logEvent = JSON.parse(day.events[0].title);
    //   if (logEvent.hoursWorked) {
    //     return `0${logEvent.hoursWorked} hrs`;
    //   }
    // }
    // return '00 hrs';
    if (day && day.events && day.events.length > 0) {
      let logEvent = JSON.parse(day.events[0].title);
      if (logEvent.hoursWorked) {
        return logEvent.hoursWorked;
        //return `0${logEvent.hoursWorked} hrs`;
      }
    }
    return 0;
  }

  getPercent(day: any) {
    if (day && day.events && day.events.length > 0) {
      let logEvent = JSON.parse(day.events[0].title);
      if (logEvent.completionPercentage) {
        return `${logEvent.completionPercentage} %`;
      }
    }
    return "0 %";
  }

  getLoggedPercent(day: any) {
    /*if (day && day.events && day.events.length > 0) {
      let logEvent = JSON.parse(day.events[0].title);
      if (logEvent.hoursWorked) {
        return Math.round(logEvent.hoursWorked * 100 / AppConstants.HOURS_PER_DAY);
      }
    }
    return '0 %';*/
    return Math.round((this.getHours(day) * 100) / AppConstants.HOURS_PER_DAY);
  }

  getOverallPercent(day: any) {
    if (day && day.events && day.events.length > 0) {
      let logEvent = JSON.parse(day.events[0].title);
      if (logEvent.overAllPer) {
        return `${logEvent.overAllPer} %`;
      }
    }
    return "0 %";
  }

  getStatus(day: any) {
    if (day && day.cssClass && day.cssClass == "cal-disabled") {
      return "cell-na";
    }
    if (day && day.events && day.events.length > 0) {
      let logEvent = JSON.parse(day.events[0].title);
      if (!this.isUserSelected) {
        if (logEvent.overAllPer) {
          if (logEvent.overAllPer == 100) {
            return "full";
          } else if (logEvent.overAllPer > 0 && logEvent.overAllPer < 100) {
            return "partial";
          }
        }
      } else {
        if (logEvent.hoursWorked) {
          if (logEvent.hoursWorked == 8) {
            return "full";
          } else if (logEvent.hoursWorked > 0 && logEvent.hoursWorked < 8) {
            return "partial";
          }
        }
      }
    }
    return "empty";
  }

  disabledPrev() {
    /*if (isSameMonth(subDays(new Date(), 14), new Date())) {
      return true;
    }
    if (differenceInCalendarMonths(new Date(), this.viewDate) >= 1) {
      return true;
    }*/
    if (isSameMonth(this.minDate, this.viewDate)) {
      return true;
    }
    return false;
  }
  disableNext() {
    if (isToday(this.viewDate)) {
      return true;
    }
    if (isSameMonth(this.viewDate, new Date())) {
      return true;
    }
    return false;
  }
}
