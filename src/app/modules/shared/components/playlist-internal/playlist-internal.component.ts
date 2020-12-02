import {
  Component,
  OnInit,
  Input,
  ViewChild,
  TemplateRef,
} from "@angular/core";
import { Page } from "../../model/page";
import { ShowsService } from "src/app/modules/system/shows/shows.service";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { PlaylistService } from "src/app/modules/system/playlist/playlist.service";
import { NzDrawerService, NzModalService } from "ng-zorro-antd";
import { Router } from "@angular/router";
import { PlaylistInternalTableComponent } from "../playlist-internal-table/playlist-internal-table.component";
import { FormControl } from "@angular/forms";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { PlaylistFormComponent } from "src/app/modules/system/modals/playlist-form/playlist-form.component";
import { RolesService } from "src/app/modules/system/configs/roles.service";

@Component({
  selector: "app-playlist-internal",
  templateUrl: "./playlist-internal.component.html",
  styleUrls: ["./playlist-internal.component.scss"],
})
export class PlaylistInternalComponent implements OnInit {
  @Input() playlistType: any;
  @ViewChild("drawerHeader", { static: false }) drawerHeader: TemplateRef<{}>;
  @ViewChild(PlaylistInternalTableComponent, { static: false })
  tableComponent: PlaylistInternalTableComponent;
  childDrawerRef: any;

  isDataReady: boolean;
  items: any;
  selectedItem: any;
  isSearching: boolean;
  queryField: FormControl = new FormControl();

  drawerTitle: any;
  playlistOut: any;

  @ViewChild("modalTitleTpl", { static: false }) modalTitleTpl: TemplateRef<{}>;
  modalTitle = "Artist & Client Filter";
  isFilterVisible: boolean;
  isFilterApplied: boolean;
  userType: any = "Artist";
  users: any;
  userId: any;

  isShareVisible: boolean;
  shareUserType: any = "Artist";
  shareUsers: any;
  shareUserIds: any;

  isSendVisible: boolean;
  sendUserType: any = "Supervisor";
  sendUsers: any;
  sendUserIds: any;

  isEmailVisible: boolean;
  emailUserType: any = "Artist";
  emailUsers: any;
  emailUserIds: any;

  isDeleteVisible: boolean;

  shotAddBtn: boolean;
  isReadOnly: boolean;

  //playlistType = AppConstants.PLAYLIST_TYPE.INTERNAL;

  constructor(
    private showService: ShowsService,
    private playlistService: PlaylistService,
    private rolesService: RolesService,
    private notificationService: NotificationService,
    private modalService: NzModalService,
    private helperService: HelperService,
    private drawerService: NzDrawerService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isReadOnly = this.helperService.isReadOnly(
      AppConstants.PERMISSIONS.PLAYLIST
    );
    if (
      !this.isReadOnly &&
      (this.playlistType === AppConstants.PLAYLIST_TYPE.INTERNAL ||
        this.playlistType === AppConstants.PLAYLIST_TYPE.EXTERNAL)
    ) {
      this.shotAddBtn = true;
    }
    this.queryField.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((result) => this.prepareData());
    this.prepareData();
  }
  async prepareData() {
    await this.getPlaylists();
    this.isDataReady = true;
    if (this.isValidArr(this.items)) {
      let index = 0;
      if (this.selectedItem) {
        let myItem = this.items.filter(
          (item: any) => item.id === this.selectedItem.id
        );
        if (myItem && myItem[0]) {
          index = this.items.indexOf(myItem[0]);
        }
      }
      this.clickHandler(this.items[index]);
    } else {
      this.clickHandler(null);
    }
  }

  isDailies() {
    if (
      this.playlistType &&
      this.playlistType === AppConstants.PLAYLIST_TYPE.DAILIES
    ) {
      return true;
    }
    return false;
  }

  isInternal() {
    if (
      this.playlistType &&
      this.playlistType === AppConstants.PLAYLIST_TYPE.INTERNAL
    ) {
      return true;
    }
    return false;
  }

  isExternal() {
    if (
      this.playlistType &&
      this.playlistType === AppConstants.PLAYLIST_TYPE.EXTERNAL
    ) {
      return true;
    }
    return false;
  }

  isValidArr(items: any) {
    return this.helperService.isValidArr(items);
  }

