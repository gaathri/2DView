import { Component, OnInit, Input } from "@angular/core";
import { AppConstants } from "src/app/constants/AppConstants";
import { NzDrawerRef } from "ng-zorro-antd";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { OfficeLocationService } from "../../configs/office-location.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-office-location-form",
  templateUrl: "./office-location-form.component.html",
  styleUrls: ["./office-location-form.component.scss"],
})
export class OfficeLocationFormComponent implements OnInit {
  @Input() officeLocationOut: any;
  @Input() officeLocationOutCopy: any;
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
    private officeLocationService: OfficeLocationService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.btnName = this.mode === "update" ? "Update" : "Add";
    this.prepareData();
  }

  async prepareData() {
    if (!this.officeLocationOut) {
      this.officeLocationOut = {
        name: null,
        description: null,
      };
    }
    this.officeLocationOutCopy = JSON.parse(
      JSON.stringify(this.officeLocationOut)
    );
    this.buildFormData();
    this.isDataReady = true;
  }

  buildFormData() {
    this.dataForm = this.fb.group({
      name: [this.officeLocationOutCopy.name, [Validators.required]],
      description: [this.officeLocationOutCopy.description],
    });
  }

  isValidArr(arr: any) {
    return this.helperService.isValidArr(arr);
  }

  close(isSuccess: any): void {
    this.drawerRef.close(isSuccess);
  }

  showNotification(info: any) {
    this.notificationService.showNotification(info);
  }

  async submitHandler() {
    for (const i in this.dataForm.controls) {
      this.dataForm.controls[i].markAsDirty();
      this.dataForm.controls[i].updateValueAndValidity();
    }
    if (!this.dataForm.valid) {
      return;
    }
    let successMessage = AppConstants.OFFICE_LOCATION_CREATION_SUCCESS;
    let errorMessage = AppConstants.OFFICE_LOCATION_CREATION_ERROR;
    let serviceName = "createOfficeLocation";
    let isSuccess = false;
    let postObj = JSON.parse(JSON.stringify(this.dataForm.value));
    if (this.mode === "update") {
      postObj.id = this.officeLocationOutCopy.id;
      successMessage = AppConstants.OFFICE_LOCATION_MODIFICATION_SUCCESS;
      errorMessage = AppConstants.OFFICE_LOCATION_MODIFICATION_ERROR;
      serviceName = "updateOfficeLocation";
    }
    await this.officeLocationService[serviceName](postObj)
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
}
