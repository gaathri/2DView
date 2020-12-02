import { Component, OnInit, Input } from "@angular/core";
import { NzDrawerRef } from "ng-zorro-antd";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { HrService } from "../../dashboards/hr.service";

@Component({
  selector: "app-holiday-form",
  templateUrl: "./holiday-form.component.html",
  styleUrls: ["./holiday-form.component.scss"],
})
export class HolidayFormComponent implements OnInit {
  @Input() holidayOut: any;
  @Input() holidayOutCopy: any;
  @Input() mode: any;

  isDataReady: boolean;
  nameMaxLength = AppConstants.MAX_LENGTH_NAME;
  descMaxLength = AppConstants.MAX_LENGTH_DESC;
  btnName: string = "";
  dataForm: FormGroup;

  constructor(
    private drawerRef: NzDrawerRef<string>,
    private notificationService: NotificationService,
    private helperService: HelperService,
    private hrService: HrService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.btnName = this.mode === "update" ? "Update" : "Add";
    this.prepareData();
  }

  async prepareData() {
    if (!this.holidayOut) {
      this.holidayOut = {};
    }
    this.holidayOutCopy = JSON.parse(JSON.stringify(this.holidayOut));
    this.buildFormData();
    this.isDataReady = true;
  }

  buildFormData() {
    this.dataForm = this.fb.group({
      leaveDate: [this.holidayOut.leaveDate, [Validators.required]],
      reason: [
        this.holidayOut.reason,
        [Validators.required, Validators.pattern(AppConstants.itemNameRE)],
      ],
      description: [this.holidayOut.description],
    });
  }

  showNotification(info: any) {
    this.notificationService.showNotification(info);
  }

  isValidArr(arr: any) {
    return this.helperService.isValidArr(arr);
  }

  async submitHandler() {
    for (const i in this.dataForm.controls) {
      this.dataForm.controls[i].markAsDirty();
      this.dataForm.controls[i].updateValueAndValidity();
    }

    if (!this.dataForm.valid) {
      return;
    }

    let successMessage = AppConstants.HOLIDAY_CREATION_SUCCESS;
    let errorMessage = AppConstants.HOLIDAY_CREATION_ERROR;
    let serviceName = "createHoliday";
    let isSuccess = false;
    let postObj = JSON.parse(JSON.stringify(this.dataForm.value));
    if (postObj.leaveDate) {
      postObj.leaveDate = this.helperService.transformDate(
        new Date(postObj.leaveDate),
        "yyyy-MM-dd"
      );
    }
    if (this.mode === "update") {
      postObj.id = this.holidayOutCopy.id;
      successMessage = AppConstants.HOLIDAY_MODIFICATION_SUCCESS;
      errorMessage = AppConstants.HOLIDAY_MODIFICATION_ERROR;
      serviceName = "updateHoliday";
    }
    await this.hrService[serviceName](postObj)
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

  close(isSuccess): void {
    this.drawerRef.close(isSuccess);
  }

  getDisplayDateFormat() {
    return AppConstants.DISPLAY_DATE_FORMAT;
  }
}
