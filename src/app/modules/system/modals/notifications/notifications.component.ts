import { Component, OnInit } from "@angular/core";
import { NotificationsService } from "../../notifications.service";
import { Page } from "src/app/modules/shared/model/page";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { AppConstants } from "src/app/constants/AppConstants";

@Component({
  selector: "app-notifications",
  templateUrl: "./notifications.component.html",
  styleUrls: ["./notifications.component.scss"],
})
export class NotificationsComponent implements OnInit {
  isDataReady: boolean;
  isLoading: boolean;
  dataArr: any;
  windowHeight: any;
  itemsCount: any;
  pageNumber: any;
  page = new Page();
  constructor(
    private notificationsService: NotificationsService,
    private notificationService: NotificationService,
    private helperService: HelperService
  ) {}

  ngOnInit() {
    this.pageNumber = 0;
    this.getWindowHeight();
    this.prepareData();
  }

  prepareData() {
    let availHeight = this.windowHeight - 150;
    //let itemHeight = 125;
    let itemHeight = 105;
    this.itemsCount = Math.floor(availHeight / itemHeight);
    this.page.pageNumber = this.pageNumber;
    this.page.size = this.itemsCount;
    this.page.search = "";
    this.page.sortBy = "";
    this.page.orderBy = "";
    this.isLoading = true;
    //this.dataArr = [];
    this.notificationsService.getNotificationList(this.page).subscribe(
      (resp) => {
        if (resp && resp.valid) {
          this.page.totalElements = resp.total;
          this.page.totalPages = Math.ceil(resp.total / this.page.size);
          this.dataArr = resp.coll;
          if (
            this.page.pageNumber == 0 &&
            resp.coll &&
            resp.coll[0].createdDate
          ) {
            this.helperService.latestTimeStamp = resp.coll[0].createdDate;
          }
        } else {
          this.onDataError(resp);
        }
        this.isLoading = false;
        this.isDataReady = true;
      },
      (error) => {
        this.isLoading = false;
        this.isDataReady = true;
        this.onDataError(error);
      }
    );
  }

  /*this.dataArr = [];
    for (let i = 0; i < this.itemsCount; i++) {
      let info = this.getInfo(i);
      this.dataArr.push(info);
    }*/

  onDataError(error: any) {
    this.dataArr = [];
  }

  getInfo(i: any) {
    let info = new Object();
    let msgs = [
      "justify-content-between justify-content-between justify-content-between justify-content-between justify-content-between",
      "justify-content-between justify-content-between justify-content-between justify-content-between justify-content-between justify-content-between justify-content-between justify-content-between justify-content-between justify-content-between justify-content-between justify-content-between justify-content-between justify-content-between justify-content-between justify-content-between justify-content-between justify-content-between justify-content-between justify-content-between ",
    ];
    let index = i % 2;
    info = {
      firstName: "A",
      lastName: i + "Name",
      thumbnail: "",
      msg: msgs[index],
      date: this.getWindowHeight(),
    };
    return info;
  }

  getWindowHeight() {
    this.windowHeight = document.documentElement.clientHeight;
    return this.windowHeight;
  }

  onPageIndexChange(event: any) {
    this.pageNumber = event - 1;
    this.prepareData();
  }

  markHandler(id: any) {
    let successMessage = "Notification has been successfully marked as read.";
    let errorMessage = "Notification updation failed.";

    this.notificationsService.markNotificationAsRead(id).subscribe(
      (resp) => {
        if (resp && resp.valid) {
          this.showNotification({
            type: "success",
            title: "Success",
            content: successMessage,
            duration: AppConstants.NOTIFICATION_DURATION,
          });
          this.prepareData();
        }
      },
      (error) => {
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
      }
    );
  }

  onMarkAll() {}

  showNotification(info: any) {
    this.notificationService.showNotification(info);
  }
}
