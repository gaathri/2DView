import { Component, OnInit, Input } from "@angular/core";
import { NzDrawerRef } from "ng-zorro-antd";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { HrService } from "../../dashboards/hr.service";
import {
  isSameDay,
  isAfter,
  isBefore,
  addDays,
  differenceInCalendarDays,
  isSameMonth,
} from "date-fns";

@Component({
  selector: "app-leave-form",
  templateUrl: "./leave-form.component.html",
  styleUrls: ["./leave-form.component.scss"],
})
export class LeaveFormComponent implements OnInit {
  @Input() leaveOut: any;
  @Input() viewDate: any;
  @Input() user: any;
  @Input() mode: any;

  weekendList: any;
  leaveOutCopy: any;
  isDataReady: boolean;
  dataForm: FormGroup;
  btnName: any;
  sessions: any;
  leaveData: any;

  constructor(
    private drawerRef: NzDrawerRef<string>,
    private notificationService: NotificationService,
    private helperService: HelperService,
    private hrService: HrService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.sessions = [
      { label: "Full Day", value: "FULL" },
      { label: "First Session (S1)", value: "FIRST_SESSION" },
      { label: "Second Session (S2)", value: "SECOND_SESSION" },
    ];
    this.btnName = this.mode === "update" ? "Update" : "Add";
    this.prepareData();
  }

  async prepareData() {
    this.leaveOutCopy = JSON.parse(JSON.stringify(this.leaveOut));
    this.leaveData = this.leaveOutCopy.leaveData;
    if (this.mode === "create") {
      await this.getWeekendList();
    } else {
      this.buildFormData();
    }
    this.isDataReady = true;
  }

  buildFormData() {
    this.dataForm = this.fb.group({
      userId: [this.leaveOutCopy.userId],
      reason: [this.leaveOutCopy.reason, [Validators.required]],
      duration: [this.leaveOutCopy.duration],
      appliedDate: [this.leaveOutCopy.appliedDate],
    });
  }

  endDateValidateStatus = "";

  onEndDateChange(e: any) {
    if (e) {
      this.endDateValidateStatus = "";
    }
    let startDate = new Date(this.leaveOutCopy.startDate); //this.dataForm.controls.startDate.value;
    let endDate = new Date(this.leaveOutCopy.endDate); //this.dataForm.controls.endDate.value;

    if (endDate) {
      let count = differenceInCalendarDays(endDate, startDate);
      this.leaveData = [];
      this.leaveOutCopy.leaveData = this.leaveData;
      for (let i = 0; i <= count; i++) {
        let item = {
          appliedDate: this.helperService.transformDate(
            addDays(startDate, i),
            "yyyy-MM-dd"
          ),
          duration: "FULL",
          reason: this.leaveOutCopy.reason,
        };
        item["isWeekend"] = this.isWeekend(item);
        if (item["isWeekend"]) {
          item.duration = null;
        }
        this.leaveData.push(item);
      }
    }
  }

  getDayCount(item: any, _index: any) {
    let index = _index + 1;
    if (index < 10) {
      return "0" + index;
    }
    return index;
  }

  getDay(item: any) {
    return new Date(item.appliedDate);
  }

  isWeekend(item: any) {
    let dateToCheck = this.getDisplayDate(item.appliedDate);
    let found = this.weekendList.find((_item) => {
      return dateToCheck === this.getDisplayDate(_item.appliedDate);
    });
    if (found) {
      return true;
    } else {
      return false;
    }
  }

  getDate(item: any) {
    return this.getDisplayDate(item.appliedDate);
  }

  isEndDateSelected() {
    if (this.leaveOutCopy.endDate) {
      return true;
    }
    return false;
  }

  onStartDateChange(e: any) {
    this.leaveOutCopy.endDate = null; //.setValue(null);
  }

  isEndDateDisabled() {
    if (!this.leaveOutCopy.startDate) {
      return true;
    }
    return false;
  }

  disabledStartDate = (startValue: Date): boolean => {
    if (isSameMonth(this.viewDate, startValue)) {
      return false;
    }
    return true;
  };

  disabledEndDate = (endValue: Date): boolean => {
    let startValue = new Date(this.leaveOutCopy.startDate);
    if (!endValue || !startValue) {
      return false;
    }

    /*&&
    isBefore(addDays(endValue, 5), startValue)*/

    if (
      isSameDay(startValue, endValue) ||
      (isSameMonth(this.viewDate, endValue) &&
        isAfter(endValue, startValue) &&
        !isBefore(addDays(startValue, 5), endValue))
    ) {
      return false;
    }
    return true;
    //return startValue.getTime() >= endValue.getTime();
  };

