import { Component, OnInit, Input } from "@angular/core";
import { NzDrawerRef } from "ng-zorro-antd";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ReportService } from "../../report/report.service";
import { UsersService } from "../../configs/users.service";

@Component({
  selector: "app-report-form",
  templateUrl: "./report-form.component.html",
  styleUrls: ["./report-form.component.scss"],
})
export class ReportFormComponent implements OnInit {
  @Input() reportOut: any;
  @Input() mode: any;
  reportOutCopy: any;
  isDataReady: boolean;
  nameMaxLength = AppConstants.MAX_LENGTH_NAME;
  recipients: any;
  btnName: string = "";
  dataForm: FormGroup;
  times: any = [];
  time = new Date();

  constructor(
    private drawerRef: NzDrawerRef<string>,
    private notificationService: NotificationService,
    private helperService: HelperService,
    private reportService: ReportService,
    private usersService: UsersService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.btnName = this.mode === "update" ? "Update" : "Add";
    this.prepareData();
  }

  async prepareData() {
    if (!this.reportOut) {
      this.reportOut = {};
    }
    this.reportOutCopy = JSON.parse(JSON.stringify(this.reportOut));
    this.getTimes();
    await this.getRecipients();
    this.buildFormData();
    this.isDataReady = true;
  }

  onTimeChange(e) {
    let sheduledHourMin = this.helperService.transformDate(e, "HH:mm");
    this.dataForm.controls.sheduledHourMin.setValue(sheduledHourMin);
  }

  buildFormData() {
    this.dataForm = this.fb.group({
      reportName: [this.reportOutCopy.reportName, [Validators.required]],
      reportFrequency: [
        this.reportOutCopy.reportFrequency,
        [Validators.required, Validators.min(1), Validators.max(30)],
      ],
      sheduledHourMin: [this.reportOutCopy.sheduledHourMin],
      reportDeliveryEndDate: [
        this.reportOutCopy.reportDeliveryEndDate,
        [Validators.required],
      ],
      distributionEmail: [this.reportOutCopy.distributionEmail],
    });
    this.time = new Date();
    if (this.reportOutCopy.sheduledHourMin) {
      let str = this.reportOutCopy.sheduledHourMin.toString();
      if (str.indexOf(":") > -1) {
        let h = str.split(":")[0];
        let m = str.split(":")[1];
        if (h) {
          this.time.setHours(h);
        } else {
          this.time.setHours(0);
        }
        this.time.setMinutes(m);
      } else {
        this.time.setHours(this.reportOutCopy.sheduledHourMin);
        this.time.setMinutes(0);
      }
    }
  }

  getTimes() {
    for (let i = 0; i < 24; i++) {
      this.times.push({
        id: i,
        title: i < 10 ? "0" + i : i,
      });
    }
  }

  async getRecipients() {
    await this.usersService
      .getRecipients()
      .toPromise()
      .then((resp: any) => {
        this.recipients = resp.entity;
      })
      .catch((error: any) => {
        this.recipients = [];
      });
  }

  disabledDeliveryEndDate = (startValue: Date): boolean => {
    if (!startValue) {
      return false;
    }
    let today = new Date();
    let yesterday = new Date(today.setDate(today.getDate() - 1));
    return startValue.getTime() < yesterday.getTime();
  };

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
    let successMessage = AppConstants.REPORT_TEMPLATE_CREATION_SUCCESS;
    let errorMessage = AppConstants.REPORT_TEMPLATE_CREATION_ERROR;
    let serviceName = "createReportTemplate";
    let isSuccess = false;
    let postObj = JSON.parse(JSON.stringify(this.dataForm.value));
    postObj = { ...this.reportOutCopy, ...postObj };
    if (postObj.distributionEmail) {
      postObj.distributionEmail = postObj.distributionEmail.toString();
    }
    postObj.reportDeliveryEndDate = this.helperService.transformDate(
      postObj.reportDeliveryEndDate
    );

    if (this.mode === "update") {
      //postObj.id = this.reportOutCopy.id;
      successMessage = AppConstants.REPORT_TEMPLATE_MODIFICATION_SUCCESS;
      errorMessage = AppConstants.REPORT_TEMPLATE_MODIFICATION_ERROR;
      serviceName = "updateReportTemplate";
    }
    await this.reportService[serviceName](postObj)
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

  close(isSuccess: any): void {
    this.drawerRef.close(isSuccess);
  }

  showNotification(info: any) {
    this.notificationService.showNotification(info);
  }

  getDisplayDateFormat() {
    return AppConstants.DISPLAY_DATE_FORMAT;
  }
}
