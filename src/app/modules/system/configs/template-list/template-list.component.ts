import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  Input,
} from "@angular/core";
import { TemplatesService } from "../templates.service";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { TemplateTableComponent } from "../template-table/template-table.component";
import { TemplateTreeTableComponent } from "../template-tree-table/template-tree-table.component";
import { InteractionService } from "src/app/modules/core/services/interaction.service";
import { HelperService } from "src/app/modules/core/services/helper.service";

@Component({
  selector: "app-template-list",
  templateUrl: "./template-list.component.html",
  styleUrls: ["./template-list.component.scss"],
})
export class TemplateListComponent implements OnInit, AfterViewInit {
  @Input() type: any;
  @ViewChild(TemplateTableComponent, { static: false })
  tableComponent: TemplateTableComponent;
  @ViewChild(TemplateTreeTableComponent, { static: false })
  treeTableComponent: TemplateTreeTableComponent;
  isDataReady: boolean;
  editingName: boolean;
  templateList: any;
  selectedTemplate: any;
  templateTypeId: any;
  title: any;
  isReadOnly: boolean;

  constructor(
    private templatesService: TemplatesService,
    private notificationService: NotificationService,
    private interactionService: InteractionService,
    private helperService: HelperService
  ) {}

  ngOnInit() {
    this.interactionService.sendInteraction("breadcrumb", "template listing");
    this.helperService.isGlobalAddEnabled = true;
    switch (this.type) {
      case "show":
        this.templateTypeId = AppConstants.SHOW_TEMPLATES_ID;
        this.title = "Show";
        break;
      case "shot":
        this.templateTypeId = AppConstants.SHOT_TEMPLATES_ID;
        this.title = "Shot";
        break;
      case "task":
        this.templateTypeId = AppConstants.TASK_TEMPLATES_ID;
        this.title = "Task";
        break;
      case "pack":
        this.templateTypeId = AppConstants.PACKING_TEMPLATES_ID;
        this.title = "Packing";
        break;
      default:
        break;
    }
    this.isReadOnly = this.helperService.isReadOnly(
      AppConstants.PERMISSIONS.TEMPLATE
    );
  }

  isDisabled(template?: any) {
    let disabled = false;
    if (this.isReadOnly) {
      return true;
    }
    if (template && template.isDefault === 1) {
      disabled = true;
    }
    return disabled;
  }

  isEditable(template?: any) {}

  ngAfterViewInit(): void {
    if (this.templateTypeId) {
      this.prepareData();
    }
  }

  async prepareData() {
    await this.getTemplatesByType();
    if (this.templateList) {
      this.isDataReady = true;
      this.clickHandler(this.templateList[0]);
    }
  }

  async addTemplateHandler() {
    await this.templatesService
      .cloneTaskTemplate(this.templateTypeId)
      .toPromise()
      .then((resp: any) => {
        this.reloadList();
      })
      .catch((error: any) => {});
  }

  clickHandler(template: any) {
    if (this.selectedTemplate && this.selectedTemplate.id === template.id) {
      return;
    }
    this.selectedTemplate = template;
    if (this.type === "task") {
      this.tableComponent.clickHandler(template);
    } else {
      this.treeTableComponent.clickHandler(template);
    }
  }

  isSelected(template: any) {
    if (this.selectedTemplate && this.selectedTemplate.id === template.id) {
      return true;
    }
    return false;
  }

  enableNameEdit() {
    this.editingName = true;
  }

  async updateName(event: any) {
    if (event.target.value) {
      if (this.selectedTemplate.templateName !== event.target.value) {
        let isUpdateSuccess = false;
        let templateId = this.selectedTemplate.id;
        let templateIn = {
          type: "templateName",
        };
        templateIn["templateName"] = event.target.value;
        await this.templatesService
          .editTaskTemplateName(templateId, templateIn)
          .toPromise()
          .then((resp: any) => {
            isUpdateSuccess = true;
          })
          .catch((error: any) => {
            isUpdateSuccess = false;
          });

        if (isUpdateSuccess) {
          this.showNotification({
            type: "success",
            title: "Success",
            content: "Name updated successfully.",
            duration: AppConstants.NOTIFICATION_DURATION,
          });
          this.selectedTemplate.templateName = event.target.value;
          this.reloadList();
        } else {
          this.showNotification({
            type: "error",
            title: "Error",
            content: "Name update failed.",
            duration: AppConstants.NOTIFICATION_DURATION,
          });
        }
      }
    }
    this.editingName = false;
  }

  async deleteTemplateHandler(template: any) {
    let isDeleteSuccess = false;
    await this.templatesService
      .deleteTaskTemplate(template.id)
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
        content: "Template removed successfully.",
        duration: AppConstants.NOTIFICATION_DURATION,
      });
      this.reloadList();
      this.clickHandler(this.templateList[0]);
    } else {
      this.showNotification({
        type: "error",
        title: "Error",
        content: "Template deletion failed.",
        duration: AppConstants.NOTIFICATION_DURATION,
      });
    }
  }

  showNotification(info: any) {
    this.notificationService.showNotification(info);
  }

  reloadList() {
    this.getTemplatesByType();
  }

  async getTemplatesByType() {
    await this.templatesService
      .getTemplatesByType(this.templateTypeId)
      .toPromise()
      .then((resp: any) => {
        this.templateList = resp.entity;
      })
      .catch((error: any) => {
        this.templateList = null;
      });
  }
}
