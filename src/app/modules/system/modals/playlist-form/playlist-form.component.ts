import { Component, OnInit, Input } from "@angular/core";
import { NzDrawerRef } from "ng-zorro-antd";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { PlaylistService } from "../../playlist/playlist.service";

@Component({
  selector: "app-playlist-form",
  templateUrl: "./playlist-form.component.html",
  styleUrls: ["./playlist-form.component.scss"],
})
export class PlaylistFormComponent implements OnInit {
  @Input() playlistType: any;
  @Input() playlistOut: any;
  @Input() playlistOutCopy: any;
  @Input() mode: any;

  isDataReady: boolean;
  playlistTypes: any;
  nameMaxLength = AppConstants.MAX_LENGTH_NAME;
  descMaxLength = AppConstants.MAX_LENGTH_DESC;
  btnName: string = "";
  dataForm: FormGroup;
  disabled: boolean;

  constructor(
    private drawerRef: NzDrawerRef<string>,
    private notificationService: NotificationService,
    private helperService: HelperService,
    private playlistService: PlaylistService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.btnName = this.mode === "update" ? "Update" : "Add";
    this.prepareData();
  }

  async prepareData() {
    if (this.playlistType) {
      this.disabled = true;
    } else {
      this.playlistType = AppConstants.PLAYLIST_TYPE.INTERNAL;
    }
    this.playlistTypes = [
      AppConstants.PLAYLIST_TYPE.INTERNAL,
      AppConstants.PLAYLIST_TYPE.EXTERNAL,
    ];

    if (!this.playlistOut) {
      this.playlistOut = {
        playlistType: this.playlistType,
      };
    }
    this.playlistOutCopy = JSON.parse(JSON.stringify(this.playlistOut));
    this.buildFormData();
    this.isDataReady = true;
  }

  buildFormData() {
    this.dataForm = this.fb.group({
      playlistType: [this.playlistOutCopy.playlistType, [Validators.required]],
      name: [
        this.playlistOutCopy.name,
        [Validators.required, Validators.pattern(AppConstants.itemNameRE)],
      ],
      description: [this.playlistOutCopy.description],
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
    let successMessage = AppConstants.PLAYLIST_CREATION_SUCCESS;
    let errorMessage = AppConstants.PLAYLIST_CREATION_ERROR;
    let serviceName = "createPlaylist";
    let isSuccess = false;
    let postObj = JSON.parse(JSON.stringify(this.dataForm.value));
    if (this.mode === "update") {
      postObj.id = this.playlistOutCopy.id;
      successMessage = AppConstants.PLAYLIST_MODIFICATION_SUCCESS;
      errorMessage = AppConstants.PLAYLIST_MODIFICATION_ERROR;
      serviceName = "updatePlaylist";
    }
    await this.playlistService[serviceName](postObj)
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
