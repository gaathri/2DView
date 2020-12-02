import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PlaylistRoutingModule } from "./playlist-routing.module";
import { PlaylistHomeComponent } from "./playlist-home/playlist-home.component";
import { SharedModule } from "../../shared/shared.module";
import { AnnotationHomeComponent } from './annotation-home/annotation-home.component';

@NgModule({
  declarations: [PlaylistHomeComponent, AnnotationHomeComponent],
  imports: [CommonModule, PlaylistRoutingModule, SharedModule]
})
export class PlaylistModule {}
