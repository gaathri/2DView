import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ShowListComponent } from "./show-list/show-list.component";
import { ShowDetailComponent } from "./show-detail/show-detail.component";
import { ShotDetailComponent } from "./shot-detail/shot-detail.component";
import { AssetDetailComponent } from "./asset-detail/asset-detail.component";
import { TaskDetailComponent } from "./task-detail/task-detail.component";

import { AuthGuard } from "../../core/authentication/auth.guard";
import { AppConstants } from "src/app/constants/AppConstants";

// const routes: Routes = [
//   { path: "", component: ShowListComponent },
//   { path: ":showId/shots/:shotId", component: ShotDetailComponent },
//   { path: ":showId/shots", component: ShowDetailComponent },
//   { path: ":showId", redirectTo: ':showId/shots', pathMatch: 'full' }
// ];
const routes: Routes = [
  {
    path: "",
    component: ShowListComponent,
    canActivate: [AuthGuard],
    data: { permission: AppConstants.PERMISSIONS.SHOW },
  },
  {
    path: ":showId/assets/:assetId/tasks",
    redirectTo: ":showId/assets/:assetId",
    pathMatch: "full",
  },
  {
    path: ":showId/assets/:assetId/tasks/:taskId",
    component: TaskDetailComponent,
    canActivate: [AuthGuard],
    data: { permission: AppConstants.PERMISSIONS.TASK },
  },
  {
    path: ":showId/shots/:shotId/tasks",
    redirectTo: ":showId/shots/:shotId",
    pathMatch: "full",
  },
  {
    path: ":showId/shots/:shotId/tasks/:taskId",
    component: TaskDetailComponent,
    canActivate: [AuthGuard],
    data: { permission: AppConstants.PERMISSIONS.TASK },
  },
  { path: ":showId/assets", redirectTo: ":showId", pathMatch: "full" },
  {
    path: ":showId/assets/:assetId",
    component: AssetDetailComponent,
    canActivate: [AuthGuard],
    data: { permission: AppConstants.PERMISSIONS.ASSET },
  },
  {
    path: ":showId/shots/:shotId",
    component: ShotDetailComponent,
    canActivate: [AuthGuard],
    data: { permission: AppConstants.PERMISSIONS.SHOW },
  },
  { path: ":showId/shots", redirectTo: ":showId", pathMatch: "full" },
  {
    path: ":showId",
    component: ShowDetailComponent,
    canActivate: [AuthGuard],
    data: { permission: AppConstants.PERMISSIONS.SHOW },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowsRoutingModule {}
