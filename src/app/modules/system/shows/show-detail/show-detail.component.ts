import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { LoggerService } from "src/app/modules/core/services/logger.service";
import { ShowsService } from "../shows.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { NzDrawerService, NzModalService } from "ng-zorro-antd";
import { ShowFormComponent } from "../../modals/show-form/show-form.component";
import { InteractionService } from "src/app/modules/core/services/interaction.service";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { BackupFormComponent } from "../../modals/backup-form/backup-form.component";
import { environment } from "src/environments/environment";
import { AuthenticationService } from "src/app/modules/core/authentication/authentication.service";

@Component({
  selector: "app-show-detail",
  templateUrl: "./show-detail.component.html",
  styleUrls: ["./show-detail.component.scss"],
})
export class ShowDetailComponent implements OnInit {
  @ViewChild("drawerHeader", { static: false }) drawerHeader: TemplateRef<{}>;
  childDrawerRef: any;
  isDataReady: boolean;
  isDataRefreshReady: boolean;
  isEmptyData: boolean;
  showId: any;
  showIn: any;
  showOut: any;
  showStatus: any;
  overviewPanel = {
    active: environment.production,
    disabled: false,
    name: "Show Overview",
    customStyle: {
      //background: '#212121',
      "border-radius": "0px",
      "margin-bottom": "8px",
      border: "0px",
    },
  };
  cardData: any;
  mode = "update";
  isReadOnly: boolean;
  drawerTitle: any;
  isAlertVisible: boolean;
  constructor(
    private showsService: ShowsService,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private logger: LoggerService,
    private helperService: HelperService,
    private drawerService: NzDrawerService,
    private modalService: NzModalService,
    private interactionService: InteractionService,
    private notificationService: NotificationService,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    this.activatedRouter.params.subscribe((params) => {
      this.showId = params["showId"];
      this.prepareData();
    });
    this.isReadOnly = this.helperService.isReadOnly(
      AppConstants.PERMISSIONS.SHOW
    );
  }

  linkClickHandler(type: any) {
    let routerLink = "/system/listing/shows";
    this.router.navigate([routerLink]);
  }

  onPageUpdate(e: any) {
    this.prepareData();
  }

  async prepareData() {
    this.isDataRefreshReady = false;
    await this.getShowInfo();
    await this.getShowStatus();

    if (this.showIn && this.showStatus) {
      this.isEmptyData = false;
      this.interactionService.sendInteraction("breadcrumb", "shot-listing", {
        showId: this.showId,
        showName: this.showIn.showName,
      });
      this.prepareCardData();
    } else {
      this.isEmptyData = true;
    }
  }

  async getShowInfo() {
    await this.showsService
      .getShowInfo(this.showId)
      .toPromise()
      .then((resp: any) => {
        this.showIn = resp.entity;
      })
      .catch((error: any) => {
        if (
          error &&
          error.status === 400 &&
          error.error &&
          error.error.body &&
          error.error.body[0]
        ) {
          this.showIn = null;
          if (
            error.error.body[0].code === 1026 &&
            error.error.body[0].message ===
              "Please contact admin to access requested show"
          ) {
            this.authService.logout();
          }
        }
      });
  }

  async getShowStatus() {
    await this.showsService
      .getShowStatus(this.showId)
      .toPromise()
      .then((resp: any) => {
        this.showStatus = resp.entity;
      })
      .catch((error: any) => {
        this.showStatus = null;
      });
  }

  prepareCardData() {
    this.cardData = {
      headerTitle: this.showIn.showName,
      footerTitle: "Description",
      footerSubTitle: this.showIn.description,
      thumbnail: this.showIn.thumbnail,
      isFavorite: this.showIn.favorite ? true : false,
      descriptions: [
        /*{
          name: "Status",
          class: "label",
          value: this.showIn.status
        },*/
        {
          name: "Show ID",
          class: "label",
          value: this.showIn.id,
        },
        {
          name: "Client",
          class: "label label-green",
          value: this.showIn.clientName,
        },
        {
          name: "Shot Attributes",
          class: "label label-green",
          value: this.showIn.shotAttributeNames,
        },
      ],
    };
    this.isDataReady = true;
    this.isDataRefreshReady = true;
  }

  backupHandler() {
    this.openBackupForm();
  }

  deleteHandler() {
    this.isAlertVisible = true;
  }

