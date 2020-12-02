import { Component, OnInit, Input } from "@angular/core";
import { NzDrawerRef } from "ng-zorro-antd";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { ShowsService } from "../../shows/shows.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ShotsService } from "../../shows/shots.service";
import { SystemSettingsService } from "../../configs/system-settings.service";

@Component({
  selector: "app-backup-form",
  templateUrl: "./backup-form.component.html",
  styleUrls: ["./backup-form.component.scss"],
})
export class BackupFormComponent implements OnInit {
  @Input() showOut: any;
  showName: any;
  isDataReady: boolean;
  servers: any;
  shots: any;
  taskTypes: any;
  fileTypes: any;
  dataForm: FormGroup;
  btnName: any;
  backupOut: any;
  backupOutCopy: any;
  backupType: any;
  nameMaxLength = AppConstants.MAX_LENGTH_NAME;
  constructor(
    private drawerRef: NzDrawerRef<string>,
    private notificationService: NotificationService,
    private helperService: HelperService,
    private showsService: ShowsService,
    private shotService: ShotsService,
    private systemSettingsService: SystemSettingsService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.showName = this.showOut.showName;
    this.backupOut = {
      showId: this.showOut.id,
      name: null,
      server: null,
      backupType: "show",
      shotIds: null,
      taskTypeIds: null,
      fileTypes: null,
      isLatest: "true",
      includeWorkspace: true,
    };
    this.backupOutCopy = JSON.parse(JSON.stringify(this.backupOut));
    this.btnName = "Backup";
    this.prepareData();
  }
  async prepareData() {
    await this.getServers();
    await this.getShotList();
    await this.getTaskTypes();
    await this.getFiletypes();
    this.buildFormData();
    this.isDataReady = true;
  }
  buildFormData() {
    this.backupType = "show";
    this.backupOutCopy.backupType = "show";
    this.dataForm = this.fb.group({
      showId: [this.backupOutCopy.showId, [Validators.required]],
      server: [this.backupOutCopy.server, [Validators.required]],
      name: [this.backupOutCopy.name, [Validators.required]],
      shotIds: [this.backupOutCopy.shotIds],
      taskTypeIds: [this.backupOutCopy.taskTypeIds, [Validators.required]],
      fileTypes: [this.backupOutCopy.fileTypes, [Validators.required]],
      isLatest: [this.backupOutCopy.isLatest],
      includeWorkspace: [this.backupOutCopy.includeWorkspace],
      backupType: [this.backupOutCopy.backupType],
    });
    this.requiredChange();
  }

  requiredChange(): void {
    this.backupType = this.dataForm.controls.backupType.value;
    if (this.backupType === "selective") {
      this.dataForm.get("shotIds")!.setValidators(Validators.required);
    } else {
      this.dataForm.get("shotIds")!.clearValidators();
      this.dataForm.controls.shotIds.setValue(null);
    }
  }

  showNotification(info: any) {
    this.notificationService.showNotification(info);
  }

  close(isSuccess: any): void {
    this.drawerRef.close(isSuccess);
  }

  async getFiletypes() {
    await this.showsService
      .getFiletypes()
      .toPromise()
      .then((resp: any) => {
        this.fileTypes = resp.entity;
      })
      .catch((error: any) => {
        this.fileTypes = [
          {
            id: 1,
            fileTypeName: "mov",
            description: "mov",
          },
          {
            id: 2,
            fileTypeName: "jpeg",
            description: "jpeg",
          },
          {
            id: 3,
            fileTypeName: "dpx",
            description: "dpx",
          },
        ];
      });
  }

  async getTaskTypes() {
    await this.showsService
      .getTaskTypesByShowId(this.backupOutCopy.showId)
      .toPromise()
      .then((resp: any) => {
        this.taskTypes = resp.entity;
      })
      .catch((error: any) => {
        this.taskTypes = [];
      });
  }

  async getServers() {
    await this.systemSettingsService
      .getBackupServers()
      .toPromise()
      .then((resp: any) => {
        if (resp.entity && resp.entity.backupServers) {
          this.servers = resp.entity.backupServers;
        }
      })
      .catch((error: any) => {
        this.servers = [];
      });
  }

  async getShotList() {
    await this.shotService
      .getShotsByShowId(this.backupOutCopy.showId)
      .toPromise()
      .then((resp: any) => {
        this.shots = resp.entity;
      })
      .catch((error: any) => {
        this.shots = [];
      });
  }

  async submitHandler() {
    for (const i in this.dataForm.controls) {
      this.dataForm.controls[i].markAsDirty();
      this.dataForm.controls[i].updateValueAndValidity();
    }

    if (!this.dataForm.valid) {
      return;
    }
    let successMessage = AppConstants.BACKUP_CREATION_SUCCESS;
    let errorMessage = AppConstants.BACKUP_CREATION_ERROR;
    let isSuccess = false;
    let postObj = JSON.parse(JSON.stringify(this.dataForm.value));
    if (postObj.isLatest === "true") {
      postObj.isLatest = 1;
    } else {
      postObj.isLatest = 0;
    }
    if (postObj.includeWorkspace) {
      postObj.includeWorkspace = 1;
    } else {
      postObj.includeWorkspace = 0;
    }
    // if (postObj.backupType === "show") {
    //   postObj.mode = "ONDEMAND";
    // } else {
    //   postObj.mode = "ONDEMAND";
    // }
    postObj.mode = "ONDEMAND";

    await this.showsService
      .backupShow(postObj)
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
}
