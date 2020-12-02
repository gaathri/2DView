import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { TaskLogFormComponent } from "src/app/modules/system/modals/task-log-form/task-log-form.component";
import { NzDrawerService, NzModalService } from "ng-zorro-antd";
import { WorklogService } from "src/app/modules/system/time-sheet/worklog.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { isFuture } from "date-fns";

@Component({
  selector: "app-task-log-panel",
  templateUrl: "./task-log-panel.component.html",
  styleUrls: ["./task-log-panel.component.scss"],
})
export class TaskLogPanelComponent implements OnInit {
  @Input("selectedDate") selectedDate: any;
  @Input("enableAddLog") enableAddLog: any;
  @Input("userId") userId: any;
  @Output("change") changeEvent: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild("drawerHeader", { static: false }) drawerHeader: TemplateRef<{}>;
  isDataReady: boolean;
  isEmptyData: boolean;
  logs = [1, 2, 3];
  childDrawerRef: any;
  drawerTitle: any;
  taskLogInfo: any;
  taskLogOut: any;
  taskName: any;
  workLogs: any;
  isAlertVisible: boolean;
  worklogToDelete: any;
  isReadOnly: boolean;

  constructor(
    private worklogService: WorklogService,
    private drawerService: NzDrawerService,
    private helperService: HelperService,
    private modalService: NzModalService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.isReadOnly = false;
    if (
      this.helperService.isReadOnly(AppConstants.PERMISSIONS.TIME_SHEET) &&
      this.helperService.isReadOnly(AppConstants.PERMISSIONS.TIME_SHEET_REVIEW)
    ) {
      this.isReadOnly = true;
    }
    this.prepareData();
  }

  async prepareData(date?: any) {
    if (date) {
      this.selectedDate = date;
    }
    await this.getLogsByDate();
    this.isDataReady = true;
    if (this.helperService.isValidArr(this.workLogs)) {
      this.isEmptyData = false;
    } else {
      this.isEmptyData = true;
    }
  }

  getDate() {
    return this.selectedDate;
  }
  getLoggedTime() {
    const total = this.workLogs.reduce(
      (prev: any, next: any) => prev + next.hoursWorked,
      0
    );
    return total;
  }
  getLoggedPercent() {
    return Math.round(
      (this.getLoggedTime() * 100) / AppConstants.HOURS_PER_DAY
    );
  }

  addHandler() {
    this.drawerTitle = "Add Log";
    let loggedDate = this.selectedDate;
    if (isFuture(this.selectedDate)) {
      loggedDate = new Date();
    }
    let taskLogOut = {
      taskId: null,
      notes: null,
      loggedDate: loggedDate,
      hoursWorked: null,
      completionPercentage: null,
    };
    this.openTaskLogForm("create", taskLogOut);
  }

  async getLogsByDate() {
    let date = this.helperService.transformDate(
      this.selectedDate,
      "yyyy-MM-dd"
    );
    await this.worklogService
      .getLogsByDate(date, this.userId)
      .toPromise()
      .then((resp) => {
        this.workLogs = resp.entity;
      })
      .catch((error) => {
        this.workLogs = null;
      });
  }

  async editHandler(worklog: any) {
    await this.getTaskLog(worklog.id);
    if (this.taskLogOut) {
      this.drawerTitle = "Edit Log";
      this.openTaskLogForm("update", this.taskLogOut, this.taskLogOut.taskName);
    }
  }

  async deleteHandler(worklog: any) {
    this.isAlertVisible = true;
    this.worklogToDelete = worklog;
  }

  showNotification(info: any) {
    this.notificationService.showNotification(info);
  }

  deleteLogConfirm = async () => {
    let successMessage = "Work log has been successfully deleted.";
    let errorMessage = "Work log deletion failed.";
    this.isAlertVisible = false;
    await this.worklogService
      .deleteWorklog(this.worklogToDelete.id)
      .toPromise()
      .then((resp) => {
        this.showNotification({
          type: "success",
          title: "Success",
          content: successMessage,
          duration: AppConstants.NOTIFICATION_DURATION,
        });
        this.prepareData();
        this.changeEvent.emit(this.selectedDate);
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

  deleteLogCancel = () => {
    this.isAlertVisible = false;
  };

  async getTaskLog(id: any) {
    this.taskLogOut = null;
    await this.worklogService
      .getWorklog(id)
      .toPromise()
      .then((resp) => {
        if (resp && resp.valid && resp.entity) {
          this.taskLogOut = resp.entity;
        }
      })
      .catch((error) => {});
  }

  getPercent(workLog: any) {
    let percent = 0;
    if (workLog.completionPercentage) {
      percent = Math.round(workLog.completionPercentage);
    }
    return `${percent}%`;
  }

  isExtraHoursWorked(workLog: any) {
    //return true;

    if (workLog && workLog.extraHoursWorked) {
      return true;
    }
    return false;
  }

  openTaskLogForm(mode: any, taskLogOut: any, taskName?: any): void {
    let disableTaskSelect = taskName ? true : false;
    this.childDrawerRef = this.drawerService.create<
      TaskLogFormComponent,
      {
        taskLogOut: any;
        mode: string;
        disableTaskSelect?: boolean;
        taskName?: any;
      },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: TaskLogFormComponent,
      nzContentParams: {
        taskLogOut: taskLogOut,
        mode: mode,
        disableTaskSelect: disableTaskSelect,
        taskName: taskName,
      },
      nzClosable: false,
      nzWidth: "800px",
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
        this.changeEvent.emit(this.selectedDate);
      }
    });
  }

  closeForm(): void {
    this.childDrawerRef.close();
  }
}