  onPlaylistAction(event: any) {
    if (event.id === "edit") {
      this.editHandler();
    } else if (event.id === "delete") {
      this.deleteHandler();
    } else if (event.id === "lock") {
      this.lockHandler();
    } else if (event.id === "send") {
      this.sendHandler();
    } else if (event.id === "share") {
      this.shareHandler();
    } else if (event.id === "archive") {
      this.archiveHandler();
    } else if (event.id === "restore") {
      this.restoreHandler();
    } else if (event.id === "download_feedbacks") {
      this.downloadHandler();
    } else if (event.id === "email_feedbacks") {
      this.emailHandler();
    }
  }

  clickHandler(item: any) {
    /*if (this.selectedItem && this.selectedItem.id === item.id) {
      return;
    }*/
    this.selectedItem = item;
    if (this.tableComponent) {
      this.tableComponent.clickHandler(item);
    }
  }

  addHandler() {
    this.drawerTitle = "Add Playlist";
    let playlistInfo = null;
    this.openPlaylistForm("create", playlistInfo);
  }

  async editHandler() {
    let id = this.selectedItem.id;
    await this.getPlaylist(id);
    if (this.playlistOut) {
      this.drawerTitle = "Edit Playlist";
      this.openPlaylistForm("update", this.playlistOut);
    }
  }
  deleteHandler() {
    this.isDeleteVisible = true;
  }

