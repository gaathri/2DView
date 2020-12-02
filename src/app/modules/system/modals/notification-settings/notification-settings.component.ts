import { Component, OnInit, Input } from "@angular/core";
import { HomeService } from "../../home.service";
import { NotificationsService } from "../../notifications.service";
import { NzDrawerRef } from "ng-zorro-antd";
import { AppConstants } from "src/app/constants/AppConstants";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { NotificationService } from "src/app/modules/core/services/notification.service";

@Component({
  selector: "app-notification-settings",
  templateUrl: "./notification-settings.component.html",
  styleUrls: ["./notification-settings.component.scss"],
})
export class NotificationSettingsComponent implements OnInit {
  @Input() parentDrawerRef: any;
  notificationTypes: any;
  _notificationTypes: any;
  selected: any = [];
  isDataReady: boolean;

  constructor(
    private notificationsService: NotificationsService,
    private notificationService: NotificationService,
    private drawerRef: NzDrawerRef<string>,
    private helperService: HelperService
  ) {}

  ngOnInit() {
    this.prepareData();
  }
  async prepareData() {
    await this.getNotificationtypes();
    await this.getUserSettings();
    this.prepareChecks();
    this.isDataReady = true;
  }

  prepareChecks() {
    for (let i = 0; i < this.notificationTypes.length; i++) {
      for (let j = 0; j < this.notificationTypes[i].notifications.length; j++) {
        let item = this.notificationTypes[i].notifications[j];
        if (this.selected.includes(item.id)) {
          item.selected = true;
        } else {
          item.selected = false;
        }
      }
    }
  }

  changeHandler(e, i) {
    //console.log(e, i);
    for (let j = 0; j < this.notificationTypes[i].notifications.length; j++) {
      let notification = this.notificationTypes[i].notifications[j];
      if (this.isPresent(e, notification)) {
        notification.selected = true;
      } else {
        notification.selected = false;
      }
    }
  }

  isPresent(parent, child) {
    let present = false;
    for (let i = 0; i < parent.length; i++) {
      if (child.id == parent[i].id) {
        present = true;
        break;
      }
    }
    return present;
  }

  isChecked(column, i, j) {
    if (this.notificationTypes[i].notifications[j].selected) {
      return true;
    }
    return false;
    //this.notificationTypes[i].notifications[j].selected
    //console.log(column, i, j);
    //return this.tableColumnsArrCopy[i].fields[j].defaultDisplay;
  }

  /*changeHandler(e) {
    this.selected = e;
    console.log(e);
  }

  isChecked(notificationType: any) {
    let obj = this.selected.find((data) => data === notificationType.id);
    if (obj) {
      return true;
    } else {
      return false;
    }
  }*/

  getSelected() {
    let selected = [];
    for (let i = 0; i < this.notificationTypes.length; i++) {
      for (let j = 0; j < this.notificationTypes[i].notifications.length; j++) {
        let item = this.notificationTypes[i].notifications[j];
        if (item.selected) {
          selected.push(item.id);
        }
      }
    }
    return selected;
  }
  submitHandler() {
    let obj = {
      notificationIds: this.getSelected(),
    };

    this.parentDrawerRef.nzOffsetX = 0;
    this.notificationsService
      .addUserSettings(obj)
      .toPromise()
      .then((resp) => {
        let successMessage =
          "Notification settings have been successfully saved.";
        this.showNotification({
          type: "success",
          title: "Success",
          content: successMessage,
          duration: AppConstants.NOTIFICATION_DURATION,
        });
      })
      .catch((error) => {
        let errorMessage = "Error while save notification settings.";
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
    this.drawerRef.close(null);
  }

  async getNotificationtypes() {
    await this.notificationsService
      .getNotificationtypes()
      .toPromise()
      .then((resp) => {
        this._notificationTypes = resp.entity[0].categories;
        this.notificationTypes = JSON.parse(
          JSON.stringify(this._notificationTypes)
        );
      })
      .catch((error) => {
        this._notificationTypes = null;
      });
  }

  async getUserSettings() {
    await this.notificationsService
      .getUserSettings()
      .toPromise()
      .then((resp) => {
        if (resp && resp.entity && resp.entity.notificationIds) {
          this.selected = resp.entity.notificationIds;
          //this.selected = [2, 5, 8];
        }
      })
      .catch((error) => {
        this.selected = [];
      });
  }

  showNotification(info: any) {
    this.notificationService.showNotification(info);
  }

  isAllChecked() {
    let allChecked = true;
    for (let i = 0; i < this.notificationTypes.length; i++) {
      for (let j = 0; j < this.notificationTypes[i].notifications.length; j++) {
        let item = this.notificationTypes[i].notifications[j];
        if (!item.selected) {
          allChecked = false;
          break;
        }
      }
    }
    return allChecked;
  }

  updateAllChecked(e) {
    //return;
    for (let i = 0; i < this.notificationTypes.length; i++) {
      for (let j = 0; j < this.notificationTypes[i].notifications.length; j++) {
        let item = this.notificationTypes[i].notifications[j];
        if (e) {
          item.selected = true;
        } else {
          item.selected = false;
        }
      }
    }
  }
}
