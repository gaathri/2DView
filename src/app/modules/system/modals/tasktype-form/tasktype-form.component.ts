import { Component, OnInit, Input } from "@angular/core";
import { AppConstants } from "src/app/constants/AppConstants";
import { NzDrawerRef } from "ng-zorro-antd";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { TasktypesService } from "../../configs/tasktypes.service";
import { DepartmentsService } from "../../configs/departments.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-tasktype-form",
  templateUrl: "./tasktype-form.component.html",
  styleUrls: ["./tasktype-form.component.scss"]
})
export class TasktypeFormComponent implements OnInit {
  @Input() tasktypeOut: any;
  @Input() tasktypeOutCopy: any;
  @Input() mode: any;

  isDataReady: boolean;
  departments: any;
  nameMaxLength = AppConstants.MAX_LENGTH_NAME;
  codeMaxLength = AppConstants.MAX_LENGTH_CODE;
  btnName: string = "";
  colorPaletteCodes = AppConstants.COLOR_PALETTE_CODES;
  dataForm: FormGroup;

  constructor(
    private drawerRef: NzDrawerRef<string>,
    private notificationService: NotificationService,
    private helperService: HelperService,
    private tasktypesService: TasktypesService,
    private departmentsService: DepartmentsService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.btnName = this.mode === "update" ? "Update" : "Add";
    this.prepareData();
  }

  async prepareData() {
    /*this.tasktypeOut = {
      departmentId: 1,
      taskTypeName: "TT2719",
      taskCode: "QWE",
      colorCode: "#65CCAF",
    }*/
    if (!this.tasktypeOut) {
      this.tasktypeOut = {
        departmentId: null,
        taskCode: null,
        taskTypeName: null,
        colorCode: null
      };
    }
    this.tasktypeOutCopy = JSON.parse(JSON.stringify(this.tasktypeOut));
    await this.getDepartmentListSearch();
    this.buildFormData();
    this.isDataReady = true;
  }

  buildFormData() {
    this.dataForm = this.fb.group({
      departmentId: [this.tasktypeOutCopy.departmentId, [Validators.required]],
      taskTypeName: [
        this.tasktypeOutCopy.taskTypeName,
        [Validators.required, Validators.pattern(AppConstants.itemNameRE)]
      ],
      taskCode: [this.tasktypeOutCopy.taskCode, [Validators.required]],
      colorCode: [this.tasktypeOutCopy.colorCode, [Validators.required]]
    });
  }

  async getDepartmentListSearch() {
    await this.departmentsService
      .getDepartmentListSearch()
      .toPromise()
      .then((resp: any) => {
        this.departments = resp.entity;
      })
      .catch((error: any) => {
        this.departments = [];
      });
  }

  setColor(color: string) {
    this.tasktypeOutCopy.colorCode = color;
    this.dataForm.controls.colorCode.setValue(color);
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
    let successMessage = AppConstants.TASKTYPE_CREATION_SUCCESS;
    let errorMessage = AppConstants.TASKTYPE_CREATION_ERROR;
    let serviceName = "createTasktype";
    let isSuccess = false;
    let postObj = JSON.parse(JSON.stringify(this.dataForm.value));
    if (this.mode === "update") {
      postObj.id = this.tasktypeOutCopy.id;
      successMessage = AppConstants.TASKTYPE_MODIFICATION_SUCCESS;
      errorMessage = AppConstants.TASKTYPE_MODIFICATION_ERROR;
      serviceName = "updateTasktype";
    }
    await this.tasktypesService[serviceName](postObj)
      .toPromise()
      .then((resp: any) => {
        isSuccess = true;
        this.showNotification({
          type: "success",
          title: "Success",
          content: successMessage,
          duration: AppConstants.NOTIFICATION_DURATION
        });
      })
      .catch((error: any) => {
        let errorDetails = this.helperService.getErrorDetails(error);
        if (errorDetails !== '') {
          errorMessage = `<b>${errorMessage}</b>` + errorDetails;
        }
        this.showNotification({
          type: "error",
          title: "Error",
          content: errorMessage,
          duration: AppConstants.NOTIFICATION_DURATION
        });
      });
    this.close(isSuccess);
  }
}
