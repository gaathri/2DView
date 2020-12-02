import { NgModule } from "@angular/core";
import { CommonModule, DecimalPipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NumericDirective } from "./directives/numeric.directive";
import { ImagePreloadDirective } from "./directives/image-preload.directive";
import { AvatarComponent } from "./components/avatar/avatar.component";
import { NgZorroAntdModule, NZ_I18N, en_US } from "ng-zorro-antd";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { FlexLayoutModule } from "@angular/flex-layout";
import { ColorPickerModule } from "ngx-color-picker";
import { NgxImageCompressService } from "ngx-image-compress";
import { AngularDraggableModule } from "angular2-draggable";
//import { GSTCComponent } from "angular-gantt-schedule-timeline-calendar";
import {
  GSTCComponent,
  AngularGanttScheduleTimelineCalendarModule,
} from "angular-gantt-schedule-timeline-calendar";

import { ProgressComponent } from "./components/progress/progress.component";
import { NodataComponent } from "./components/nodata/nodata.component";
import { ImageUploadComponent } from "./components/image-upload/image-upload.component";
import { ImageComponent } from "./components/image/image.component";
import { UserListByRoleComponent } from "./components/user-list-by-role/user-list-by-role.component";
import { ColorPickerComponent } from "./components/color-picker/color-picker.component";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { StarPanelComponent } from "./components/star-panel/star-panel.component";
import { ProgressPanelComponent } from "./components/progress-panel/progress-panel.component";
import { ActivityLogPanelComponent } from "./components/activity-log-panel/activity-log-panel.component";
import { StarDetailsComponent } from "./components/star-details/star-details.component";
import { ManpowerDetailsComponent } from "./components/manpower-details/manpower-details.component";
import { NgxEchartsModule } from "ngx-echarts";
import { ArtistDetailsComponent } from "./components/artist-details/artist-details.component";
import { TaskListReportComponent } from "./components/task-list-report/task-list-report.component";
import { ArtistTimeSheetComponent } from "./components/artist-time-sheet/artist-time-sheet.component";
import { StudioTimeSheetComponent } from "./components/studio-time-sheet/studio-time-sheet.component";
import { CalendarModule, DateAdapter } from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import { CalendarViewComponent } from "./components/calendar-view/calendar-view.component";
import { TaskLogPanelComponent } from "./components/task-log-panel/task-log-panel.component";
import { ArtistTableViewComponent } from "./components/artist-table-view/artist-table-view.component";
import { ReportTemplateComponent } from "./components/report-template/report-template.component";
import { ReportChartComponent } from "./components/report-chart/report-chart.component";
import { ReportTemplateListComponent } from "./components/report-template-list/report-template-list.component";
import { NotifyItemComponent } from "./components/notify-item/notify-item.component";
import { NotesComponent } from "./components/notes/notes.component";
import { QuillModule } from "ngx-quill";
import { KanbanComponent } from "./components/kanban/kanban.component";
import { DefaultListingComponent } from "./components/default-listing/default-listing.component";
import { TaskOverviewComponent } from "./components/task-overview/task-overview.component";
import { TaskDetailTabComponent } from "./components/task-detail-tab/task-detail-tab.component";
import { VersionlistTabComponent } from "./components/versionlist-tab/versionlist-tab.component";
import { PlaylistTabComponent } from "./components/playlist-tab/playlist-tab.component";
import { PlaylistInternalComponent } from "./components/playlist-internal/playlist-internal.component";
import { FavouriteTabComponent } from "./components/favourite-tab/favourite-tab.component";
import { FavoriteShowsComponent } from "./components/favorite-shows/favorite-shows.component";
import { AnnotationComponent } from "./components/annotation/annotation.component";
import { ReviewScreenComponent } from "./components/review-screen/review-screen.component";
import { GanttComponent } from "./components/gantt/gantt.component";
import { NgGanttEditorModule } from "ng-gantt";
import { HrCalendarComponent } from "./components/hr-calendar/hr-calendar.component";
import { HolidayListComponent } from "./components/holiday-list/holiday-list.component";
import { HrKpiComponent } from "./components/hr-kpi/hr-kpi.component";
import { HrAttendanceComponent } from "./components/hr-attendance/hr-attendance.component";
import { OverallLeaveListComponent } from "./components/overall-leave-list/overall-leave-list.component";
import { UserLeaveListComponent } from "./components/user-leave-list/user-leave-list.component";
import { FavoriteUsersComponent } from "./components/favorite-users/favorite-users.component";
import { FavoriteShotsComponent } from "./components/favorite-shots/favorite-shots.component";
import { FavoriteAssetsComponent } from "./components/favorite-assets/favorite-assets.component";
import { PlaylistInternalTableComponent } from "./components/playlist-internal-table/playlist-internal-table.component";
import { IconPickerComponent } from "./components/icon-picker/icon-picker.component";
import { ShotDetailTabComponent } from "./components/shot-detail-tab/shot-detail-tab.component";
import { AssetDetailTabComponent } from "./components/asset-detail-tab/asset-detail-tab.component";
import { CalendarComponent } from "./components/calendar/calendar.component";
import { DaybookReportComponent } from "./components/daybook-report/daybook-report.component";
import { GanttChartComponent } from "./components/gantt-chart/gantt-chart.component";
import { GanttTabComponent } from "./components/gantt-tab/gantt-tab.component";
import { GanttResourceComponent } from "./components/gantt-resource/gantt-resource.component";
import { ShowGanttComponent } from "./components/show-gantt/show-gantt.component";
import { PeopleGanttComponent } from "./components/people-gantt/people-gantt.component";
import { SafeHtmlPipe } from "./pipes/safe-html.pipe";