  deleteShowConfirm = async () => {
    let successMessage = "Show has been successfully deleted.";
    let errorMessage = "Show deletion failed.";
    this.isAlertVisible = false;
    await this.showsService
      .deleteShow(this.showIn.id)
      .toPromise()
      .then((resp) => {
        this.showNotification({
          type: "success",
          title: "Success",
          content: successMessage,
          duration: AppConstants.NOTIFICATION_DURATION,
        });
        this.linkClickHandler("show-listing");
      })
      .catch((error) => {
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
  };

  deleteShowCancel = () => {
    this.isAlertVisible = false;
  };

  async editHandler() {
    await this.getShow(this.showId);
    if (this.showOut) {
      this.openShowForm();
    }
  }

  async likeHandler() {
    if (this.showIn.favorite) {
      await this.dislikeShow(this.showId);
    } else {
      await this.likeShow(this.showId);
    }
    //await this.dislikeShow(this.showId);
  }

  async getShow(id: any) {
    this.showOut = null;
    await this.showsService
      .getShow(id)
      .toPromise()
      .then((resp) => {
        if (resp && resp.valid && resp.entity) {
          this.showOut = resp.entity;
        }
      })
      .catch((error) => {});
  }

  async dislikeShow(id: any) {
    let successMessage = AppConstants.SHOW_DISLIKE_SUCCESS;
    let errorMessage = AppConstants.SHOW_DISLIKE_ERROR;
    await this.showsService
      .dislikeShow(id)
      .toPromise()
      .then((resp) => {
        this.showNotification({
          type: "success",
          title: "Success",
          content: successMessage,
          duration: AppConstants.NOTIFICATION_DURATION,
        });
        this.prepareData();
      })
      .catch((error) => {
        if (error && error.error && error.error.body) {
          if (error.error.body[0] && error.error.body[0].message) {
            errorMessage =
              errorMessage + "<br/>Reason : " + error.error.body[0].message;
          }
        }
        this.showNotification({
          type: "error",
          title: "Error",
          content: errorMessage,
          duration: AppConstants.NOTIFICATION_DURATION,
        });
      });
  }
  async likeShow(id: any) {
    let likeIn = {
      entityTypeName: "Show",
      entityId: id,
    };
    let successMessage = AppConstants.SHOW_LIKE_SUCCESS;
    let errorMessage = AppConstants.SHOW_LIKE_ERROR;
    await this.showsService
      .likeShow(likeIn)
      .toPromise()
      .then((resp) => {
        this.showNotification({
          type: "success",
          title: "Success",
          content: successMessage,
          duration: AppConstants.NOTIFICATION_DURATION,
        });
        this.prepareData();
      })
      .catch((error) => {
        if (error && error.error && error.error.body) {
          if (error.error.body[0] && error.error.body[0].message) {
            errorMessage =
              errorMessage + "<br/>Reason : " + error.error.body[0].message;
          }
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

  openBackupForm(): void {
    this.drawerTitle = "Backup Show";
    this.childDrawerRef = this.drawerService.create<
      BackupFormComponent,
      { showOut: any },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: BackupFormComponent,
      nzContentParams: {
        showOut: this.showIn,
      },
      nzClosable: false,
      //nzWidth: "30%",
      nzWidth: "500px",
      nzWrapClassName: "modal-wrapper",
      nzOnCancel: () =>
        new Promise((resolve, reject) => {
          this.modalService.confirm({
            nzTitle: AppConstants.EXIT_WARNING_MESSAGE,
            nzOkText: "Yes",
            nzOkType: "primary",
            nzOnOk: () => resolve(true),
            nzCancelText: "No",
            //nzCancelType: "primary",
            nzOnCancel: () => resolve(false),
            nzNoAnimation: true,
          });
          return;
        }),
    });

    this.childDrawerRef.afterOpen.subscribe(() => {});

    this.childDrawerRef.afterClose.subscribe((isSuccess) => {
      if (isSuccess) {
        this.prepareData();
      }
    });
  }

  openShowForm(): void {
    this.drawerTitle = "Edit Show";
    this.childDrawerRef = this.drawerService.create<
      ShowFormComponent,
      { showOut: any; mode: string },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: ShowFormComponent,
      nzContentParams: {
        showOut: this.showOut,
        mode: this.mode,
      },
      nzClosable: false,
      //nzWidth: "30%",
      nzWidth: "500px",
      nzWrapClassName: "modal-wrapper",
      nzOnCancel: () =>
        new Promise((resolve, reject) => {
          this.modalService.confirm({
            nzTitle: AppConstants.EXIT_WARNING_MESSAGE,
            nzOkText: "Yes",
            nzOkType: "primary",
            nzOnOk: () => resolve(true),
            nzCancelText: "No",
            //nzCancelType: "primary",
            nzOnCancel: () => resolve(false),
            nzNoAnimation: true,
          });
          return;
        }),
    });

    this.childDrawerRef.afterOpen.subscribe(() => {});

    this.childDrawerRef.afterClose.subscribe((isSuccess) => {
      if (isSuccess) {
        this.prepareData();
      }
    });
  }

  closeForm(): void {
    this.childDrawerRef.close();
  }
}
