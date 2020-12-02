import { Component, OnInit, Input } from "@angular/core";
import { NzDrawerRef } from "ng-zorro-antd";
import { AppConstants } from "src/app/constants/AppConstants";
import {
  isSameDay,
  isAfter,
  isBefore,
  addDays,
  endOfMonth,
  addMonths,
} from "date-fns";

@Component({
  selector: "app-artist-db-settings",
  templateUrl: "./artist-db-settings.component.html",
  styleUrls: ["./artist-db-settings.component.scss"],
})
export class ArtistDbSettingsComponent implements OnInit {
  @Input() workStatusesKanban: any;
  @Input() workStatuses: any;
  @Input() overallSelectedItems: any;
  @Input() starSelectedItems: any;
  @Input() kanbanSelectedItems: any;
  @Input() isDashboardVisible: any;
  @Input() startDate: any;
  @Input() endDate: any;

  starStatusMax = 4;
  overallStatusMax = 5;
  kanbanStatusMax = 5;

  constructor(private drawerRef: NzDrawerRef<string>) {}

  ngOnInit() {
    //this.kanbanStatusMax = this.workStatusesKanban.length;
  }

  changeHandler(e: any, type: any) {
    if (type === "overall") {
      this.overallSelectedItems = e;
    } else if (type === "star") {
      this.starSelectedItems = e;
    } else if (type === "kanban") {
      this.kanbanSelectedItems = e;
    }
  }

  isChecked(status: any, type: any) {
    let itemsToCheck = this.overallSelectedItems;
    if (type === "star") {
      itemsToCheck = this.starSelectedItems;
    } else if (type === "kanban") {
      itemsToCheck = this.kanbanSelectedItems;
    }
    let obj = itemsToCheck.find((data) => data.name === status.name);
    if (obj) {
      return true;
    } else {
      return false;
    }
  }

  isDisabled(status: any, type: any) {
    let disabled = false;
    let itemsToCheck = this.overallSelectedItems;
    let max = this.overallStatusMax;
    if (type === "star") {
      itemsToCheck = this.starSelectedItems;
      max = this.starStatusMax;
    } else if (type === "kanban") {
      itemsToCheck = this.kanbanSelectedItems;
      max = this.kanbanStatusMax;
    }
    if (itemsToCheck && itemsToCheck.length >= max) {
      let obj = itemsToCheck.find((item) => item.name === status.name);
      if (!obj) {
        disabled = true;
      }
    }
    return disabled;
  }

  submitHandler() {
    let result = {
      overallSelectedItems: this.overallSelectedItems,
      starSelectedItems: this.starSelectedItems,
      kanbanSelectedItems: this.kanbanSelectedItems,
      startDate: this.startDate,
      endDate: this.endDate,
    };
    this.drawerRef.close(JSON.stringify(result));
  }

  onStartDateChange(e: any) {
    this.endDate = null;
  }

  isEndDateDisabled() {
    let startValue = this.startDate;
    if (!startValue) {
      return true;
    }
    return false;
  }

  disabledEndDate = (endValue: Date): boolean => {
    let startValue = new Date(this.startDate);
    if (!endValue || !startValue) {
      return false;
    }
    if (isSameDay(startValue, endValue)) {
      return false;
    }
    // isAfter(endValue, startValue) &&
    let monthEnd = endOfMonth(startValue);
    /*if (
      isAfter(endValue, startValue) &&
      isBefore(endValue, addMonths(monthEnd, 1))
    ) {
      return false;
    }*/

    if (
      isAfter(endValue, startValue) &&
      isBefore(endValue, addDays(startValue, 30))
    ) {
      return false;
    }
    return true;
  };

  getDisplayDateFormat() {
    return AppConstants.DISPLAY_DATE_FORMAT;
  }
}
