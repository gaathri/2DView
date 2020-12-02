import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { TaskTypeListComponent } from "./task-type-list/task-type-list.component";
import { WorkStatusListComponent } from "./work-status-list/work-status-list.component";
import { PriorityListComponent } from "./priority-list/priority-list.component";
import { ClientListComponent } from "./client-list/client-list.component";
import { GroupListComponent } from "./group-list/group-list.component";
import { OfficeLocationListComponent } from "./office-location-list/office-location-list.component";
import { DepartmentListComponent } from "./department-list/department-list.component";
import { TemplateScreenComponent } from "./template-screen/template-screen.component";
import { SettingsTabComponent } from "./settings-tab/settings-tab.component";
import { UserListComponent } from "./user-list/user-list.component";
import { MyRoleListComponent } from "./my-role-list/my-role-list.component";
import { AuthGuard } from "../../core/authentication/auth.guard";
import { Role } from "../../shared/model/role";
import { AppConstants } from "src/app/constants/AppConstants";
import { CustomFieldListComponent } from "./custom-field-list/custom-field-list.component";
import { SettingsHomeComponent } from "./settings-home/settings-home.component";
import { StatusListComponent } from "./status-list/status-list.component";

const rolesAllowed = [Role.ADMIN, Role.PLATFORM_ADMIN];
const routes: Routes = [
  {
    path: "users",
    component: UserListComponent,
    canActivate: [AuthGuard],
    data: { permission: AppConstants.PERMISSIONS.USER },
  },
  {
    path: "clients",
    component: ClientListComponent,
    canActivate: [AuthGuard],
    data: { permission: AppConstants.PERMISSIONS.CLIENT },
  },
  {
    path: "priorities",
    component: PriorityListComponent,
    canActivate: [AuthGuard],
    data: { permission: AppConstants.PERMISSIONS.PRIORITY },
  },
  {
    path: "workstatus",
    component: WorkStatusListComponent,
    canActivate: [AuthGuard],
    data: { permission: AppConstants.PERMISSIONS.WORK_STATUS },
  },
  {
    path: "shot-asset-status",
    component: StatusListComponent,
    canActivate: [AuthGuard],
    data: { permission: AppConstants.PERMISSIONS.STATUS },
  },

  {
    path: "tasktypes",
    component: TaskTypeListComponent,
    canActivate: [AuthGuard],
    data: { permission: AppConstants.PERMISSIONS.TASK_TYPE },
  },
  {
    path: "departments",
    component: DepartmentListComponent,
    canActivate: [AuthGuard],
    data: { permission: AppConstants.PERMISSIONS.DEPARTMENT },
  },
  {
    path: "customfields",
    component: CustomFieldListComponent,
    canActivate: [AuthGuard],
    data: { permission: AppConstants.PERMISSIONS.CUSTOM_FIELDS },
  },
  {
    path: "groups",
    component: GroupListComponent,
    canActivate: [AuthGuard],
    data: { permission: AppConstants.PERMISSIONS.GROUP },
  },
  {
    path: "templates",
    component: TemplateScreenComponent,
    canActivate: [AuthGuard],
    data: { permission: AppConstants.PERMISSIONS.TEMPLATE },
  },
  {
    path: "roles",
    component: MyRoleListComponent,
    canActivate: [AuthGuard],
    data: { permission: AppConstants.PERMISSIONS.ROLE },
  },
  {
    path: "officelocations",
    component: OfficeLocationListComponent,
    canActivate: [AuthGuard],
    data: { permission: AppConstants.PERMISSIONS.OFFICE_LOCATION },
  },
  {
    path: "settings",
    component: SettingsHomeComponent,
    canActivate: [AuthGuard],
    data: { roles: rolesAllowed },
  },

  { path: "", redirectTo: "/system/listing/configs/users", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigsRoutingModule {}
