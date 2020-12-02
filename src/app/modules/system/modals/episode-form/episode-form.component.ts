import { Component, OnInit, Input } from "@angular/core";
import { NzDrawerRef } from "ng-zorro-antd";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { ShowsService } from "../../shows/shows.service";
import { EpisodesService } from "../../shows/episodes.service";
import { SeasonsService } from "../../shows/seasons.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-episode-form",
  templateUrl: "./episode-form.component.html",
  styleUrls: ["./episode-form.component.scss"],
})
export class EpisodeFormComponent implements OnInit {
  @Input() episodeOut: any;
  @Input() episodeOutCopy: any;
  @Input() mode: any;
  @Input() disableShowSelect: boolean;
  @Input() showName: any;

  isDataReady: boolean;
  shows: any;
  seasons: any;
  nameMaxLength = AppConstants.MAX_LENGTH_NAME;
  descMaxLength = AppConstants.MAX_LENGTH_DESC;
  btnName: string = "";
  dataForm: FormGroup;

  constructor(
    private drawerRef: NzDrawerRef<string>,
    private notificationService: NotificationService,
    private helperService: HelperService,
    private showsService: ShowsService,
    private episodesService: EpisodesService,
    private seasonsService: SeasonsService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.btnName = this.mode === "update" ? "Update" : "Add";
    this.prepareData();
  }

  async prepareData() {
    if (!this.episodeOut) {
      this.episodeOut = {
        showId: null,
      };
    }
    this.episodeOutCopy = JSON.parse(JSON.stringify(this.episodeOut));
    if (!this.disableShowSelect) {
      await this.getShowList();
    }

    if (this.episodeOut && this.episodeOut.showId) {
      await this.getSeasonList();
    }
    this.buildFormData();
    this.isDataReady = true;
  }

  buildFormData() {
    this.dataForm = this.fb.group({
      showId: [this.episodeOutCopy.showId, [Validators.required]],
      episodeName: [
        this.episodeOutCopy.episodeName,
        [Validators.required, Validators.pattern(AppConstants.itemNameRE)],
      ],
      description: [this.episodeOutCopy.description],
      seasonId: [this.episodeOutCopy.seasonId],
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

  async getSeasonList() {
    await this.seasonsService
      .getSeasonList(this.episodeOutCopy.showId)
      .toPromise()
      .then((resp: any) => {
        this.seasons = resp.entity;
      })
      .catch((error: any) => {
        this.seasons = [];
      });
  }

  showChangeHandler() {
    this.episodeOutCopy.seasonId = null;
    this.dataForm.controls.seasonId.setValue(null);
    this.seasons = [];
    this.episodeOutCopy.showId = this.dataForm.controls.showId.value;
    this.getSeasonList();
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
    let successMessage = AppConstants.EPISODE_CREATION_SUCCESS;
    let errorMessage = AppConstants.EPISODE_CREATION_ERROR;
    let serviceName = "createEpisode";
    let isSuccess = false;
    let postObj = JSON.parse(JSON.stringify(this.dataForm.value));
    if (this.mode === "update") {
      postObj.id = this.episodeOutCopy.id;
      successMessage = AppConstants.EPISODE_MODIFICATION_SUCCESS;
      errorMessage = AppConstants.EPISODE_MODIFICATION_ERROR;
      serviceName = "updateEpisode";
    }
    await this.episodesService[serviceName](postObj)
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
