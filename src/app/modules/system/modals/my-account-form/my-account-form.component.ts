import {
  Component,
  OnInit,
  Input,
  ViewChild,
  TemplateRef,
} from "@angular/core";
import { UsersService } from "../../configs/users.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AppConstants } from "src/app/constants/AppConstants";
import { UploadChangeParam, NzDrawerRef, NzDrawerService } from "ng-zorro-antd";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { ImageUploadComponent } from "src/app/modules/shared/components/image-upload/image-upload.component";
import { NotificationSettingsComponent } from "../notification-settings/notification-settings.component";

@Component({
  selector: "app-my-account-form",
  templateUrl: "./my-account-form.component.html",
  styleUrls: ["./my-account-form.component.scss"],
})
export class MyAccountFormComponent implements OnInit {
  @ViewChild(ImageUploadComponent, { static: false })
  imageUploadComponent: ImageUploadComponent;
  @ViewChild("linkDrawerHeader", { static: false })
  linkDrawerHeader: TemplateRef<{}>;
  @Input() userOut: any;
  userOutCopy: any;
  dataForm: FormGroup;
  isDataReady: boolean;
  userDetails: any;
  linkInfo: any;
  title: string;
  childDrawerRef: any;
  constructor(
    private drawerRef: NzDrawerRef<string>,
    private notificationService: NotificationService,
    private usersService: UsersService,
    private helperService: HelperService,
    private fb: FormBuilder,
    private drawerService: NzDrawerService
  ) {}

  ngOnInit() {
    this.prepareData();
  }

  getLinks() {
    return this.linkInfo.filter((item: any) => item.isVisible === true);
  }

  async prepareData() {
    this.linkInfo = [
      {
        id: 1,
        title: "Notification Settings",
        type: "settings",
        modaltitle: "Notification Settings",
        isMandatoryFieldPresent: false,
        isVisible: true,
        isValid: true,
      },
    ];
    this.userOutCopy = JSON.parse(JSON.stringify(this.userOut));
    this.isDataReady = true;
    this.buildFormData();
  }

  buildFormData() {
    let isEmailNotification = false;
    if (this.userOutCopy.isEmailNotification === 1) {
      isEmailNotification = true;
    }
    this.dataForm = this.fb.group({
      firstName: [this.userOutCopy.firstName],
      lastName: [this.userOutCopy.lastName],
      loginId: [this.userOutCopy.loginId],
      thumbnail: [this.userOutCopy.thumbnail],
      isEmailNotification: [isEmailNotification],
    });
  }

  submitHandler() {
    if (this.imageUploadComponent.isChanged) {
      this.imageUploadComponent.handleUpload();
    } else {
      this.submitForm();
    }
  }

  linkClickHandler(link: any) {
    this.title = link.modaltitle;
    link.isValid = true;
    this.openFrom(link.type);
  }

  openFrom(type: string): void {
    if (type === "settings") {
      this.drawerRef.nzOffsetX = 500;
      this.childDrawerRef = this.drawerService.create<
        NotificationSettingsComponent,
        {
          parentDrawerRef: any;
        },
        string
      >({
        nzTitle: this.linkDrawerHeader,
        nzContent: NotificationSettingsComponent,
        nzContentParams: {
          parentDrawerRef: this.drawerRef,
        },
        nzClosable: false,
        //nzMaskClosable: false,
        //nzKeyboard: false,
        nzWidth: "500px",
        nzWrapClassName: "modal-wrapper",
        nzOnCancel: () =>
          new Promise((resolve, reject) => {
            this.drawerRef.nzOffsetX = 0;
            resolve(true);
            return;
          }),
      });

      this.childDrawerRef.afterOpen.subscribe(() => {});

      this.childDrawerRef.afterClose.subscribe((data) => {
        this.drawerRef.nzOffsetX = 0;
      });
    }
  }

  async submitForm() {
    let isSuccess = false;
    let successMessage = AppConstants.USER_MODIFICATION_SUCCESS;
    let errorMessage = AppConstants.USER_MODIFICATION_ERROR;
    for (const i in this.dataForm.controls) {
      this.dataForm.controls[i].markAsDirty();
      this.dataForm.controls[i].updateValueAndValidity();
    }
    if (!this.dataForm.valid) {
      return;
    }

    let postObj = JSON.parse(JSON.stringify(this.dataForm.value));
    if (postObj.isEmailNotification === true) {
      postObj.isEmailNotification = 1;
    } else {
      postObj.isEmailNotification = 0;
    }

    await this.usersService
      .updateUserDetails(this.userOut.id, postObj)
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

  showNotification(info: any) {
    this.notificationService.showNotification(info);
  }

  closeForm(): void {
    this.drawerRef.nzOffsetX = 0;
    this.childDrawerRef.close();
  }

  close(isSuccess): void {
    this.drawerRef.close(isSuccess);
  }
}
