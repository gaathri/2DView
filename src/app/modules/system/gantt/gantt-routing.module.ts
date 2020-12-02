import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { GanttHomeComponent } from "./gantt-home/gantt-home.component";
import { AuthGuard } from "../../core/authentication/auth.guard";

const routes: Routes = [
  {
    path: "",
    component: GanttHomeComponent,
    canActivate: [AuthGuard],
    data: { permission: "Show" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GanttRoutingModule {}
