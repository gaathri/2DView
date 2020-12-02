import { Component, OnInit, Input } from "@angular/core";
import { NzDrawerRef } from "ng-zorro-antd";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { ShowsService } from "../../shows/shows.service";
import { EpisodesService } from "../../shows/episodes.service";
import { SequencesService } from "../../shows/sequences.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-sequence-form",
  templateUrl: "./sequence-form.component.html",
  styleUrls: ["./sequence-form.component.scss"],
})
export class SequenceFormComponent implements OnInit {
  @Input() sequenceOut: any;
  @Input() sequenceOutCopy: any;
  @Input() mode: any;
  @Input() disableShowSelect: boolean;
  @Input() showName: any;

  isDataReady: boolean;
  shows: any;
  episodes: any;
  nameMaxLength = AppConstants.MAX_LENGTH_NAME;
  descMaxLength = AppConstants.MAX_LENGTH_DESC;
  btnName: string = "";
  dataForm: FormGroup;

  constructor(
    private drawerRef: NzDrawerRef<string>,
    private notificationService: NotificationService,
    private helperService: HelperService,
    private showsService: ShowsService,
    private sequencesService: SequencesService,
    private episodesService: EpisodesService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.btnName = this.mode === "update" ? "Update" : "Add";
    this.prepareData();
  }

  async prepareData() {
    if (!this.sequenceOut) {
      this.sequenceOut = {
        showId: null,
      };
    }
    this.sequenceOutCopy = JSON.parse(JSON.stringify(this.sequenceOut));
    if (!this.disableShowSelect) {
      await this.getShowList();
    }

    if (this.sequenceOut && this.sequenceOut.showId) {
      await this.getEpisodeList();
    }
    this.buildFormData();
    this.isDataReady = true;
  }

  buildFormData() {
    this.dataForm = this.fb.group({
      showId: [this.sequenceOutCopy.showId, [Validators.required]],
      sequenceName: [
        this.sequenceOutCopy.sequenceName,
        [Validators.required, Validators.pattern(AppConstants.itemNameRE)],
      ],
      description: [this.sequenceOutCopy.description],
      episodeId: [this.sequenceOutCopy.episodeId],
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

  async getEpisodeList() {
    await this.episodesService
      .getEpisodeListWithParent(this.sequenceOutCopy.showId)
      .toPromise()
      .then((resp: any) => {
        this.episodes = resp.entity;
      })
      .catch((error: any) => {
        this.episodes = [];
      });
  }

  showChangeHandler() {
    this.sequenceOutCopy.episodeId = null;
    this.dataForm.controls.episodeId.setValue(null);
    this.episodes = [];
    this.sequenceOutCopy.showId = this.dataForm.controls.showId.value;
    this.getEpisodeList();
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
    let successMessage = AppConstants.SEQUENCE_CREATION_SUCCESS;
    let errorMessage = AppConstants.SEQUENCE_CREATION_ERROR;
    let serviceName = "createSequence";
    let isSuccess = false;
    let postObj = JSON.parse(JSON.stringify(this.dataForm.value));
    if (this.mode === "update") {
      postObj.id = this.sequenceOutCopy.id;
      successMessage = AppConstants.SEQUENCE_MODIFICATION_SUCCESS;
      errorMessage = AppConstants.SEQUENCE_MODIFICATION_ERROR;
      serviceName = "updateSequence";
    }
    await this.sequencesService[serviceName](postObj)
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
