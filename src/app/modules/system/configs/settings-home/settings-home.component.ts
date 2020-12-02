import { Component, OnInit } from "@angular/core";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { HomeService } from "src/app/modules/system/home.service";

import { Role } from "src/app/modules/shared/model/role";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { AppConstants } from "src/app/constants/AppConstants";

@Component({
  selector: "app-settings-home",
  templateUrl: "./settings-home.component.html",
  styleUrls: ["./settings-home.component.scss"],
})
export class SettingsHomeComponent implements OnInit {
  isAdmin: boolean;
  maxUsers: any;
  dataForm: FormGroup;
  isDataReady: boolean;
  USERS_LIMIT_MIN = 10;
  USERS_LIMIT_MAX = 10000;
  constructor(
    private notificationService: NotificationService,
    private helperService: HelperService,
    private homeService: HomeService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    let role = this.helperService.getRole();
    this.isAdmin = false;
    if (role === Role.ADMIN) {
      this.isAdmin = true;
    } else if (role === Role.PLATFORM_ADMIN) {
      this.prepareData();
    }
  }

  async prepareData() {
    await this.getMaxUser();
    this.buildFormData();
    this.isDataReady = true;
  }

  buildFormData() {
    this.dataForm = this.fb.group({
      maxUsers: [
        this.maxUsers,
        [
          Validators.required,
          Validators.min(this.USERS_LIMIT_MIN),
          Validators.max(this.USERS_LIMIT_MAX),
        ],
      ],
    });
  }

  async getMaxUser() {
    await this.homeService
      .getMaxUser()
      .toPromise()
      .then((resp: any) => {
        this.maxUsers = resp.entity;
      })
      .catch((error: any) => {
        this.maxUsers = null;
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

    let studioIn = {
      maxUsers: this.dataForm.value.maxUsers,
    };
    let successMessage = "Studio settings have been successfully saved.";
    let errorMessage = "Error while save studio settings.";
    await this.homeService
      .inlineEdit(studioIn)
      .toPromise()
      .then((resp: any) => {
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
  }

  showNotification(info: any) {
    this.notificationService.showNotification(info);
  }
}
