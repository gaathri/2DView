import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DaybookHomeComponent } from "./daybook-home/daybook-home.component";
import { AuthGuard } from "../../core/authentication/auth.guard";
import { AppConstants } from "src/app/constants/AppConstants";

const routes: Routes = [
  {
    path: "",
    component: DaybookHomeComponent,
    canActivate: [AuthGuard],
    data: { permission: AppConstants.PERMISSIONS.DAYBOOK },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DaybookRoutingModule {}