@NgModule({
  declarations: [
    ProgressComponent,
    AvatarComponent,
    NumericDirective,
    ImagePreloadDirective,
    NodataComponent,
    ImageUploadComponent,
    ImageComponent,
    UserListByRoleComponent,
    ColorPickerComponent,
    PageNotFoundComponent,
    StarPanelComponent,
    ProgressPanelComponent,
    ActivityLogPanelComponent,
    StarDetailsComponent,
    ManpowerDetailsComponent,
    ArtistDetailsComponent,
    TaskListReportComponent,
    ArtistTimeSheetComponent,
    StudioTimeSheetComponent,
    CalendarViewComponent,
    TaskLogPanelComponent,
    ArtistTableViewComponent,
    ReportTemplateComponent,
    ReportChartComponent,
    ReportTemplateListComponent,
    NotifyItemComponent,
    NotesComponent,
    KanbanComponent,
    DefaultListingComponent,
    TaskOverviewComponent,
    TaskDetailTabComponent,
    VersionlistTabComponent,
    PlaylistTabComponent,
    PlaylistInternalComponent,
    FavouriteTabComponent,
    FavoriteShowsComponent,
    AnnotationComponent,
    ReviewScreenComponent,
    GanttComponent,
    HrCalendarComponent,
    HolidayListComponent,
    HrKpiComponent,
    HrAttendanceComponent,
    OverallLeaveListComponent,
    UserLeaveListComponent,
    FavoriteUsersComponent,
    FavoriteShotsComponent,
    FavoriteAssetsComponent,
    PlaylistInternalTableComponent,
    IconPickerComponent,
    ShotDetailTabComponent,
    AssetDetailTabComponent,
    CalendarComponent,
    DaybookReportComponent,
    GanttChartComponent,
    GanttTabComponent,
    GanttResourceComponent,
    ShowGanttComponent,
    PeopleGanttComponent,
    SafeHtmlPipe,
  ],
  imports: [
    AngularGanttScheduleTimelineCalendarModule,
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    NgxEchartsModule,
    NgxDatatableModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    QuillModule.forRoot(),
    FlexLayoutModule,
    ColorPickerModule,
    NgGanttEditorModule,
    AngularDraggableModule,
  ],
  exports: [
    SafeHtmlPipe,
    ProgressComponent,
    AvatarComponent,
    NumericDirective,
    ImagePreloadDirective,
    NodataComponent,
    ImageUploadComponent,
    ImageComponent,
    UserListByRoleComponent,
    ColorPickerComponent,
    PageNotFoundComponent,
    StarPanelComponent,
    ProgressPanelComponent,
    ActivityLogPanelComponent,
    StarDetailsComponent,
    ManpowerDetailsComponent,
    ArtistDetailsComponent,
    TaskListReportComponent,
    ArtistTimeSheetComponent,
    StudioTimeSheetComponent,
    ReportTemplateComponent,
    NotifyItemComponent,
    NotesComponent,
    KanbanComponent,
    DefaultListingComponent,
    TaskOverviewComponent,
    PlaylistTabComponent,
    FavouriteTabComponent,
    ReviewScreenComponent,
    GanttTabComponent,
    //GanttComponent,
    //GanttChartComponent,
    HrCalendarComponent,
    HolidayListComponent,
    HrKpiComponent,
    HrAttendanceComponent,
    IconPickerComponent,
    ShotDetailTabComponent,
    AssetDetailTabComponent,
    DaybookReportComponent,
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    DecimalPipe,
    NgxImageCompressService,
  ],
})
export class SharedModule {}
