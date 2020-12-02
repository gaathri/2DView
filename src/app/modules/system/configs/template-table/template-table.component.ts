import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  Input,
} from "@angular/core";
import { TemplatesService } from "../templates.service";
import { NzDrawerService } from "ng-zorro-antd";
import { NewStepFormComponent } from "../../modals/new-step-form/new-step-form.component";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { AppConstants } from "src/app/constants/AppConstants";

@Component({
  selector: "app-template-table",
  templateUrl: "./template-table.component.html",
  styleUrls: ["./template-table.component.scss"],
})
export class TemplateTableComponent implements OnInit {
  @ViewChild("drawerHeader", { static: false }) drawerHeader: TemplateRef<{}>;
  @Input() selectedTemplate: any;
  @Input() isReadOnly: any;

  childDrawerRef: any;
  rows: any;
  editing = {};
  isEditSuccess: boolean;

  constructor(
    private drawerService: NzDrawerService,
    private templatesService: TemplatesService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {}

  isDisabled(template?: any) {
    if (this.isReadOnly) {
      return true;
    }
    if (template && template.isDefault === 1) {
      return true;
    }
    return false;
  }

  addHandler() {
    this.openForm();
  }

  getColorCode(row: any) {
    return row.colorCode ? row.colorCode : "#fff";
  }

  async deleteHandler(row: any) {
    let isDeleteSuccess = false;
    await this.templatesService
      .deleteTaskTypeSequence(row.id)
      .toPromise()
      .then((resp: any) => {
        isDeleteSuccess = true;
      })
      .catch((error: any) => {
        isDeleteSuccess = false;
      });

    if (isDeleteSuccess) {
      this.showNotification({
        type: "success",
        title: "Success",
        content: "Record removed successfully.",
        duration: AppConstants.NOTIFICATION_DURATION,
      });
      this.reloadTable();
    } else {
      this.showNotification({
        type: "error",
        title: "Error",
        content: "Record deletion failed.",
        duration: AppConstants.NOTIFICATION_DURATION,
      });
    }
  }

  enableEdit(row: any, colName: any) {
    this.resetEditFlags();
    this.editing[row.id + "-" + colName] = true;
  }

  resetEditFlags() {
    for (let key in this.editing) {
      if (this.editing.hasOwnProperty(key)) {
        this.editing[key] = false;
      }
    }
  }

  async updateValue(row: any, colName: any, event: any) {
    if (row[colName] != event.target.value) {
      let taskId = row.id;
      let taskIn = {
        type: colName,
      };
      taskIn[colName] = event.target.value;
      await this.updateConfirm(taskId, taskIn);
    }
    if (this.isEditSuccess) {
      row[colName] = event.target.value;
      this.reloadTable();
    }
    this.editing[row.id + "-" + colName] = false;
  }

  async updateConfirm(taskId: any, taskIn: any) {
    this.isEditSuccess = false;
    await this.templatesService
      .inlineEdit(taskId, taskIn)
      .toPromise()
      .then((resp: any) => {
        this.isEditSuccess = true;
      })
      .catch((error: any) => {
        this.isEditSuccess = false;
      });
    if (this.isEditSuccess) {
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
        content: "Record update failed.",
        duration: AppConstants.NOTIFICATION_DURATION,
      });
    }
  }

  showNotification(info: any) {
    this.notificationService.showNotification(info);
  }

  openForm(): void {
    this.childDrawerRef = this.drawerService.create<
      NewStepFormComponent,
      { template: any; rows: any },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: NewStepFormComponent,
      nzContentParams: {
        template: this.selectedTemplate,
        rows: this.rows,
      },
      nzClosable: false,
      nzWidth: "30%",
      nzWrapClassName: "modal-wrapper",
    });

    this.childDrawerRef.afterOpen.subscribe(() => {});

    this.childDrawerRef.afterClose.subscribe((isSuccess) => {
      if (isSuccess) {
        this.reloadTable();
      }
    });
  }

  closeForm(): void {
    this.childDrawerRef.close();
  }

  reloadTable() {
    this.clickHandler(this.selectedTemplate);
  }

  clickHandler(template: any) {
    if (template) {
      this.selectedTemplate = template;
      this.getTaskTemplateTableInfo(template);
    }
  }

  async getTaskTemplateTableInfo(template: any) {
    await this.templatesService
      .getTaskTemplateTableInfo(template.id)
      .toPromise()
      .then((resp: any) => {
        this.rows = resp.entity;
      })
      .catch((error: any) => {
        this.rows = null;
      });
  }
}
