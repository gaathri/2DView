import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { TaskTimeSheetComponent } from "./task-time-sheet/task-time-sheet.component";
import { AuthGuard } from "../../core/authentication/auth.guard";
import { AppConstants } from "src/app/constants/AppConstants";

const routes: Routes = [
  {
    path: "",
    component: TaskTimeSheetComponent,
    canActivate: [AuthGuard],
    data: { permission: AppConstants.PERMISSIONS.TIME_SHEET },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimeSheetRoutingModule {}
