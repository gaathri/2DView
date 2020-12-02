import { Component, OnInit, Input } from "@angular/core";
import { NzDrawerRef } from "ng-zorro-antd";
import { RolesService } from "../../configs/roles.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { PlaylistService } from "../../playlist/playlist.service";

@Component({
  selector: "app-share-playlist",
  templateUrl: "./share-playlist.component.html",
  styleUrls: ["./share-playlist.component.scss"],
})
export class SharePlaylistComponent implements OnInit {
  @Input() playlistId: any;
  @Input() playlistType: any;
  @Input() shareOut: any;
  @Input() shareOutCopy: any;

  isDataReady: boolean;
  users: any;
  mainForm: FormGroup;

  constructor(
    private drawerRef: NzDrawerRef<string>,
    private playlistService: PlaylistService,
    private rolesService: RolesService,
    private helperService: HelperService,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.prepareData();
  }

  prepareData() {
    this.shareOutCopy = JSON.parse(JSON.stringify(this.shareOut));
    if (this.playlistType === "external") {
    }
    let privilegeId = AppConstants.ARTIST_PRIVILEGE_ID;
    if (this.playlistType === "external") {
      privilegeId = AppConstants.CLIENT_PRIVILEGE_ID;
    }
    this.getUsersByPrivilege(privilegeId);
    this.buildFormData();
    this.isDataReady = true;
  }

  buildFormData() {
    this.mainForm = this.fb.group({
      userIds: [this.shareOutCopy.userIds, [Validators.required]],
    });
  }

  getUserName(user: any) {
    return user.firstName + " " + user.lastName;
  }

  showNotification(info: any) {
    this.notificationService.showNotification(info);
  }

  isValidArr(arr: any) {
    return this.helperService.isValidArr(arr);
  }

  async submitHandler() {
    for (const i in this.mainForm.controls) {
      this.mainForm.controls[i].markAsDirty();
      this.mainForm.controls[i].updateValueAndValidity();
    }

    if (!this.mainForm.valid) {
      return;
    }

    let successMessage = AppConstants.SHARE_PLAYLIST_SUCCESS;
    let errorMessage = AppConstants.SHARE_PLAYLIST_ERROR;
    let isSuccess = false;
    await this.playlistService
      .sharePlaylist(this.playlistId, this.mainForm.value.userIds.toString())
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

  async getUsersByPrivilege(privilegeId: any) {
    await this.rolesService
      .getUsersByPrivilege(privilegeId)
      .toPromise()
      .then((resp: any) => {
        this.users = resp.entity;
      })
      .catch((error: any) => {
        this.users = [];
      });
  }

  close(isSuccess): void {
    this.drawerRef.close(isSuccess);
  }
}
