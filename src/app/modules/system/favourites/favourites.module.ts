import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FavouritesRoutingModule } from "./favourites-routing.module";
import { FavouritesHomeComponent } from "./favourites-home/favourites-home.component";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  declarations: [FavouritesHomeComponent],
  imports: [CommonModule, FavouritesRoutingModule, SharedModule]
})
export class FavouritesModule {}
