import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FavouritesHomeComponent } from "./favourites-home/favourites-home.component";
import { AuthGuard } from "../../core/authentication/auth.guard";
import { AppConstants } from "src/app/constants/AppConstants";

const routes: Routes = [
  {
    path: "",
    component: FavouritesHomeComponent,
    canActivate: [AuthGuard],
    data: { permission: AppConstants.PERMISSIONS.FAVOURITES },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FavouritesRoutingModule {}
