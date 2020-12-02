import { Component, OnInit, Input } from "@angular/core";
import { NzDrawerRef } from "ng-zorro-antd";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { ShowsService } from "../../shows/shows.service";
import { SeasonsService } from "../../shows/seasons.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-season-form",
  templateUrl: "./season-form.component.html",
  styleUrls: ["./season-form.component.scss"],
})
export class SeasonFormComponent implements OnInit {
  @Input() seasonOut: any;
  @Input() seasonOutCopy: any;
  @Input() mode: any;
  @Input() disableShowSelect: boolean;
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
    private seasonsService: SeasonsService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.btnName = this.mode === "update" ? "Update" : "Add";
    this.prepareData();
  }

  async prepareData() {
    if (!this.seasonOut) {
      this.seasonOut = {
        showId: null,
      };
    }
    this.seasonOutCopy = JSON.parse(JSON.stringify(this.seasonOut));
    if (!this.disableShowSelect) {
      await this.getShowList();
    }
    this.buildFormData();
    this.isDataReady = true;
  }

  buildFormData() {
    this.dataForm = this.fb.group({
      showId: [this.seasonOut.showId, [Validators.required]],
      seasonName: [
        this.seasonOut.seasonName,
        [Validators.required, Validators.pattern(AppConstants.itemNameRE)],
      ],
      description: [this.seasonOut.description],
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

    let successMessage = AppConstants.SEASON_CREATION_SUCCESS;
    let errorMessage = AppConstants.SEASON_CREATION_ERROR;
    let serviceName = "createSeason";
    let isSuccess = false;
    let postObj = JSON.parse(JSON.stringify(this.dataForm.value));
    if (this.mode === "update") {
      postObj.id = this.seasonOutCopy.id;
      successMessage = AppConstants.SEASON_MODIFICATION_SUCCESS;
      errorMessage = AppConstants.SEASON_MODIFICATION_ERROR;
      serviceName = "updateSeason";
    }
    await this.seasonsService[serviceName](postObj)
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

  close(isSuccess): void {
    this.drawerRef.close(isSuccess);
  }
}
