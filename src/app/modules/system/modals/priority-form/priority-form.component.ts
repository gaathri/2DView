import { Component, OnInit, Input } from "@angular/core";
import { AppConstants } from "src/app/constants/AppConstants";
import { NzDrawerRef } from "ng-zorro-antd";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { PriorityService } from "../../configs/priority.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-priority-form",
  templateUrl: "./priority-form.component.html",
  styleUrls: ["./priority-form.component.scss"],
})
export class PriorityFormComponent implements OnInit {
  @Input() priorityOut: any;
  @Input() priorityOutCopy: any;
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
    private priorityService: PriorityService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.btnName = this.mode === "update" ? "Update" : "Add";
    this.prepareData();
  }

  async prepareData() {
    if (!this.priorityOut) {
      this.priorityOut = {
        taskPriorityLevel: null,
        description: null,
        colourCode: null,
      };
    }
    this.priorityOutCopy = JSON.parse(JSON.stringify(this.priorityOut));
    this.buildFormData();
    this.isDataReady = true;
  }

  buildFormData() {
    this.dataForm = this.fb.group({
      taskPriorityLevel: [
        this.priorityOutCopy.taskPriorityLevel,
        [Validators.required, Validators.pattern(AppConstants.itemNameRE)],
      ],
      description: [this.priorityOutCopy.description],
      colourCode: [this.priorityOutCopy.colourCode, [Validators.required]],
    });
  }

  setColor(color: string) {
    this.priorityOutCopy.colourCode = color;
    this.dataForm.controls.colourCode.setValue(color);
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
    let successMessage = AppConstants.PRIORITY_CREATION_SUCCESS;
    let errorMessage = AppConstants.PRIORITY_CREATION_ERROR;
    let serviceName = "createPriority";
    let isSuccess = false;
    let postObj = JSON.parse(JSON.stringify(this.dataForm.value));
    if (this.mode === "update") {
      postObj.id = this.priorityOutCopy.id;
      successMessage = AppConstants.PRIORITY_MODIFICATION_SUCCESS;
      errorMessage = AppConstants.PRIORITY_MODIFICATION_ERROR;
      serviceName = "updatePriority";
    }
    await this.priorityService[serviceName](postObj)
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
