import { Component, OnInit, Input } from "@angular/core";
import { NzDrawerRef } from "ng-zorro-antd";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AppConstants } from "src/app/constants/AppConstants";
import { CustomFieldService } from "../../configs/custom-field.service";
import { ShowsService } from "../../shows/shows.service";

@Component({
  selector: "app-custom-field-form",
  templateUrl: "./custom-field-form.component.html",
  styleUrls: ["./custom-field-form.component.scss"],
})
export class CustomFieldFormComponent implements OnInit {
  @Input() customFieldOut: any;
  @Input() mode: any;
  shows: any;
  isDataReady: boolean;
  dataForm: FormGroup;
  btnName: any;
  customFieldOutCopy: any;
  nameMaxLength = AppConstants.MAX_LENGTH_NAME;
  formats: any;
  isGolbal: boolean;
  levelValidateStatus = "";

  constructor(
    private drawerRef: NzDrawerRef<string>,
    private notificationService: NotificationService,
    private helperService: HelperService,
    private showsService: ShowsService,
    private customFieldService: CustomFieldService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.btnName = this.mode === "update" ? "Update" : "Add";
    this.prepareData();
  }

  async prepareData() {
    await this.getShowList();
    this.formats = [
      { id: 1, formatTypeName: "String", description: "String" },
      { id: 2, formatTypeName: "Integer", description: "Integer" },
      { id: 3, formatTypeName: "Datetime", description: "Datetime" },
    ];
    if (!this.customFieldOut) {
      this.customFieldOut = {
        clientName: null,
        clientDesc: null,
      };
    }
    this.customFieldOutCopy = JSON.parse(JSON.stringify(this.customFieldOut));
    this.buildFormData();
    this.isDataReady = true;
  }

  buildFormData() {
    let isMandatory = false;
    let isGolbal = false;
    let showLevel = false;
    let shotLevel = false;
    let taskLevel = false;

    if (this.customFieldOutCopy.isMandatory === 1) {
      isMandatory = true;
    }

    if (this.customFieldOutCopy.isGolbal === 1) {
      isGolbal = true;
    }

    if (this.customFieldOutCopy.showLevel === 1) {
      showLevel = true;
    }
    if (this.customFieldOutCopy.shotLevel === 1) {
      shotLevel = true;
    }
    if (this.customFieldOutCopy.taskLevel === 1) {
      taskLevel = true;
    }

    this.isGolbal = isGolbal;

    this.dataForm = this.fb.group({
      name: [
        this.customFieldOutCopy.name,
        [Validators.required, Validators.pattern(AppConstants.itemNameRE)],
      ],
      description: [this.customFieldOutCopy.description],
      format: [this.customFieldOutCopy.format, [Validators.required]],
      isMandatory: [isMandatory],
      isGolbal: [isGolbal],
      showLevel: [showLevel],
      shotLevel: [shotLevel],
      taskLevel: [taskLevel],

      entityId: [this.customFieldOutCopy.entityId, [Validators.required]],
    });
    this.requiredChange(this.isGolbal);
  }

  requiredChange(e: any) {
    this.isGolbal = e;
    if (e) {
      this.dataForm.get("entityId")!.clearValidators();
      this.dataForm.controls.entityId.setValue(null);
    } else {
      this.dataForm.get("entityId")!.setValidators(Validators.required);
    }
  }

  onShowLevelChange(e) {
    this.dataForm.value.showLevel = e;
    this.checkStatus();
  }

  onShotLevelChange(e) {
    this.dataForm.value.shotLevel = e;
    this.checkStatus();
  }

  onTaskLevelChange(e) {
    this.dataForm.value.taskLevel = e;
    this.checkStatus();
  }

  checkStatus() {
    this.levelValidateStatus = "error";
    if (
      this.dataForm.value.showLevel ||
      this.dataForm.value.shotLevel ||
      this.dataForm.value.taskLevel
    ) {
      this.levelValidateStatus = "";
    }
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

  async getShowList() {
    await this.showsService
      .getShows()
      .toPromise()
      .then((resp: any) => {
        this.shows = resp.entity;
      })
      .catch((error: any) => {
        this.shows = [];
      });
  }

  async submitHandler() {
    for (const i in this.dataForm.controls) {
      this.dataForm.controls[i].markAsDirty();
      this.dataForm.controls[i].updateValueAndValidity();
    }
    if (!this.dataForm.valid) {
      return;
    }

    this.checkStatus();

    if (this.levelValidateStatus) {
      return;
    }

    let successMessage = AppConstants.CUSTOM_FIELD_CREATION_SUCCESS;
    let errorMessage = AppConstants.CUSTOM_FIELD_CREATION_ERROR;
    let serviceName = "createCustomField";
    let isSuccess = false;
    let postObj = JSON.parse(JSON.stringify(this.dataForm.value));
    if (postObj.isMandatory) {
      postObj.isMandatory = 1;
    } else {
      postObj.isMandatory = 0;
    }
    if (postObj.isGolbal) {
      postObj.isGolbal = 1;
    } else {
      postObj.isGolbal = 0;
    }

    if (postObj.showLevel) {
      postObj.showLevel = 1;
    } else {
      postObj.showLevel = 0;
    }

    if (postObj.shotLevel) {
      postObj.shotLevel = 1;
    } else {
      postObj.shotLevel = 0;
    }

    if (postObj.taskLevel) {
      postObj.taskLevel = 1;
    } else {
      postObj.taskLevel = 0;
    }

    if (this.mode === "update") {
      postObj.id = this.customFieldOutCopy.id;
      successMessage = AppConstants.CUSTOM_FIELD_MODIFICATION_SUCCESS;
      errorMessage = AppConstants.CUSTOM_FIELD_MODIFICATION_ERROR;
      serviceName = "updateCustomField";
    }
    await this.customFieldService[serviceName](postObj)
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
