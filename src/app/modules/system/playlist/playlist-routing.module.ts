import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PlaylistHomeComponent } from "./playlist-home/playlist-home.component";
import { AuthGuard } from "../../core/authentication/auth.guard";
import { AnnotationHomeComponent } from "./annotation-home/annotation-home.component";
import { AppConstants } from "src/app/constants/AppConstants";

const routes: Routes = [
  /*{
    path: ":playlistId/annotation",
    component: AnnotationHomeComponent,
    canActivate: [AuthGuard],
    data: { permission: AppConstants.PERMISSIONS.SCREENING },
  },*/
  {
    path: "",
    component: PlaylistHomeComponent,
    canActivate: [AuthGuard],
    data: { permission: AppConstants.PERMISSIONS.PLAYLIST },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlaylistRoutingModule {}