  deletePlaylistConfirm = async () => {
    let successMessage = "Playlist has been successfully deleted.";
    let errorMessage = "Playlist deletion failed.";
    this.isDeleteVisible = false;
    await this.playlistService
      .deletePlaylist(this.selectedItem.id)
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

  deletePlaylistCancel = () => {
    this.isDeleteVisible = false;
  };

  async sendHandler() {
    this.sendUserIds = null;
    await this.getSentUsers();
    this.sendUserType = "Supervisor";
    this.isSendVisible = true;
    this.prepareSendUserList();
  }

  async shareHandler() {
    this.shareUserIds = null;
    await this.getSharedUsers();
    this.shareUserType = "Artist";
    this.isShareVisible = true;
    this.prepareShareUserList();
  }

  prepareSendUserList() {
    let privilegeId = AppConstants.SUPERVISOR_PRIVILEGE_ID;
    if (this.sendUserType === "Client") {
      privilegeId = AppConstants.CLIENT_PRIVILEGE_ID;
    }
    this.getSendUsersByPrivilege(privilegeId);
  }

  prepareShareUserList() {
    let privilegeId = AppConstants.ARTIST_PRIVILEGE_ID;
    if (this.shareUserType === "Client") {
      privilegeId = AppConstants.CLIENT_PRIVILEGE_ID;
    }
    this.getShareUsersByPrivilege(privilegeId);
  }

  async onShareUserTypeChange() {
    this.shareUserIds = null;
    await this.getSharedUsers();
    this.prepareShareUserList();
  }

  async onSendUserTypeChange() {
    this.sendUserIds = null;
    await this.getSentUsers();
    this.prepareSendUserList();
  }

  emailHandler() {
    this.emailUserIds = null;
    this.emailUserType = "Artist";
    this.isEmailVisible = true;
    this.prepareEmailUserList();
  }

  prepareEmailUserList() {
    let privilegeId = AppConstants.ARTIST_PRIVILEGE_ID;
    if (this.emailUserType === "Client") {
      privilegeId = AppConstants.CLIENT_PRIVILEGE_ID;
    }
    this.getEmailUsersByPrivilege(privilegeId);
  }

  onEmailUserTypeChange() {
    this.emailUserIds = null;
    this.prepareEmailUserList();
  }

  async getSharedUsers() {
    this.playlistService
      .getSharedUsers(this.selectedItem.id)
      .toPromise()
      .then((resp) => {
        this.shareUserIds = resp.entity;
      })
      .catch((error) => {
        this.shareUserIds = null;
      });
  }

  async getSentUsers() {
    this.playlistService
      .getSentUsers(this.selectedItem.id)
      .toPromise()
      .then((resp) => {
        this.sendUserIds = resp.entity;
      })
      .catch((error) => {
        this.sendUserIds = null;
      });
  }

  sendPlaylist() {
    this.isSendVisible = false;
    if (this.sendUserIds) {
      let successMessage = AppConstants.SEND_PLAYLIST_SUCCESS;
      let errorMessage = AppConstants.SEND_PLAYLIST_ERROR;
      this.playlistService
        .sendPlaylist(this.selectedItem.id, this.sendUserIds)
        .toPromise()
        .then((resp) => {
          this.showNotification({
            type: "success",
            title: "Success",
            content: successMessage,
            duration: AppConstants.NOTIFICATION_DURATION,
          });
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
    }
  }

  sharePlaylist() {
    this.isShareVisible = false;
    if (this.shareUserIds) {
      let successMessage = AppConstants.SHARE_PLAYLIST_SUCCESS;
      let errorMessage = AppConstants.SHARE_PLAYLIST_ERROR;
      this.playlistService
        .sharePlaylist(this.selectedItem.id, this.shareUserIds)
        .toPromise()
        .then((resp) => {
          this.showNotification({
            type: "success",
            title: "Success",
            content: successMessage,
            duration: AppConstants.NOTIFICATION_DURATION,
          });
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
    }
  }

  async lockHandler() {
    let isEditSuccess = false;
    let errorMessage = "Record update failed.";

    let id = this.selectedItem.id;
    await this.playlistService
      .lockPlaylist(id)
      .toPromise()
      .then((resp) => {
        isEditSuccess = true;
        this.prepareData();
      })
      .catch((error) => {
        let errorDetails = this.helperService.getErrorDetails(error);
        if (errorDetails !== "") {
          errorMessage = `<b>${errorMessage}</b>` + errorDetails;
        }
        isEditSuccess = false;
      });

    if (isEditSuccess) {
      this.showNotification({
        type: "success",
        title: "Success",
        content: "Record updated successfully.",
        duration: AppConstants.NOTIFICATION_DURATION,
      });
    } else {
      this.showNotification({
        type: "error",
        title: "Error",
        content: errorMessage,
        duration: AppConstants.NOTIFICATION_DURATION,
      });
    }
  }

  async archiveHandler() {
    let isEditSuccess = false;
    let errorMessage = "Record update failed.";

    let id = this.selectedItem.id;
    await this.playlistService
      .archivePlaylist(id)
      .toPromise()
      .then((resp) => {
        isEditSuccess = true;
        this.prepareData();
      })
      .catch((error) => {
        let errorDetails = this.helperService.getErrorDetails(error);
        if (errorDetails !== "") {
          errorMessage = `<b>${errorMessage}</b>` + errorDetails;
        }
        isEditSuccess = false;
      });
    if (isEditSuccess) {
      this.showNotification({
        type: "success",
        title: "Success",
        content: "Record updated successfully.",
        duration: AppConstants.NOTIFICATION_DURATION,
      });
    } else {
      this.showNotification({
        type: "error",
        title: "Error",
        content: errorMessage,
        duration: AppConstants.NOTIFICATION_DURATION,
      });
    }
  }

  async downloadHandler() {
    let id = this.selectedItem.id;
    let isSuccess = false;
    let errorMessage = "Download feedback failed.";

    this.playlistService.downloadFeedback(this.selectedItem.id).subscribe(
      (res: any) => {
        let fileName = "";
        try {
          let contentDispositionHeader = res.headers.get("Content-Disposition");
          fileName = contentDispositionHeader.split("=")[1];
        } catch (e) {}

        const blob = new Blob([res.body], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.setAttribute("style", "display:none;");
        document.body.appendChild(a);
        a.href = url;
        a.download = fileName;
        a.click();
        isSuccess = true;
        this.showNotification({
          type: "success",
          title: "Success",
          content: "Feedback has been successfully downloaded.",
          duration: AppConstants.NOTIFICATION_DURATION,
        });
      },
      (error) => {
        this.showNotification({
          type: "error",
          title: "Error",
          content: errorMessage,
          duration: AppConstants.NOTIFICATION_DURATION,
        });
      }
    );
  }

  async emailPlaylist() {
    if (!this.helperService.isValidArr(this.emailUserIds)) {
      return;
    }
    this.isEmailVisible = false;
    let id = this.selectedItem.id;
    let isSuccess = false;
    let errorMessage = "Email feedback failed.";

    await this.playlistService
      .emailFeedback(id, this.emailUserIds)
      .toPromise()
      .then((resp) => {
        isSuccess = true;
      })
      .catch((error) => {
        let errorDetails = this.helperService.getErrorDetails(error);
        if (errorDetails !== "") {
          errorMessage = `<b>${errorMessage}</b>` + errorDetails;
        }
        isSuccess = false;
      });
    if (isSuccess) {
      this.showNotification({
        type: "success",
        title: "Success",
        content: "Email has been successfully sent.",
        duration: AppConstants.NOTIFICATION_DURATION,
      });
    } else {
      this.showNotification({
        type: "error",
        title: "Error",
        content: errorMessage,
        duration: AppConstants.NOTIFICATION_DURATION,
      });
    }
  }

  async restoreHandler() {
    let id = this.selectedItem.id;
    let isEditSuccess = false;
    let errorMessage = "Record update failed.";

    await this.playlistService
      .restorePlaylist(id)
      .toPromise()
      .then((resp) => {
        isEditSuccess = true;
        this.prepareData();
      })
      .catch((error) => {
        let errorDetails = this.helperService.getErrorDetails(error);
        if (errorDetails !== "") {
          errorMessage = `<b>${errorMessage}</b>` + errorDetails;
        }
        isEditSuccess = false;
      });
    if (isEditSuccess) {
      this.showNotification({
        type: "success",
        title: "Success",
        content: "Record updated successfully.",
        duration: AppConstants.NOTIFICATION_DURATION,
      });
    } else {
      this.showNotification({
        type: "error",
        title: "Error",
        content: errorMessage,
        duration: AppConstants.NOTIFICATION_DURATION,
      });
    }
  }

  filterHandler() {
    this.isFilterVisible = true;
    this.prepareUserList();
  }

  prepareUserList() {
    let privilegeId = AppConstants.ARTIST_PRIVILEGE_ID;
    if (this.userType === "Client") {
      privilegeId = AppConstants.CLIENT_PRIVILEGE_ID;
    }
    this.getUsersByPrivilege(privilegeId);
  }

  onUserTypeChange() {
    this.userId = null;
    this.prepareUserList();
  }

  applyFilter() {
    this.closeModal();
    if (this.userId) {
      this.getPlaylists();
    }
  }

  resetFilter() {
    this.userType = "Artist";
    this.userId = null;
    this.closeModal();
    this.getPlaylists();
  }

  closeModal() {
    this.isFilterVisible = false;
    this.isFilterApplied = false;
    if (this.userId) {
      this.isFilterApplied = true;
    }
  }

  searchHandler() {}

  clearSearch() {
    this.queryField.setValue("");
    this.isSearching = false;
  }

  infoHandler(event: any, item: any) {
    event.stopPropagation();
  }

  isSelected(item: any) {
    if (this.selectedItem && this.selectedItem.id === item.id) {
      return true;
    }
    return false;
  }

  openPlaylistForm(mode: any, playlistOut: any): void {
    this.childDrawerRef = this.drawerService.create<
      PlaylistFormComponent,
      {
        playlistType: any;
        playlistOut: any;
        mode: string;
      },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: PlaylistFormComponent,
      nzContentParams: {
        playlistType: this.playlistType,
        playlistOut: playlistOut,
        mode: mode,
      },
      nzClosable: false,
      nzWidth: "30%",
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

  getUserName(user: any) {
    return user.firstName + " " + user.lastName;
  }

  getDisplayDate(date: any) {
    return this.helperService.transformDate(
      date,
      AppConstants.DISPLAY_DATE_FORMAT
    );
  }

  showNotification(info: any) {
    this.notificationService.showNotification(info);
  }

  async getShareUsersByPrivilege(privilegeId: any) {
    this.shareUsers = [];
    await this.rolesService
      .getUsersByPrivilege(privilegeId)
      .toPromise()
      .then((resp: any) => {
        this.shareUsers = resp.entity;
      })
      .catch((error: any) => {
        this.shareUsers = [];
      });
  }

  async getSendUsersByPrivilege(privilegeId: any) {
    this.sendUsers = [];
    await this.rolesService
      .getUsersByPrivilege(privilegeId)
      .toPromise()
      .then((resp: any) => {
        this.sendUsers = resp.entity;
      })
      .catch((error: any) => {
        this.sendUsers = [];
      });
  }

  async getEmailUsersByPrivilege(privilegeId: any) {
    await this.rolesService
      .getUsersByPrivilege(privilegeId)
      .toPromise()
      .then((resp: any) => {
        this.emailUsers = resp.entity;
      })
      .catch((error: any) => {
        this.emailUsers = [];
      });
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

  async getPlaylist(id: any) {
    await this.playlistService
      .getPlaylist(id)
      .toPromise()
      .then((resp) => {
        this.playlistOut = resp.entity;
      })
      .catch((error) => {
        this.playlistOut = null;
      });
  }

  async getPlaylists() {
    let params = "";
    if (this.queryField.value) {
      params = "search=" + this.queryField.value + "&";
    }
    if (this.userId) {
      params += "userId=" + this.userId;
    }

    await this.playlistService
      .getPlaylists(this.playlistType, params)
      .toPromise()
      .then((resp) => {
        this.items = resp.entity;
      })
      .catch((error) => {
        this.items = null;
      });
  }
}
