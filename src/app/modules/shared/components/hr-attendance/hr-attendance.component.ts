import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from "@angular/core";
import {
  differenceInCalendarMonths,
  eachDayOfInterval,
  endOfMonth,
  startOfMonth,
  addMonths,
  format,
  isToday,
  isFuture,
  isBefore,
  subYears,
  addYears,
} from "date-fns";
import { AppConstants } from "src/app/constants/AppConstants";
import { RolesService } from "src/app/modules/system/configs/roles.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { HrService } from "src/app/modules/system/dashboards/hr.service";
import { OverallLeaveListComponent } from "../overall-leave-list/overall-leave-list.component";
import { UserLeaveListComponent } from "../user-leave-list/user-leave-list.component";

@Component({
  selector: "app-hr-attendance",
  templateUrl: "./hr-attendance.component.html",
  styleUrls: ["./hr-attendance.component.scss"],
})
export class HrAttendanceComponent implements OnInit {
  @ViewChild(OverallLeaveListComponent, { static: false })
  overallLeaveListComponent: OverallLeaveListComponent;
  @ViewChild(UserLeaveListComponent, { static: false })
  userLeaveListComponent: UserLeaveListComponent;

  formattedMonthArray = [];
  monthArray = [];
  currentMonthIndex = 0;
  monthNavIndex = 0;
  clickedDayIndex = -1;
  startDay = 0;
  endDay = 0;
  startMonth = 0;
  endMonth = 0;
  startYear = 0;
  endYear = 0;
  givenMonthDifference = 0;
  givenYearArray = [];

  //@Input("startDate") startDate: string;
  //@Input("endDate") endDate: string;
  @Input("isArtistView") isArtistView: boolean;
  @Input("debug") debug: boolean;
  @Input("data") data: [any];
  @Output() dateChange = new EventEmitter<any>();
  @Output("userClose") userClose: EventEmitter<any> = new EventEmitter<any>();
  @Output("userSelect") userSelect: EventEmitter<any> = new EventEmitter<any>();
  startDate = "08/20/2019";
  endDate = "08/20/2021";

  users: any;
  user: any;
  allowUserSearch: boolean = true;
  isUserSelected: boolean;
  viewDate: any = new Date();
  holidayList = [];
  holidayDates = [];
  leaveDates = [];
  leaveInfo: any;

  constructor(
    private rolesService: RolesService,
    private hrService: HrService,
    private helperService: HelperService
  ) {}

  ngOnInit() {
    let today = new Date();
    this.startDate = this.helperService.transformDate(
      subYears(today, 1),
      "L/dd/yyyy"
    );
    this.endDate = this.helperService.transformDate(
      addYears(today, 1),
      "L/dd/yyyy"
    );
    this.prepareData();
  }

  async prepareData() {
    if (this.allowUserSearch) {
      await this.getUsersByPrivilege(AppConstants.ARTIST_PRIVILEGE_ID);
      await this.getLeaveInfo(false);
    } else {
      this.isUserSelected = true;
    }

    //await this.getHolidayTableList(this.viewDate);
    this.populateCalendar();
  }

  populateCalendar() {
    this.parseGivenDates();
    this.populateMonthArray();
    this.formulateMonthArray();
    this.updateData();
  }

  parseGivenDates() {
    var startDateString = format(new Date(this.startDate), "dd-LL-yyyy");
    this.startDay = parseInt(startDateString.split("-")[0], 10);
    this.startMonth = parseInt(startDateString.split("-")[1], 10);
    this.startYear = parseInt(startDateString.split("-")[2], 10);
    this.log(
      "Given Start day : " +
        this.startDay +
        "-" +
        this.startMonth +
        "-" +
        this.startYear
    );

    var endDateString = format(new Date(this.endDate), "dd-LL-yyyy");
    this.endDay = parseInt(endDateString.split("-")[0], 10);
    this.endMonth = parseInt(endDateString.split("-")[1], 10);
    this.endYear = parseInt(endDateString.split("-")[2], 10);
    this.log(
      "Given End day : " +
        this.endDay +
        "-" +
        this.endMonth +
        "-" +
        this.endYear
    );

    var tempStartYear = this.startYear;
    while (tempStartYear <= this.endYear) {
      this.givenYearArray.push(tempStartYear);
      ++tempStartYear;
    }
    this.log(
      "Given year : " +
        this.givenYearArray.map((year) => {
          return year;
        })
    );
  }

