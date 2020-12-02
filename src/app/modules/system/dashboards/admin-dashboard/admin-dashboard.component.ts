import { Component, OnInit, ViewChild } from "@angular/core";
import { AppConstants } from "src/app/constants/AppConstants";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UploadChangeParam } from "ng-zorro-antd";
import { AdminDashboardService } from "../admin-dashboard.service";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { InteractionService } from "src/app/modules/core/services/interaction.service";
import { ImageUploadComponent } from "src/app/modules/shared/components/image-upload/image-upload.component";

@Component({
  selector: "app-admin-dashboard",
  templateUrl: "./admin-dashboard.component.html",
  styleUrls: ["./admin-dashboard.component.scss"],
})
export class AdminDashboardComponent implements OnInit {
  @ViewChild(ImageUploadComponent, { static: false })
  imageUploadComponent: ImageUploadComponent;
  nameMaxLength = AppConstants.MAX_LENGTH_NAME;
  dataForm: FormGroup;
  studioOut: any;
  studioOutCopy: any;
  isDataReady: boolean;
  constructor(
    private fb: FormBuilder,
    private adminDashboardService: AdminDashboardService,
    private notificationService: NotificationService,
    private helperService: HelperService,
    private interactionService: InteractionService
  ) {}

  ngOnInit() {
    this.prepareData();
  }

  async prepareData() {
    this.isDataReady = false;
    await this.getStudio(AppConstants.MY_STUDIO_ID);
    if (!this.studioOut) {
      this.studioOut = {
        studioName: null,
        studioLogo: null,
        services: null,
        studioDesc: null,
      };
    }

    this.studioOutCopy = JSON.parse(JSON.stringify(this.studioOut));
    this.buildFormData();
    this.isDataReady = true;
  }

  async getStudio(id: any) {
    await this.adminDashboardService
      .getStudio(id)
      .toPromise()
      .then((resp) => {
        this.studioOut = resp.entity;
      })
      .catch((error) => {
        this.studioOut = null;
      });
  }

  buildFormData() {
    this.dataForm = this.fb.group({
      studioName: [this.studioOutCopy.studioName, [Validators.required]],
      studioLogo: [this.studioOutCopy.studioLogo],
      services: [this.studioOutCopy.services, [Validators.required]],
      studioDesc: [this.studioOutCopy.studioDesc, [Validators.required]],
    });
  }

  onUploadChange(e: any) {
    this.studioOutCopy.thumbnail = "";
    if (e.type === "success") {
      this.studioOutCopy.studioLogo = e.fileDownloadUri;
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
    this.dataForm.controls.studioLogo.setValue(this.studioOutCopy.studioLogo);
    this.submitForm();
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

    let successMessage = AppConstants.STUDIO_MODIFICATION_SUCCESS;
    let errorMessage = AppConstants.STUDIO_MODIFICATION_ERROR;
    let postObj = JSON.parse(JSON.stringify(this.dataForm.value));
    postObj.id = this.studioOutCopy.id;
    await this.adminDashboardService
      .updateStudio(postObj)
      .toPromise()
      .then((resp: any) => {
        this.showNotification({
          type: "success",
          title: "Success",
          content: successMessage,
          duration: AppConstants.NOTIFICATION_DURATION,
        });
        this.interactionService.sendInteraction(
          "studio_update",
          "logo_update",
          { url: resp.studioLogo }
        );
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
    this.prepareData();
  }

  showNotification(info: any) {
    this.notificationService.showNotification(info);
  }
}
