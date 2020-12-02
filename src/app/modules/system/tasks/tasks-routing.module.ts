import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ArtistTaskListComponent } from "./artist-task-list/artist-task-list.component";
import { AuthGuard } from "../../core/authentication/auth.guard";
import { ArtistTaskDetailComponent } from "./artist-task-detail/artist-task-detail.component";
import { AppConstants } from "src/app/constants/AppConstants";

const routes: Routes = [
  {
    path: ":taskId",
    component: ArtistTaskDetailComponent,
    canActivate: [AuthGuard],
    data: { permission: AppConstants.PERMISSIONS.MY_TASK },
  },
  {
    path: "",
    component: ArtistTaskListComponent,
    canActivate: [AuthGuard],
    data: { permission: AppConstants.PERMISSIONS.MY_TASK },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TasksRoutingModule {}
