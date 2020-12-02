import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { GanttRoutingModule } from "./gantt-routing.module";
import { SharedModule } from "../../shared/shared.module";
import { GanttHomeComponent } from './gantt-home/gantt-home.component';

@NgModule({
  declarations: [GanttHomeComponent],
  imports: [CommonModule, GanttRoutingModule, SharedModule]
})
export class GanttModule {}
