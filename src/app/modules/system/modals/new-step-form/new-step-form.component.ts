import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { NzTreeComponent, NzDrawerRef } from "ng-zorro-antd";
import { AppConstants } from "src/app/constants/AppConstants";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { DepartmentsService } from "../../configs/departments.service";
import { TemplatesService } from "../../configs/templates.service";

@Component({
  selector: "app-new-step-form",
  templateUrl: "./new-step-form.component.html",
  styleUrls: ["./new-step-form.component.scss"],
})
export class NewStepFormComponent implements OnInit {
  @ViewChild("nzTreeComponent", { static: false })
  nzTreeComponent: NzTreeComponent;
  @Input() template: any;
  @Input() rows: any;
  isDataReady: boolean;
  taskTypeSequence: any;
  departments: any;
  selectedNodes: any;
  currentIds = [];
  constructor(
    private drawerRef: NzDrawerRef<string>,
    private notificationService: NotificationService,
    private templatesService: TemplatesService,
    private departmentsService: DepartmentsService
  ) {}

  ngOnInit() {
    this.prepareData();
  }
  async prepareData() {
    this.currentIds = [];
    this.rows.map((item: any) => {
      this.currentIds.push(item.taskTypeId);
    });
    this.taskTypeSequence = {
      taskTypeIds: [],
    };
    await this.getDepartmentList();
    this.isDataReady = true;
  }

  async getDepartmentList() {
    await this.departmentsService
      .getDepartmentList()
      .toPromise()
      .then((resp: any) => {
        this.departments = resp.entity;
        if (this.departments && this.departments.length > 0) {
          for (let i = 0; i < this.departments.length; i++) {
            this.departments[i].disabled = true;
            let department = this.departments[i];
            if (
              department &&
              department.children &&
              department.children.length > 0
            )
              for (let j = 0; j < department.children.length; j++) {
                let id = -1;
                if (department.children[j].value) {
                  id = Number(department.children[j].value.split("_")[1]);
                  if (this.currentIds.includes(id)) {
                    department.children[j].disabled = true;
                  }
                }
              }
          }
        }
      })
      .catch((error: any) => {
        this.departments = [];
      });
  }

  onChange($event: string[]): void {}

  async submitHandler() {
    let successMessage = AppConstants.TASK_TEMPLATE_ITEM_ADD_SUCCESS;
    let errorMessage = AppConstants.TASK_TEMPLATE_ITEM_ADD_ERROR;
    let isSuccess = false;
    if (this.selectedNodes && this.selectedNodes.length > 0) {
      for (let i = 0; i < this.selectedNodes.length; i++) {
        this.taskTypeSequence.taskTypeIds.push(
          Number(this.selectedNodes[i].split("_")[1])
        );
      }

      await this.templatesService
        .addTaskTypeSequence(this.template.id, this.taskTypeSequence)
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

  showNotification(info: any) {
    this.notificationService.showNotification(info);
  }

  close(isSuccess): void {
    this.drawerRef.close(isSuccess);
  }
}
