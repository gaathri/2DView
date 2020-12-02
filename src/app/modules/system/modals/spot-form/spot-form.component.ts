import { Component, OnInit, Input } from "@angular/core";
import { NzDrawerRef } from "ng-zorro-antd";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { ShowsService } from "../../shows/shows.service";
import { SpotsService } from "../../shows/spots.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-spot-form",
  templateUrl: "./spot-form.component.html",
  styleUrls: ["./spot-form.component.scss"],
})
export class SpotFormComponent implements OnInit {
  @Input() spotOut: any;
  @Input() spotOutCopy: any;
  @Input() mode: any;
  @Input() disableShowSelect: any;
  @Input() showName: any;

  isDataReady: boolean;
  shows: any;
  nameMaxLength = AppConstants.MAX_LENGTH_NAME;
  descMaxLength = AppConstants.MAX_LENGTH_DESC;
  btnName: string = "";
  dataForm: FormGroup;

  constructor(
    private drawerRef: NzDrawerRef<string>,
    private notificationService: NotificationService,
    private helperService: HelperService,
    private showsService: ShowsService,
    private spotsService: SpotsService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.btnName = this.mode === "update" ? "Update" : "Add";
    this.prepareData();
  }

  async prepareData() {
    if (!this.spotOut) {
      this.spotOut = {
        showId: null,
      };
    }
    this.spotOutCopy = JSON.parse(JSON.stringify(this.spotOut));
    if (!this.disableShowSelect) {
      await this.getShowList();
    }
    this.buildFormData();
    this.isDataReady = true;
  }

  buildFormData() {
    this.dataForm = this.fb.group({
      showId: [this.spotOutCopy.showId, [Validators.required]],
      spotName: [
        this.spotOutCopy.spotName,
        [Validators.required, Validators.pattern(AppConstants.itemNameRE)],
      ],
      description: [this.spotOutCopy.description],
    });
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

  showNotification(info: any) {
    this.notificationService.showNotification(info);
  }

  isValidArr(arr: any) {
    return this.helperService.isValidArr(arr);
  }

  async submitHandler() {
    for (const i in this.dataForm.controls) {
      this.dataForm.controls[i].markAsDirty();
      this.dataForm.controls[i].updateValueAndValidity();
    }

    if (!this.dataForm.valid) {
      return;
    }
    let successMessage = AppConstants.SPOT_CREATION_SUCCESS;
    let errorMessage = AppConstants.SPOT_CREATION_ERROR;
    let serviceName = "createSpot";
    let isSuccess = false;
    let postObj = JSON.parse(JSON.stringify(this.dataForm.value));
    if (this.mode === "update") {
      postObj.id = this.spotOutCopy.id;
      successMessage = AppConstants.SPOT_MODIFICATION_SUCCESS;
      errorMessage = AppConstants.SPOT_MODIFICATION_ERROR;
      serviceName = "updateSpot";
    }
    await this.spotsService[serviceName](postObj)
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

  close(isSuccess: any): void {
    this.drawerRef.close(isSuccess);
  }
}