  populateMonthArray() {
    var givenStartMonthStartDate = startOfMonth(new Date(this.startDate));
    this.givenMonthDifference = differenceInCalendarMonths(
      new Date(this.endDate),
      new Date(this.startDate)
    );
    var currentMonth = givenStartMonthStartDate;
    for (var i = 1; i < this.startMonth; ++i) {
      this.monthArray.push(null);
    }
    for (var i = 0; i <= this.givenMonthDifference; ++i) {
      this.monthArray.push(
        eachDayOfInterval({
          start: new Date(currentMonth),
          end: new Date(endOfMonth(new Date(currentMonth))),
        })
      );
      currentMonth = addMonths(givenStartMonthStartDate, i + 1);
    }
    for (var i = this.endMonth; i < 12; ++i) {
      this.monthArray.push(null);
    }
    //this.log("populateMonthArray : " + this.monthArray);
  }

  formulateMonthArray() {
    this.monthArray.forEach((month, monthIndex) => {
      if (month === null) {
        this.formattedMonthArray.push(null);
      } else {
        var monthObj = new CustomMonth();
        var runOnce = false;
        month.forEach((date, dateIndex) => {
          if (!runOnce) {
            var monthStr = format(new Date(date), "LL-LLLL-yyyy");
            monthObj.monthNumber = parseInt(monthStr.split("-")[0], 10);
            monthObj.monthName = monthStr.split("-")[1];
            monthObj.year = monthStr.split("-")[2];
            runOnce = true;
          }
          var dateObj = new CustomDate();
          var dateStr = format(new Date(date), "dd-iii");

          dateObj.day = dateStr.split("-")[0];
          dateObj.weekday = dateStr.split("-")[1];
          dateObj.weekdayFull = format(new Date(date), "EEEE");
          dateObj.date = date;
          if (isToday(new Date(date))) {
            dateObj.isToday = true;
            this.clickedDayIndex = dateIndex;
            this.monthNavIndex = this.currentMonthIndex = monthIndex;
          } else {
            dateObj.isToday = false;
          }

          if (this.isDayOff(dateObj)) {
            dateObj.enabled = false;
          } else if (
            monthIndex === this.startMonth - 1 &&
            dateIndex < this.startDay - 1
          ) {
            dateObj.enabled = false;
          } else if (
            monthIndex + 1 === this.startMonth + this.givenMonthDifference &&
            dateIndex > this.endDay - 1
          ) {
            dateObj.enabled = false;
          } else {
            dateObj.enabled = true;
          }

          dateObj.progress = 0;
          dateObj.overAllPer = 100;
          dateObj.offType = "";
          monthObj.date.push(JSON.parse(JSON.stringify(dateObj)));
        });
        this.formattedMonthArray.push(monthObj);
      }
    });
    this.log("populateMonthArray : ");
    //console.log(this.formattedMonthArray);
  }

  getBottomClass(_day) {
    /*return _day.enabled === false || this.isDayOff(_day)
      ? "cell-na"
      : this.isWeekendOrHoliday(_day)
      ? "weekend"
      : _day.progress === 100
      ? "full"
      : _day.progress > 0
      ? "partial"
      : "empty";*/
    let c = "";
    if (this.isWeekendOrHoliday(_day)) {
      c = "weekend ";
    }
    if (_day.enabled === false || this.isDayOff(_day)) {
      c += "cell-na";
    } else {
      if (!this.isWeekendOrHoliday(_day)) {
        if (_day.progress === 100) {
          c += "full";
        } else if (_day.progress > 0) {
          c += "partial";
        } else {
          c += "empty";
        }
      }
    }
    return c;

    /*if (this.isWeekendOrHoliday(_day)) {
      if (_day.enabled === false || this.isDayOff(_day)) {
        return "cell-na weekend";
      }
      return "weekend";
    } else {
      if (_day.progress === 100) {
        return "full";
      } else if (_day.progress > 0) {
        return "partial";
      } else {
        return "empty";
      }
    }

    return "";*/
  }

