import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgZorroAntdModule, NZ_I18N, en_US } from "ng-zorro-antd";

import { ConfigsRoutingModule } from "./configs-routing.module";
import { TaskTypeListComponent } from "./task-type-list/task-type-list.component";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { WorkStatusListComponent } from "./work-status-list/work-status-list.component";
import { PriorityListComponent } from "./priority-list/priority-list.component";
import { ClientListComponent } from "./client-list/client-list.component";
import { GroupListComponent } from "./group-list/group-list.component";
import { DepartmentListComponent } from "./department-list/department-list.component";
import { TemplateScreenComponent } from "./template-screen/template-screen.component";
import { TemplateListComponent } from "./template-list/template-list.component";
import { TemplateTableComponent } from "./template-table/template-table.component";
import { TemplateTreeTableComponent } from "./template-tree-table/template-tree-table.component";
import { SettingsTabComponent } from "./settings-tab/settings-tab.component";
import { UserListComponent } from "./user-list/user-list.component";
import { SharedModule } from "../../shared/shared.module";
import { MyRoleListComponent } from "./my-role-list/my-role-list.component";
import { CustomFieldListComponent } from "./custom-field-list/custom-field-list.component";
import { OfficeLocationListComponent } from "./office-location-list/office-location-list.component";
import { SettingsHomeComponent } from "./settings-home/settings-home.component";
import { StatusListComponent } from "./status-list/status-list.component";
import { EmailTemplateListComponent } from "./email-template-list/email-template-list.component";
import { QuillModule } from "ngx-quill";

@NgModule({
  declarations: [
    GroupListComponent,
    TaskTypeListComponent,
    WorkStatusListComponent,
    PriorityListComponent,
    ClientListComponent,
    DepartmentListComponent,
    TemplateScreenComponent,
    TemplateListComponent,
    TemplateTableComponent,
    TemplateTreeTableComponent,
    SettingsTabComponent,
    UserListComponent,
    MyRoleListComponent,
    CustomFieldListComponent,
    OfficeLocationListComponent,
    SettingsHomeComponent,
    StatusListComponent,
    EmailTemplateListComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    NgxDatatableModule,
    CommonModule,
    ConfigsRoutingModule,
    SharedModule,
    QuillModule.forRoot(),
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
})
export class ConfigsModule {}
