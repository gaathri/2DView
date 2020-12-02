import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { AppConstants } from "src/app/constants/AppConstants";
import { NzDrawerRef, UploadChangeParam } from "ng-zorro-antd";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { DepartmentsService } from "../../configs/departments.service";
import { UsersService } from "../../configs/users.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ShowsService } from "../../shows/shows.service";
import { RolesService } from "../../configs/roles.service";
import { ImageUploadComponent } from "src/app/modules/shared/components/image-upload/image-upload.component";

@Component({
  selector: "app-user-form",
  templateUrl: "./user-form.component.html",
  styleUrls: ["./user-form.component.scss"],
})
export class UserFormComponent implements OnInit {
  @ViewChild(ImageUploadComponent, { static: false })
  imageUploadComponent: ImageUploadComponent;
  @Input() userOut: any;
  @Input() userOutCopy: any;
  @Input() mode: any;

  nameMaxLength = AppConstants.MAX_LENGTH_NAME;
  descMaxLength = AppConstants.MAX_LENGTH_DESC;
  mandatoryErrorInfo: any;
  departments: any;
  roles: any;
  clients: any;
  isDataReady: boolean;
  btnName: string = "";
  dataForm: FormGroup;
  grade: any = 0;
  showClientSelect: boolean;

  constructor(
    private drawerRef: NzDrawerRef<string>,
    private notificationService: NotificationService,
    private helperService: HelperService,
    private departmentsService: DepartmentsService,
    private rolesService: RolesService,
    private showsService: ShowsService,
    private usersService: UsersService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.btnName = this.mode === "update" ? "Update" : "Add";
    this.prepareData();
  }

  isValidArr(arr: any) {
    return this.helperService.isValidArr(arr);
  }

  async prepareData() {
    if (!this.userOut) {
      this.userOut = {
        storageUnit: "GB",
        roleIds: [],
      };
    }
    if (!this.userOut.storageUnit) {
      this.userOut.storageUnit = "GB";
    }
    this.userOutCopy = JSON.parse(JSON.stringify(this.userOut));
    this.buildFormData();
    await this.getDepartmentListSearch();
    await this.getRoleList();
    await this.getClientList();
    this.isDataReady = true;
  }

  buildFormData() {
    this.dataForm = this.fb.group({
      firstName: [
        this.userOutCopy.firstName,
        [Validators.required, Validators.pattern(AppConstants.userNameRE)],
      ],
      lastName: [
        this.userOutCopy.lastName,
        [Validators.required, Validators.pattern(AppConstants.userNameRE)],
      ],
      thumbnail: [this.userOutCopy.thumbnail],
      loginId: [
        this.userOutCopy.loginId,
        [Validators.email, Validators.required],
      ],
      designation: [this.userOutCopy.designation],
      skillSets: [this.userOutCopy.skillSets],
      grade: [this.userOutCopy.grade],
      department: [this.userOutCopy.department],
      allocatedDiskSpace: [this.userOutCopy.allocatedDiskSpace],
      storageUnit: [this.userOutCopy.storageUnit],
      roleIds: [this.userOutCopy.roleIds[0], [Validators.required]],
      clientId: [this.userOutCopy.clientId],
    });
    this.grade = this.userOutCopy.grade;
    this.checkRoleSelect();
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

  async getRoleList() {
    await this.rolesService
      .getRoles()
      .toPromise()
      .then((resp: any) => {
        this.roles = resp.entity;
      })
      .catch((error: any) => {
        this.roles = [];
      });
  }

  async getClientList() {
    await this.showsService
      .getClientList()
      .toPromise()
      .then((resp: any) => {
        this.clients = resp.entity;
      })
      .catch((error: any) => {
        this.clients = [];
      });
  }

  onChange($event: any): void {
    this.clearErrorInfo();
  }

  clearErrorInfo() {
    this.mandatoryErrorInfo = null;
  }

  onUploadChange(e: any) {
    this.userOutCopy.thumbnail = "";
    if (e.type === "success") {
      this.userOutCopy.thumbnail = e.fileDownloadUri;
    }
    if (e.type === "error") {
      let errorMessage = AppConstants.IMAGE_UPLOAD_ERROR;
      if (e.error) {
        let errorDetails = this.helperService.getErrorDetails(e.error);
        if (errorDetails !== "") {
          errorMessage = `<b>${errorMessage}</b>` + errorDetails;
        }
      }
      this.showNotification({
        type: "error",
        title: "Error",
        content: errorMessage,
        duration: AppConstants.NOTIFICATION_DURATION,
      });
    }
    this.dataForm.controls.thumbnail.setValue(this.userOutCopy.thumbnail);
    this.submitForm();
  }

  getInputError() {
    let inputError = "";
    let mandatoryStrings = ["firstName", "loginId"];
    inputError = this.helperService.getInvalidMandatoryStrings(
      this.userOutCopy,
      mandatoryStrings
    );
    if (inputError === "") {
      let mandatoryNumbers = ["showId"];
      inputError = this.helperService.getInvalidMandatoryNumbers(
        this.userOutCopy,
        mandatoryNumbers
      );
    }
    return inputError;
  }

  checkRoleSelect() {
    let item = this.helperService.findObjectInArrayByKey(
      this.roles,
      "id",
      this.dataForm.controls.roleIds.value
    );

    if (item && item.rolePrivilegeId === AppConstants.CLIENT_PRIVILEGE_ID) {
      this.showClientSelect = true;
      this.dataForm.get("clientId")!.setValidators(Validators.required);
    } else {
      this.showClientSelect = false;
      this.dataForm.get("clientId")!.clearValidators();
      this.dataForm.controls.clientId.setValue(null);
    }

    if (item && item.rolePrivilegeId === AppConstants.ARTIST_PRIVILEGE_ID) {
      this.dataForm.get("department")!.setValidators(Validators.required);
      this.dataForm.get("department")!.markAsDirty();
    } else {
      this.dataForm.get("department")!.clearValidators();
      this.dataForm.get("department")!.markAsPristine();
    }
    this.dataForm.get("department")!.updateValueAndValidity();
  }

  isDepartmentReq() {
    let req = false;
    let item = this.helperService.findObjectInArrayByKey(
      this.roles,
      "id",
      this.dataForm.controls.roleIds.value
    );
    if (item && item.rolePrivilegeId === AppConstants.ARTIST_PRIVILEGE_ID) {
      req = true;
    }
    return req;
  }

  submitHandler() {
    if (this.imageUploadComponent.isChanged) {
      this.imageUploadComponent.handleUpload();
    } else {
      this.submitForm();
    }
  }

  async submitForm() {
    for (const i in this.dataForm.controls) {
      this.dataForm.controls[i].markAsDirty();
      this.dataForm.controls[i].updateValueAndValidity();
    }
    if (!this.dataForm.valid) {
      return;
    }
    let successMessage = AppConstants.USER_CREATION_SUCCESS;
    let errorMessage = AppConstants.USER_CREATION_ERROR;
    let serviceName = "createUser";
    let isSuccess = false;
    let postObj = JSON.parse(JSON.stringify(this.dataForm.value));
    if (postObj.roleIds) {
      postObj.roleIds = [postObj.roleIds];
    }
    if (this.mode === "update") {
      postObj.id = this.userOutCopy.id;
      successMessage = AppConstants.USER_MODIFICATION_SUCCESS;
      errorMessage = AppConstants.USER_MODIFICATION_ERROR;
      serviceName = "updateUser";
    }
    await this.usersService[serviceName](postObj)
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