  isDayOff(day: any) {
    let weekdayFull = day.weekdayFull;
    let dateStr = this.helperService.transformDate(
      new Date(day.date),
      "yyyy-MM-dd"
    );
    /*if (isFuture(new Date(day.date))) {
      return false;
    }*/

    /*if (isBefore(new Date(day.date), new Date(this.startDate))) {
      return false;
    }*/

    //console.log(this.holidayDates.includes(dateStr) + " - " + dateStr);
    if (AppConstants.WEEK_ENDS.includes(weekdayFull)) {
      day.label = "Weekend";
      return true;
    } else if (this.holidayDates.includes(dateStr)) {
      day.label = "Holiday";
      return true;
    } else if (this.leaveDates.includes(dateStr)) {
      day.label = "Leave";
      return true;
    } else if (day.offType && day.offType != "") {
      return true;
    }
    return false;
  }

  isWeekendOrHoliday(day: any) {
    let weekdayFull = day.weekdayFull;
    let dateStr = this.helperService.transformDate(
      new Date(day.date),
      "yyyy-MM-dd"
    );
    if (AppConstants.WEEK_ENDS.includes(weekdayFull)) {
      day.label = "Weekend";
      return true;
    } else if (this.holidayDates.includes(dateStr)) {
      day.label = "Holiday";
      return true;
    }
    return false;
  }

  updateData() {
    this.data.forEach((element) => {
      if (element && element.appliedDate) {
        var formatedString = format(
          new Date(element.appliedDate),
          "dd-LL-yyyy"
        );
        var _year = parseInt(formatedString.split("-")[2]);
        var _month = parseInt(formatedString.split("-")[1]);
        var _day = parseInt(formatedString.split("-")[0]);
        var _yearIndex = this.givenYearArray.indexOf(_year);
        if (_yearIndex > -1) {
          var _monthIndex = _month - 1 + _yearIndex * 12;
          if (this.formattedMonthArray[_monthIndex] !== null) {
            this.formattedMonthArray[_monthIndex].date[_day - 1].progress =
              element.progress;
            this.formattedMonthArray[_monthIndex].date[
              _day - 1
            ].overAllPer = 100;
            if (element.hasOwnProperty("overAllPer")) {
              this.formattedMonthArray[_monthIndex].date[_day - 1].overAllPer =
                element.overAllPer;
            }

            this.formattedMonthArray[_monthIndex].date[_day - 1].offType = "";

            if (element.hasOwnProperty("offType")) {
              this.formattedMonthArray[_monthIndex].date[_day - 1].offType =
                element.offType;
            }
          }
          this.log(
            "Update Data - Year found : " +
              _year +
              ", data updated for " +
              formatedString
          );
        } else {
          this.log(
            "Update Data - Year not found : " +
              _year +
              ", not updating the data for " +
              formatedString
          );
        }
      }
    });
  }

  dayClick(dayIndex, day) {
    if (this.isDayOff(day)) {
      return false;
    }
    if (!this.formattedMonthArray[this.monthNavIndex].date[dayIndex].enabled) {
      return false;
    }
    //console.log(this.formattedMonthArray[this.monthNavIndex].date[dayIndex]);
    this.clickedDayIndex = dayIndex;
    this.log("Day clicked");
    this.sendDateChangeEvent("day_clicked");
  }

  sendDateChangeEvent(str) {
    let isMonthChange = true;
    if (str === "day_clicked") {
      isMonthChange = false;
    }
    var obj = {
      dateStr: "",
      action: "",
      day: "",
      month: "",
      year: "",
      isMonthChange,
      date: null,
    };
    var dateStr =
      this.formattedMonthArray[this.monthNavIndex].year +
      "-" +
      this.formattedMonthArray[this.monthNavIndex].monthNumber +
      "-" +
      this.formattedMonthArray[this.monthNavIndex].date[this.clickedDayIndex]
        .day;
    obj.dateStr = dateStr;
    obj.date = new Date(dateStr);
    obj.action = str;
    obj.day = this.formattedMonthArray[this.monthNavIndex].date[
      this.clickedDayIndex
    ].day;
    obj.month = this.formattedMonthArray[this.monthNavIndex].monthNumber;
    obj.year = this.formattedMonthArray[this.monthNavIndex].year;
    this.viewDate = obj.date;

    if (isMonthChange) {
      this.getHolidayTableList(this.viewDate);
      if (this.isUserSelected) {
        if (this.user && this.user.id) {
          this.getLeaveInfoByArtist(this.user.id);
          this.userLeaveListComponent.updateTable(this.viewDate);
        }
      } else {
        this.getLeaveInfo(true);
      }
    }

    if (this.isUserSelected) {
    } else {
      this.overallLeaveListComponent.updateTable(this.viewDate);
    }
    this.dateChange.emit(obj);
  }

