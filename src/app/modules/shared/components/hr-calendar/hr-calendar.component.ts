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
  isFuture,
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
} from "date-fns";
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
  CalendarViewPeriod,
  CalendarMonthViewDay,
  CalendarDateFormatter,
} from "angular-calendar";
import { CustomDateFormatter } from "./custom-date-formatter.provider";

import { AppConstants } from "src/app/constants/AppConstants";
import { HelperService } from "src/app/modules/core/services/helper.service";

@Component({
  selector: "app-hr-calendar",
  templateUrl: "./hr-calendar.component.html",
  styleUrls: ["./hr-calendar.component.scss"],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
  ],
})
export class HrCalendarComponent implements OnInit {
  @Input("events") events: any;
  @Output("dateChange") dateChange: EventEmitter<any> = new EventEmitter<any>();

  CalendarView = CalendarView;
  @Input() viewDate: any; // = new Date();
  activeDayIsOpen: boolean = true;
  view: CalendarView | CalendarViewPeriod = CalendarView.Month;
  minDate: Date = subMonths(new Date(), 1);
  maxDate: Date = new Date();
  prevBtnDisabled: boolean = false;
  nextBtnDisabled: boolean = false;
  currentDate = new Date();
  weekendDays = [0, 6];

  constructor(private helperService: HelperService) {}

  ngOnInit() {
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    if (AppConstants.WEEK_ENDS) {
      this.weekendDays = [];
      days.map((item, index) => {
        if (AppConstants.WEEK_ENDS.includes(item)) {
          this.weekendDays.push(index);
        }
      });
    }
  }

  getWeekendDays() {
    return this.weekendDays;
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    this.viewDate = date;
    let event = {
      date: this.viewDate,
      isMonthChange: false,
    };
    this.dateChange.emit(event);
  }

  resetToday() {
    if (!isToday(this.viewDate)) {
      let prevMonth = this.helperService._getMonth(this.viewDate);
      let currMonth = this.helperService._getMonth(new Date());
      this.viewDate = new Date();
      let event = {
        date: this.viewDate,
        isMonthChange: currMonth != prevMonth,
      };
      this.dateChange.emit(event);
    }
  }

  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    body.forEach((day) => {
      if (!this.dateIsValid(day, day.date)) {
        day.cssClass = "cal-disabled";
      }
    });
  }

  dateIsValid(day: any, date: Date): boolean {
    if (day.isWeekend) {
      return false;
    }
    if (isSameMonth(date, new Date())) {
      return true;
      //return date >= this.minDate && date <= this.maxDate;
    }
    if (isFuture(date)) {
      return true;
    }
    return false;
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  closeOpenMonthViewDay() {
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
  getStatus(day: any) {
    return "empty";
  }

  disabledPrev() {
    /*if (isSameMonth(subDays(new Date(), 14), new Date())) {
      return true;
    }
    if (differenceInCalendarMonths(new Date(), this.viewDate) >= 1) {
      return true;
    }*/
    return false;
  }
  disableNext() {
    /*if (isToday(this.viewDate)) {
      return true;
    }
    if (isSameMonth(this.viewDate, new Date())) {
      return true;
    }*/
    return false;
  }
}
