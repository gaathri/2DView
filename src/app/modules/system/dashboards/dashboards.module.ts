import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DashboardsRoutingModule } from "./dashboards-routing.module";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ArtistDashboardComponent } from "./artist-dashboard/artist-dashboard.component";
import { StudioDashboardComponent } from "./studio-dashboard/studio-dashboard.component";
import { HrDashboardComponent } from "./hr-dashboard/hr-dashboard.component";
import { AdminDashboardComponent } from "./admin-dashboard/admin-dashboard.component";
import { ClientDashboardComponent } from "./client-dashboard/client-dashboard.component";
import { ArtistDashboardHomeComponent } from "./artist-dashboard-home/artist-dashboard-home.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgZorroAntdModule, NZ_I18N, en_US } from "ng-zorro-antd";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { SharedModule } from "../../shared/shared.module";
import { StudioDashboardHomeComponent } from "./studio-dashboard-home/studio-dashboard-home.component";
import { HrDashboardHomeComponent } from "./hr-dashboard-home/hr-dashboard-home.component";

@NgModule({
  declarations: [
    DashboardComponent,
    ArtistDashboardComponent,
    StudioDashboardComponent,
    HrDashboardComponent,
    AdminDashboardComponent,
    ClientDashboardComponent,
    ArtistDashboardHomeComponent,
    StudioDashboardHomeComponent,
    HrDashboardHomeComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    NgxDatatableModule,
    SharedModule,
    CommonModule,
    DashboardsRoutingModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
})
export class DashboardsModule {}
