import { Component, OnInit, Input } from "@angular/core";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { NzDrawerRef } from "ng-zorro-antd";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ShowsService } from "../../shows/shows.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { WorklogService } from "../../time-sheet/worklog.service";
import { ShotsService } from "../../shows/shots.service";
import { AssetsService } from "../../shows/assets.service";
import { TasksService } from "../../shows/tasks.service";
import { isFuture, subDays, isBefore, isSameDay } from "date-fns";

@Component({
  selector: "app-task-log-form",
  templateUrl: "./task-log-form.component.html",
  styleUrls: ["./task-log-form.component.scss"],
})
export class TaskLogFormComponent implements OnInit {
  @Input() taskLogOut: any;
  @Input() taskLogOutCopy: any;
  @Input() mode: any;
  @Input() taskName: any;
  @Input() disableTaskSelect: boolean;
  taskNotesMaxLength = 800;

  showName: any;
  shows: any;
  shots: any;
  assets: any;
  departments: any;
  isDataReady: boolean;
  btnName: string = "";
  dataForm: FormGroup;
  tasks: any;
  type = "shot";
  taskCategory: any;
  disableShowSelect: boolean;
  workLogLimit: any;

  constructor(
    private drawerRef: NzDrawerRef<string>,
    private notificationService: NotificationService,
    private helperService: HelperService,
    private worklogService: WorklogService,
    private showsService: ShowsService,
    private shotsService: ShotsService,
    private assetsService: AssetsService,
    private tasksService: TasksService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.workLogLimit = AppConstants.WORK_LOG_LIMIT;
    this.disableShowSelect = this.disableTaskSelect;
    this.btnName = this.mode === "update" ? "Update" : "Add";
    this.prepareData();
  }

  isValidArr(arr: any) {
    return this.helperService.isValidArr(arr);
  }

  async prepareData() {
    if (!this.taskLogOut) {
      this.taskLogOut = {
        taskCategory: this.type ? this.type : "shot",
        showId: null,
        shotId: null,
        assetId: null,
        taskId: null,
        notes: null,
        loggedDate: null,
        hoursWorked: null,
        completionPercentage: null,
      };
    }
    this.taskLogOutCopy = JSON.parse(JSON.stringify(this.taskLogOut));
    if (!this.disableShowSelect) {
      await this.getShowList();
    }
    this.buildFormData();

    //await this.getTasksByArtistId(this.helperService.getUserId());
    this.isDataReady = true;
  }

  buildFormData() {
    if (this.taskLogOut) {
      this.taskCategory = "shot";
      this.taskLogOutCopy.taskCategory = "shot";
      if (this.taskLogOutCopy.shotId) {
      } else if (this.taskLogOutCopy.assetId) {
        this.taskCategory = "asset";
        this.taskLogOutCopy.taskCategory = "asset";
      }
    }
    this.dataForm = this.fb.group({
      taskCategory: [this.taskLogOutCopy.taskCategory],
      showId: [this.taskLogOutCopy.showId, [Validators.required]],
      shotId: [this.taskLogOutCopy.shotId, [Validators.required]],
      assetId: [this.taskLogOutCopy.assetId],
      taskId: [this.taskLogOutCopy.taskId, [Validators.required]],
      notes: [this.taskLogOutCopy.notes, [Validators.required]],
      loggedDate: [this.taskLogOutCopy.loggedDate, [Validators.required]],
      hoursWorked: [
        this.taskLogOutCopy.hoursWorked,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(AppConstants.HOURS_PER_DAY),
        ],
      ],
      extraHoursWorked: [
        this.taskLogOutCopy.extraHoursWorked,
        [Validators.max(AppConstants.EXTRA_HOURS_PER_DAY)],
      ],

      completionPercentage: [
        this.taskLogOutCopy.completionPercentage,
        [Validators.required, Validators.min(1), Validators.max(100)],
      ],
    });