  async getHolidayTableList(date) {
    let page = {
      pageNumber: "",
      size: "",
      search: "",
      sortBy: "",
      orderBy: "",
    };
    let year = date.getFullYear();
    this.holidayDates = [];
    await this.hrService
      .getHolidayTableList(page, year)
      .toPromise()
      .then((resp) => {
        this.holidayList = resp.coll;
        this.holidayList.map((item) => {
          //this.holidayDates.push(item.leaveDate);
        });
      })
      .catch((error) => {
        this.holidayList = null;
      });
  }

  async getLeaveInfo(isRefresh: boolean) {
    let m = this.helperService._getMonth(this.viewDate);
    let y = this.viewDate.getFullYear();
    this.leaveDates = [];
    let userId = this.helperService.loginInfo.id;
    await this.hrService
      .getLeaveInfo(m, y)
      .toPromise()
      .then((resp: any) => {
        //let respStr = `{"entity":[{"appliedDate":"2020-08-01","offType":"Weekend"},{"appliedDate":"2020-08-02","offType":"Weekend"},{"appliedDate":"2020-08-03","overAllPer":0},{"appliedDate":"2020-08-04","overAllPer":94.0},{"appliedDate":"2020-08-08","offType":"Weekend"},{"appliedDate":"2020-08-09","offType":"Weekend"},{"appliedDate":"2020-08-12","offType":"Holiday"},{"appliedDate":"2020-08-15","offType":"Holiday"},{"appliedDate":"2020-08-15","offType":"Weekend"},{"appliedDate":"2020-08-16","offType":"Weekend"},{"appliedDate":"2020-08-22","offType":"Weekend"},{"appliedDate":"2020-08-23","offType":"Weekend"},{"appliedDate":"2020-08-29","offType":"Weekend"},{"appliedDate":"2020-08-30","offType":"Weekend"}],"errorProperties":[],"httpStatus":"OK","errMsg":"","total":1,"valid":true}`;
        //resp = JSON.parse(respStr);
        this.data = resp.entity;
        if (isRefresh) {
          this.refreshData(this.data);
        }
        /*
        resp.entity.map((item) => {
          if (
            item.offType &&
            item.offType != "Weekend" &&
            item.overAllPer == 0
          ) {
            this.leaveDates.push(item.appliedDate);
          }
        });*/
      })
      .catch((error: any) => {
        this.data = null;
        //this.leaveDates = [];
      });
  }

  async getLeaveInfoByArtist(userId: any) {
    let m = this.helperService._getMonth(this.viewDate);
    let y = this.viewDate.getFullYear();
    this.leaveDates = [];
    await this.hrService
      .getLeaveInfoByArtist(m, y, userId)
      .toPromise()
      .then((resp: any) => {
        //this.leaveInfo = resp.entity;
        this.data = resp.entity;
        this.refreshData(this.data);
        /*resp.entity.map((item) => {
          if (
            item.offType &&
            item.offType != "Weekend" &&
            item.overAllPer == 0
          ) {
            this.leaveDates.push(item.appliedDate);
          }
        });*/
      })
      .catch((error: any) => {
        //this.leaveDates = [];
        this.data = null;
      });
  }

  prevMonth() {
    if (this.monthNavIndex >= this.startMonth) {
      --this.monthNavIndex;
      if (
        !this.formattedMonthArray[this.monthNavIndex].date[this.clickedDayIndex]
          .enabled
      ) {
        this.clickedDayIndex = this.startDay - 1;
      }
      this.log("Prev Month clicked : " + this.monthNavIndex);
      this.sendDateChangeEvent("prev_month");
    }
  }

  nextMonth() {
    if (this.monthNavIndex < this.startMonth + this.givenMonthDifference - 1) {
      ++this.monthNavIndex;
      if (
        this.formattedMonthArray[this.monthNavIndex].date[
          this.clickedDayIndex
        ] !== undefined
      ) {
        if (
          !this.formattedMonthArray[this.monthNavIndex].date[
            this.clickedDayIndex
          ].enabled
        ) {
          this.clickedDayIndex = this.endDay - 1;
        }
      } else {
        this.clickedDayIndex = this.endDay - 1;
      }
      this.log("Next Month clicked : " + this.monthNavIndex);
      this.sendDateChangeEvent("next_month");
    }
  }

