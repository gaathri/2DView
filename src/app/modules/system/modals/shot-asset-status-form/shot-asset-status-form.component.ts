import { Component, OnInit, Input } from "@angular/core";
import { AppConstants } from "src/app/constants/AppConstants";
import { NzDrawerRef } from "ng-zorro-antd";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { StatusService } from "../../configs/status.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-shot-asset-status-form",
  templateUrl: "./shot-asset-status-form.component.html",
  styleUrls: ["./shot-asset-status-form.component.scss"],
})
export class ShotAssetStatusFormComponent implements OnInit {
  @Input() statusOut: any;
  @Input() statusOutCopy: any;
  @Input() mode: any;

  isDataReady: boolean;
  departments: any;
  nameMaxLength = AppConstants.MAX_LENGTH_NAME;
  descMaxLength = AppConstants.MAX_LENGTH_DESC;
  btnName: string = "";
  colorPaletteCodes = AppConstants.COLOR_PALETTE_CODES;
  dataForm: FormGroup;

  constructor(
    private drawerRef: NzDrawerRef<string>,
    private notificationService: NotificationService,
    private helperService: HelperService,
    private statusService: StatusService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.btnName = this.mode === "update" ? "Update" : "Add";
    this.prepareData();
  }

  async prepareData() {
    if (!this.statusOut) {
      this.statusOut = {
        name: null,
        desc: null,
        code: null,
      };
    }
    this.statusOutCopy = JSON.parse(JSON.stringify(this.statusOut));
    this.buildFormData();
    this.isDataReady = true;
  }

  buildFormData() {
    this.dataForm = this.fb.group({
      name: [
        this.statusOutCopy.name,
        [Validators.required, Validators.pattern(AppConstants.itemNameRE)],
      ],
      desc: [this.statusOutCopy.desc],
      code: [this.statusOutCopy.code, [Validators.required]],
    });
  }
  getControlLabel(type: string) {
    return this.dataForm.controls[type].value;
  }

  setColor(color: string) {
    this.statusOutCopy.code = color;
    this.dataForm.controls.code.setValue(color);
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
    let successMessage = AppConstants.STATUS_CREATION_SUCCESS;
    let errorMessage = AppConstants.STATUS_CREATION_ERROR;
    let serviceName = "createStatus";
    let isSuccess = false;
    let postObj = JSON.parse(JSON.stringify(this.dataForm.value));
    if (this.mode === "update") {
      postObj.id = this.statusOutCopy.id;
      successMessage = AppConstants.STATUS_MODIFICATION_SUCCESS;
      errorMessage = AppConstants.STATUS_MODIFICATION_ERROR;
      serviceName = "updateStatus";
    }
    await this.statusService[serviceName](postObj)
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