    this.requiredChange();
  }

  requiredChange(): void {
    if (this.disableTaskSelect) {
      this.dataForm.get("showId")!.clearValidators();
      this.dataForm.get("assetId")!.clearValidators();
      this.dataForm.get("shotId")!.clearValidators();
    } else {
      this.taskCategory = this.dataForm.controls.taskCategory.value;
      if (this.taskCategory === "shot") {
        this.dataForm.get("shotId")!.setValidators(Validators.required);
        this.dataForm.get("assetId")!.clearValidators();
        this.dataForm.controls.assetId.setValue(null);
      } else {
        this.dataForm.get("shotId")!.clearValidators();
        this.dataForm.get("assetId")!.setValidators(Validators.required);
        this.dataForm.controls.shotId.setValue(null);
      }
    }
  }

  disableExtraHours() {
    if (
      this.dataForm.controls.hoursWorked.value >= AppConstants.HOURS_PER_DAY
    ) {
      return false;
    }

    this.dataForm.controls.extraHoursWorked.setValue(0);
    return true;
  }

  getHoursPerDay() {
    return AppConstants.HOURS_PER_DAY;
  }

  getExtraHoursPerDay() {
    return AppConstants.EXTRA_HOURS_PER_DAY;
  }

  disabledDate = (startValue: Date): boolean => {
    if (!startValue) {
      return false;
    }
    if (isFuture(startValue)) {
      return true;
    }

    let minDate = subDays(new Date(), this.workLogLimit + 1);
    if (isBefore(startValue, minDate)) {
      return true;
    } else {
      return false;
    }

    /*let today = new Date();
    let nextDay = new Date(today.setDate(today.getDate() + 1));
    return startValue.getTime() > nextDay.getTime();*/
  };

  showChangeHandler() {
    this.taskLogOutCopy.shotId = null;
    this.taskLogOutCopy.assetId = null;
    this.taskLogOutCopy.taskId = null;

    this.dataForm.controls.shotId.setValue(null);
    this.dataForm.controls.assetId.setValue(null);
    this.dataForm.controls.taskId.setValue(null);

    this.shots = [];
    this.assets = [];
    this.tasks = [];

    this.taskLogOutCopy.showId = this.dataForm.controls.showId.value;
    if (this.taskLogOutCopy.showId) {
      this.getShotList(this.taskLogOutCopy.showId);
      this.getAssetList(this.taskLogOutCopy.showId);
    }
  }

  shotChangeHandler(e: any) {
    this.taskLogOutCopy.taskId = null;
    this.dataForm.controls.taskId.setValue(null);
    this.taskLogOutCopy.shotId = this.dataForm.controls.shotId.value;
    if (this.taskLogOutCopy.shotId) {
      this.getShotTasksById(this.taskLogOutCopy.shotId);
    }
  }

  assetChangeHandler(e: any) {
    this.taskLogOutCopy.taskId = null;
    this.dataForm.controls.taskId.setValue(null);
    this.taskLogOutCopy.assetId = this.dataForm.controls.assetId.value;
    if (this.taskLogOutCopy.assetId) {
      this.getAssetTasksById(this.taskLogOutCopy.assetId);
    }
  }

  async getShowList() {
    await this.showsService
      .getShowsByArist()
      .toPromise()
      .then((resp: any) => {
        this.shows = resp.entity;
      })
      .catch((error: any) => {
        this.shows = [];
      });
  }

  async getShotList(id) {
    await this.shotsService
      .getShotsByArist(id)
      .toPromise()
      .then((resp: any) => {
        this.shots = resp.entity;
      })
      .catch((error: any) => {
        this.shots = [];
      });
  }

  async getAssetList(id) {
    await this.assetsService
      .getAssetsByArist(id)
      .toPromise()
      .then((resp: any) => {
        this.assets = resp.entity;
      })
      .catch((error: any) => {
        this.assets = [];
      });
  }

  async getAssetTasksById(id) {
    await this.tasksService
      .getAssetTasksById(id)
      .toPromise()
      .then((resp: any) => {
        this.tasks = resp.entity;
      })
      .catch((error: any) => {
        this.tasks = [];
      });
  }

  async getShotTasksById(id) {
    await this.tasksService
      .getShotTasksById(id)
      .toPromise()
      .then((resp: any) => {
        this.tasks = resp.entity;
      })
      .catch((error: any) => {
        this.tasks = [];
      });
  }

  /*async getTasksByArtistId(id: any) {
    await this.showsService
      .getTasksByArtistId(id)
      .toPromise()
      .then((resp: any) => {
        this.tasks = resp;
      })
      .catch((error: any) => {
        this.tasks = [];
      });
  }*/

  async submitHandler() {
    for (const i in this.dataForm.controls) {
      this.dataForm.controls[i].markAsDirty();
      this.dataForm.controls[i].updateValueAndValidity();
    }
    if (!this.dataForm.valid) {
      return;
    }
    let successMessage = AppConstants.WORK_LOG_CREATION_SUCCESS;
    let errorMessage = AppConstants.WORK_LOG_CREATION_ERROR;
    let serviceName = "createWorklog";
    let isSuccess = false;
    let postObj = JSON.parse(JSON.stringify(this.dataForm.value));
    if (postObj.loggedDate) {
      postObj.loggedDate = this.helperService.transformDate(
        new Date(postObj.loggedDate),
        "yyyy-MM-dd"
      );
    }
    if (this.mode === "update") {
      postObj.id = this.taskLogOutCopy.id;
      postObj.userId = this.taskLogOutCopy.userId;
      successMessage = AppConstants.WORK_LOG_MODIFICATION_SUCCESS;
      errorMessage = AppConstants.WORK_LOG_MODIFICATION_ERROR;
      serviceName = "updateWorklog";
    }
    await this.worklogService[serviceName](postObj)
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

  showNotification(info: any) {
    this.notificationService.showNotification(info);
  }

  close(isSuccess): void {
    this.drawerRef.close(isSuccess);
  }

  getLoggedDate() {
    return this.getDisplayDate(this.dataForm.value.loggedDate);
  }

  getDisplayDate(date: any) {
    return this.helperService.transformDate(
      date,
      AppConstants.DISPLAY_DATE_FORMAT
    );
  }

  getDisplayDateFormat() {
    return AppConstants.DISPLAY_DATE_FORMAT;
  }
}