  refreshData(data) {
    this.data = data;
    this.formattedMonthArray.map((month) => {
      if (month !== null) {
        month.date.map((day) => {
          day.overAllPer = 100;
          day.progress = 0;
          day.offType = "";
        });
      }
    });
    this.updateData();
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

  onListChange(e: any) {
    this.getLeaveInfoByArtist(this.user.id);
  }

  userChangeHandler(e) {
    this.user = e;
    this.isUserSelected = true;
    if (this.user) {
      this.getLeaveInfoByArtist(this.user.id);
    }
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
    this.leaveDates = [];
    this.userClose.emit(null);
    this.getLeaveInfo(true);
  }

  isValidArr(users: any) {
    return this.helperService.isValidArr(users);
  }

  disabledPrev() {
    if (this.monthNavIndex >= this.startMonth) {
      return false;
    }
    return true;

    /*if (isSameMonth(this.minDate, this.viewDate)) {
      return true;
    }*/
  }
  disableNext() {
    if (this.monthNavIndex < this.startMonth + this.givenMonthDifference - 1) {
      return false;
    }
    return true;
    /*if (isToday(this.viewDate)) {
      return true;
    }
    if (isSameMonth(this.viewDate, new Date())) {
      return true;
    }*/
  }

  getLeaveStatus(day: any) {
    if (day.offType && day.offType != "") {
      return day.offType;
    } else {
      return `Available`;
    }
    //return `Available` + day.offType;

    if (day && day.events && day.events.length > 0) {
      let logEvent = JSON.parse(day.events[0].title);
      if (logEvent.hasOwnProperty("offType")) {
        return logEvent.offType;
        /*if (logEvent.offType === "Holiday") {
          return "OFF";
        } else {
          return logEvent.offType;
        }*/
      }
    } else {
      if (day && day.cssClass && day.cssClass == "cal-disabled") {
        return "-NA-";
      }
      return `Available`;
    }
  }

  getOverallPercent(day: any) {
    if (day.offType == "") {
      return `${day.overAllPer} %`;
    } else {
      let offType = `OFF`;
      if (day.offType) {
        offType = day.offType;
      }
      return offType;
    }
  }

  getStatus(day: any) {
    //console.log("day ", day);
    if (!this.isUserSelected) {
      if (day.offType == "") {
        if (day.hasOwnProperty("overAllPer")) {
          if (day.overAllPer == 100) {
            return "full";
          } else if (day.overAllPer > 0 && day.overAllPer < 100) {
            return "partial";
          } else {
            return "empty";
          }
        } else {
          return "full";
        }
      } else {
        return "day-off";
      }
    } else {
      console.log(day, " : ", day.offType);
      if (day.offType != "") {
        if (day.offType === "Holiday" || day.offType === "Weekend") {
          return "day-off";
        } else {
          return "leave";
        }
      } else {
        return "full";
      }
    }

    /*
    if (day && day.events && day.events.length > 0) {
      let logEvent = JSON.parse(day.events[0].title);
      if (!this.isUserSelected) {
        if (!logEvent.hasOwnProperty("offType")) {
          if (logEvent.hasOwnProperty("overAllPer")) {
            if (logEvent.overAllPer == 100) {
              return "full";
            } else if (logEvent.overAllPer > 0 && logEvent.overAllPer < 100) {
              return "partial";
            } else {
              return "empty";
            }
          }
        } else {
          return "day-off";
        }
      } else {
        if (logEvent.hasOwnProperty("offType")) {
          if (
            logEvent.offType === "Holiday" ||
            logEvent.offType === "Weekend"
          ) {
            return "day-off";
          } else {
            return "leave";
          }
        } else {
          return "full";
        }
      }
    } else {
      if (!this.isUserSelected) {
        return "full";
      } else {
        return "full";
      }
    }*/
  }

  log(str: any) {
    //console.log(str);
    //if (this.debug) console.log(str);
  }
}

export class CustomMonth {
  date = [];
  monthName: string;
  monthNumber: number;
  year: string;
}

export class CustomDate {
  day: string;
  weekday: string;
  weekdayFull: string;
  isToday: boolean;
  enabled: boolean;
  hours: number;
  overAllPer: any;
  offType: any;
  progress: number;
  date: any;
}
