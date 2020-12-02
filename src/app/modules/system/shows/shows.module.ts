import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ShowsRoutingModule } from "./shows-routing.module";
import { ShowListComponent } from "./show-list/show-list.component";
import { ShowDetailComponent } from "./show-detail/show-detail.component";
import { NgZorroAntdModule, NZ_I18N, en_US } from "ng-zorro-antd";
import { NgxEchartsModule } from "ngx-echarts";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ShowDetailsTabComponent } from "./show-details-tab/show-details-tab.component";
import { ShotlistTabComponent } from "./shotlist-tab/shotlist-tab.component";
import { TasklistTabComponent } from "./tasklist-tab/tasklist-tab.component";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { ShotDetailComponent } from "./shot-detail/shot-detail.component";
import { CardViewComponent } from "./card-view/card-view.component";
import { ChartViewComponent } from "./chart-view/chart-view.component";
import { SharedModule } from "../../shared/shared.module";
import { SeasonlistTabComponent } from "./seasonlist-tab/seasonlist-tab.component";
import { EpisodelistTabComponent } from "./episodelist-tab/episodelist-tab.component";
import { SequencelistTabComponent } from "./sequencelist-tab/sequencelist-tab.component";
import { AssetlistTabComponent } from "./assetlist-tab/assetlist-tab.component";
import { AssetDetailComponent } from "./asset-detail/asset-detail.component";
import { SpotlistTabComponent } from "./spotlist-tab/spotlist-tab.component";
import { TaskDetailComponent } from "./task-detail/task-detail.component";
// import { TaskDetailTabComponent } from './task-detail-tab/task-detail-tab.component';
// import { VersionlistTabComponent } from './versionlist-tab/versionlist-tab.component';

@NgModule({
  declarations: [
    ShowListComponent,
    ShowDetailComponent,
    ShowDetailsTabComponent,
    ShotlistTabComponent,
    TasklistTabComponent,
    ShotDetailComponent,
    CardViewComponent,
    ChartViewComponent,
    SeasonlistTabComponent,
    EpisodelistTabComponent,
    SequencelistTabComponent,
    AssetlistTabComponent,
    AssetDetailComponent,
    SpotlistTabComponent,
    TaskDetailComponent,
    //TaskDetailTabComponent,
    //VersionlistTabComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ShowsRoutingModule,
    NgZorroAntdModule,
    NgxEchartsModule,
    NgxDatatableModule,
    SharedModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
})
export class ShowsModule {}