  showNotification(info: any) {
    this.notificationService.showNotification(info);
  }

  async getWeekendList() {
    let m = this.helperService._getMonth(this.viewDate);
    let y = this.viewDate.getFullYear();
    await this.hrService
      .getWeekendList(m, y)
      .toPromise()
      .then((resp: any) => {
        this.weekendList = resp.entity;
      })
      .catch((error: any) => {
        this.weekendList = [];
      });
  }

  reasonValidateStatus = "";

  onReasonChange() {
    console.log("onReasonChange > " + this.leaveOutCopy.reason);
    if (!this.leaveOutCopy.reason) {
      this.reasonValidateStatus = "error";
    } else {
      this.reasonValidateStatus = "";
    }
    console.log("onReasonChange > " + this.reasonValidateStatus);
  }

  async submitHandler() {
    if (this.mode === "create") {
      if (!this.leaveOutCopy.reason) {
        this.reasonValidateStatus = "error";
      }

      if (!this.leaveOutCopy.endDate) {
        this.endDateValidateStatus = "error";
      }

      if (this.endDateValidateStatus || this.reasonValidateStatus) {
        return;
      }

      this.leaveOutCopy.leaveData = this.leaveOutCopy.leaveData.filter(
        (item) => {
          return !item.isWeekend;
        }
      );
      for (let i = 0; i < this.leaveOutCopy.leaveData.length; i++) {
        this.leaveOutCopy.leaveData[i].reason = this.leaveOutCopy.reason;
      }
      let postObj = {
        userId: this.leaveOutCopy.userId,
        leaveData: this.leaveOutCopy.leaveData,
        reason: this.leaveOutCopy.reason,
      };
      let successMessage = AppConstants.LEAVE_CREATION_SUCCESS;
      let errorMessage = AppConstants.LEAVE_CREATION_ERROR;
      let isSuccess = false;

      await this.hrService
        .createLeave(postObj)
        .toPromise()
        .then((resp: any) => {
          isSuccess = true;
          this.showNotification({
            type: "success",
            title: "Success",
            content: successMessage,
            duration: AppConstants.NOTIFICATION_DURATION,
          });
        })
        .catch((error: any) => {
          let errorDetails = this.helperService.getErrorDetails(error);
          if (errorDetails !== "") {
            errorMessage = `<b>${errorMessage}</b>` + errorDetails;
          }
          this.showNotification({
            type: "error",
            title: "Error",
            content: errorMessage,
            duration: AppConstants.NOTIFICATION_DURATION,
          });
        });
      this.close(isSuccess);
    } else {
      if (!this.dataForm.valid) {
        return;
      }
      let postObj = JSON.parse(JSON.stringify(this.dataForm.value));
      postObj.id = this.leaveOutCopy.id;
      let successMessage = AppConstants.LEAVE_MODIFICATION_SUCCESS;
      let errorMessage = AppConstants.LEAVE_CREATION_ERROR;
      let isSuccess = false;

      await this.hrService
        .updateLeave(postObj)
        .toPromise()
        .then((resp: any) => {
          isSuccess = true;
          this.showNotification({
            type: "success",
            title: "Success",
            content: successMessage,
            duration: AppConstants.NOTIFICATION_DURATION,
          });
        })
        .catch((error: any) => {
          let errorDetails = this.helperService.getErrorDetails(error);
          if (errorDetails !== "") {
            errorMessage = `<b>${errorMessage}</b>` + errorDetails;
          }
          this.showNotification({
            type: "error",
            title: "Error",
            content: errorMessage,
            duration: AppConstants.NOTIFICATION_DURATION,
          });
        });
      this.close(isSuccess);
    }
    /*for (const i in this.dataForm.controls) {
      this.dataForm.controls[i].markAsDirty();
      this.dataForm.controls[i].updateValueAndValidity();
    }
    */
    /*if (!this.dataForm.valid) {
      return;
    }*/
  }
  close(isSuccess): void {
    this.drawerRef.close(isSuccess);
  }

  getDisplayDateFormat() {
    return AppConstants.DISPLAY_DATE_FORMAT;
  }

  getDisplayDate(date: any) {
    return this.helperService.transformDate(
      date,
      AppConstants.DISPLAY_DATE_FORMAT
    );
  }
}
