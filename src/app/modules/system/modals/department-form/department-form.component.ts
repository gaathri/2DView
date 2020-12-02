import {
  Component,
  OnInit,
  Input,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { NzDrawerRef } from "ng-zorro-antd";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { DepartmentsService } from "../../configs/departments.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-department-form",
  templateUrl: "./department-form.component.html",
  styleUrls: ["./department-form.component.scss"],
})
export class DepartmentFormComponent implements OnInit {
  @Input() departmentOut: any;
  @Input() departmentOutCopy: any;
  @Input() mode: any;
  isDataReady: boolean;
  title: string;
  childDrawerRef: any;
  nameMaxLength = AppConstants.MAX_LENGTH_NAME;
  descMaxLength = AppConstants.MAX_LENGTH_DESC;
  btnName: string = "";
  dataForm: FormGroup;

  constructor(
    private drawerRef: NzDrawerRef<string>,
    private notificationService: NotificationService,
    private helperService: HelperService,
    private departmentsService: DepartmentsService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.btnName = this.mode === "update" ? "Update" : "Add";
    this.prepareData();
  }

  prepareData() {
    if (!this.departmentOut) {
      this.departmentOut = {
        departmentName: "",
        departmentDesc: "",
      };
    }
    this.departmentOutCopy = JSON.parse(JSON.stringify(this.departmentOut));
    this.buildFormData();
    this.isDataReady = true;
  }

  buildFormData() {
    this.dataForm = this.fb.group({
      departmentName: [
        this.departmentOutCopy.departmentName,
        [Validators.required, Validators.pattern(AppConstants.itemNameRE)],
      ],
      departmentDesc: [this.departmentOutCopy.departmentDesc],
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

    let successMessage = AppConstants.DEPARTMENT_CREATION_SUCCESS;
    let errorMessage = AppConstants.DEPARTMENT_CREATION_ERROR;
    let serviceName = "createDepartment";
    let isSuccess = false;
    let postObj = JSON.parse(JSON.stringify(this.dataForm.value));
    if (this.mode === "update") {
      postObj.id = this.departmentOutCopy.id;
      successMessage = AppConstants.DEPARTMENT_MODIFICATION_SUCCESS;
      errorMessage = AppConstants.DEPARTMENT_MODIFICATION_ERROR;
      serviceName = "updateDepartment";
    }
    await this.departmentsService[serviceName](postObj)
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

  showNotification(info: any) {
    this.notificationService.showNotification(info);
  }

  close(isSuccess): void {
    this.drawerRef.close(isSuccess);
  }
}
